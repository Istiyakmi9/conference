import * as store from "../appSetting/store.js";
import * as ui from "../uiManager/handleAppUI.js";
import * as constants from "../appSetting/constants.js";
import * as ws from "../webSocketHandler/webRTCInitializer.js";
import * as peer from "../webSocketHandler/peerManager.js";

/**----------------------------------- Old code ------------------------------
 * 
 * 
 export const sendMessage = () => {
	let request = {
		"senderName": localStorage.getItem("name"),
		"content": $('#msg').val(),
		"recipientId": localStorage.getItem("channelId")
	}
	
	_stomp.send('/app/message', { }, JSON.stringify(request));
}

export const diconnectSession = () => {
	if(_stomp !== null) {
		_stomp.disconnect();
	}
	//enableConnect();
	console.log('Disconnected');
}

export const webRTCResposneMessage = (data) => {
    console.log("handle webRTC message channel")
    console.log(data);
};
    
export const handlerPreRequestOffer = (data) => {
    console.log("handle pre request offer")
    console.log(data);
};
    
export const preRequestOfferResponse = (data) => {
    console.log("handle webRTC pre request resonse channel")
    console.log(data);
};
    
export const webRTCSignalingChannel = (data) => {
    console.log("handling webRTC Signaling Channel");
    console.log(data);
};
 * 
 * 
 ----------------------------------------------------------------------------------------*/

let peerConnections = {};

export const createPeerConnection = (peerUid, peerUserName, initialCall = false) => {
	peerConnections[peerUid] = {
		"userName": peerUserName,
		"pc": new RTCPeerConnection(constants.Ice_configuration)
	};
	
	peerConnections[peerUid].pc.onicecandidate = (event) => sendICECandidate(event, peerUid);

	if(initialCall)
		peerConnections[peerUid].pc.onnegotiationneeded = (event) => handleNegotiationNeededEvent(event, peerUid);

	peerConnections[peerUid].pc.onconnectionstatechange = (event) => handleConnectionCompletedEvent(event, peerUid);
	
	peerConnections[peerUid].pc.ontrack = (event) => buildRemoteStream(event, peerUid);

	if(store.getState().cameraRequired) {
	// add our stream to peer connection
		let localStream = store.getState().localStream;
		if(localStream === null){
			ws.getLocalPreview(true).then(stream => {
				for(const track of stream.getTracks()) {
					peerConnections[peerUid].pc.addTrack(track, stream);
				}
			});
		} else {
			for(const track of localStream.getTracks()) {
				peerConnections[peerUid].pc.addTrack(track, localStream);
			}
		}
	}
}

const handleConnectionCompletedEvent = (event, peerUid) => {
	console.log("Connection state: " + peerConnections[peerUid].pc.connectionState);
	if(peerConnections[peerUid].pc.connectionState === 'connected') {
		console.log("successfully connected with other peers");
		store.setConnectedPeers(peerUid);
	}
}

const handleNegotiationNeededEvent = (event, peerUid) => {
	console.log("Negotiation needed fired. eveent: ", event);
	sendWebRTCOffer(peerUid);
}

export const handleRequestForOfferByPeer = (data, peerUid) => {
	console.log(`Will create PeerConnection for client: ${data.from}`);
	peerConnections = peer.getPeers();
	
	//--------------------  Create new PeerConnection for current session user -----------------------
	createPeerConnection(peerUid, data.from, true);
}


//----------------------------  Create new video section for peer user -------------------
export const buildRemoteStream = (event, peerUid) => {
	ui.addNewPeerUser(event.streams[0], peerUid);
}

export const handleJoinEvent = (data, peerUid) => {
	console.log("User joined successfully. Creating PeerConnection and send offer.");
	peerConnections = peer.getPeers();
	
	//--------------------  Create new PeerConnection for current session user -----------------------
	createPeerConnection(peerUid, data.from, false);
	ws.sendToServer({
		from: store.getState().localUserName,
		type: constants.REQUEST_FOR_OFFER,
		peerUid: peerUid
	});
}

export const sendWebRTCOffer = async (peerUid) => {
	await peerConnections[peerUid].pc.createOffer().then(description => {
		createDescription(description, peerUid, constants.OFFER);
	}).catch(e => handleErrorMessage(e, peerUid));
}

const createDescription = (description, peerUid, type) => {
	peerConnections[peerUid].pc.setLocalDescription(description).then(() => {
		ws.sendToServer({
			from: store.getState().localUserName,
			type: type,
			sdp: peerConnections[peerUid].pc.localDescription,
			peerUid: peerUid
		});

		console.log(`Sending ${constants.OFFER} to ${peerUid}`);
	}).catch(e => handleErrorMessage(e, peerUid));
}

export const handleWebRTCOfferAndAnswer = (response, peerUid) => {
	peerConnections = peer.getPeers();
	let connection = peerConnections[peerUid];

	if(response.sdp && connection) {
		connection.pc.setRemoteDescription(new RTCSessionDescription(response.sdp)).then(() => {

			if(response.sdp.type === constants.OFFER.toLocaleLowerCase()) {
				connection.pc.createAnswer().then(description => {
					createDescription(description, peerUid, constants.ANSWER)
				});
			}
		}).catch(e => {
			handleErrorMessage(e, response.from);
		});
	} else {
		handleErrorMessage("Response description is not found.", response.from);
	}
}

export const sendICECandidate = (event, peerUid) => {
	if(event.candidate) {
		ws.sendToServer({
			from: store.getState().localUserName,
			type: constants.ICE_CANDIDATE,
			candidate: event.candidate,
			peerUid: peerUid
		});
		console.log('Sending ICE Candidate.');
	}
}

export const handleIceCandidate = (data, peerUid) => {
	let connection = peerConnections[peerUid];
	if(connection) {
		try{
			connection.pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(e => {
				handleErrorMessage(e, data.from);
			});
		} catch(err) {
			handleErrorMessage(err, data.from);
		};
	} else {
		console.log(`Peer connection not found for user: ${data.from}`);
	}
}

export const handleErrorMessage = (message, from) => {
    console.error(message + " From: [" + from + "]");
}

export const getSessionUid = () => {
	store.setUid(null);
	ws.sendToServer({
		from: store.getState().localUserName,
		type: constants.FETCH_SESSION_ID,
		roomId: store.getState().roomId,
		peerUid: constants.ALL
	});
}

export const joinWebRTCChannel = (sessionId) => {
	store.setUid(sessionId);
	ws.sendToServer({
		from: store.getState().localUserName,
		type: constants.JOIN,
		roomId: store.getState().roomId,
		peerUid: constants.ALL
	});
}

export const endCall = (peerUid) => {
	console.log("Ending call");
	ws.sendToServer({
		from: store.getState().localUserName,
		type: constants.LEAVE,
		roomId: store.getState().roomId,
		peerUid: peerUid
	});

	ui.leaveMeeting();
}