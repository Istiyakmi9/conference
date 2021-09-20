import * as constants from "../appSetting/constants.js";
import * as webRTCResponseHandler from "../webSocketHandler/webRTCSocketHandler.js";
import * as store from "../appSetting/store.js"
import * as ui from "../uiManager/handleAppUI.js"

var _stomp = null;
var sessionId = '';

/*------------------------  Create socket js connection using SockJS api   ----------------------------------

	This SockJS not in use.
	Current using WebSocket api from client side also using pure javascript technology
/--------------------------------------------------------------------------------------------------------------*/

/*
const findSessidId = () => {    
    var url = _stomp.ws._transport.url;
    url = url.replace(
    "ws://localhost:8080/server/",  "");
    url = url.replace("/websocket", "");
    sessionId = url.replace(/^[0-9]+\//, "");
    store.setSocketId(sessionId);
    console.log("Your current session is: " + sessionId);
}

export const connect = () => {
	let socket = new SockJS(constants.WebSocketServerUrl);
	
	_stomp = Stomp.over(socket);
	store.setStomp(_stomp);
	_stomp.connect({}, function(frame) {
		//enableDisconnect();
        if(frame) {
            console.log("websocket connection stabilized successfully");
            findSessidId();	

		    subscribeChannel(sessionId);
        } else {
            // websocket connection fail handler
            console.log("fail to stabilized the websocket connection");
        }        
	});
}

export const subscribeChannel = (subscriptionCode) => {
	if(_stomp) {
		store.setSessionId(subscriptionCode);
		
		for (const sub in _stomp.subscriptions) {
		  if (_stomp.subscriptions.hasOwnProperty(sub)) {
		    _stomp.unsubscribe(sub);
		  }
		}

		_stomp.subscribe(`/user/${subscriptionCode}/queue/room`, (message) => {
            webRTCResponseHandler.webRTCResposneMessage(JSON.parse(message.body));
		});
			
		_stomp.subscribe(`/user/${subscriptionCode}/queue/prerequestoffer`, (data) => {
			webRTCResponseHandler.handlerPreRequestOffer(data);
		});
			
		_stomp.subscribe(`/user/${subscriptionCode}/queue/prerequestoffer-answer`, (data) => {
			webRTCResponseHandler.preRequestOfferResponse(data);
		});
			
		_stomp.subscribe(`/user/${subscriptionCode}/queue/webrtcsignaling`, (data) => {
			webRTCResponseHandler.webRTCSignalingChannel(data);
		});
			
		console.log('channel subscribed successfully');
	}	
} -------------------------------- previouly used code -----------------------------*/

/*----------------------------------------- NEW CODE ------------------------------------*/

let socket;

export const connectToSocket = () => {
    // add an event listener for a message being received

	socket = new WebSocket(constants.WebSocketServerUrl);
	socket.onmessage = function(msg) {
		let message = JSON.parse(msg.data);
		let localUid = store.getState().uid;
		let peerUid = message.srcUid;
		if(message.peerUid === localUid || message.peerUid === constants.ALL) {
			switch (message.type) {
				case constants.CHAT:
					console.log('Text message from ' + message.from + ' received: ' + message.data);
					break;

				case constants.OFFER:				
				case constants.ANSWER:
					console.log(`Signal [${message.type}] received by: ${message.from}`);
					webRTCResponseHandler.handleWebRTCOfferAndAnswer(message, peerUid);
					break;

				case constants.FETCH_SESSION_ID:
					console.log(`Signal [FETCH_SESSION_ID] received by: ${message.srcUid}`);
					webRTCResponseHandler.joinWebRTCChannel(message.srcUid);
					break;

				case constants.ICE_CANDIDATE:
					console.log(`Signal [ICE CANDIDATE] received by: ${message.from}`);
					webRTCResponseHandler.handleIceCandidate(message, peerUid);
					break;

				case constants.REQUEST_FOR_OFFER:
					console.log(`Signal [REQUEST_FOR_OFFER] requested by: ${message.from}`);
					webRTCResponseHandler.handleRequestForOfferByPeer(message, peerUid);
					break;

				case constants.JOIN:
					console.log(`Client with response [Uid]: ${message.uid} and [Name]: ${message.from}`);
					webRTCResponseHandler.handleJoinEvent(message, peerUid);
					break;

				default:
					webRTCResponseHandler.handleErrorMessage('Wrong type message received from server');
			}
		} else {
			console.log(`Client is [${store.getState().localUserName}] and Request is for [${message.from}]`);
		}
	};

	// add an event listener to get to know when a connection is open
	socket.onopen = function() {
		console.log('WebSocket connection opened to join.');
		//webRTCResponseHandler.createPeerConnection();
	};

	// a listener for the socket being closed event
	socket.onclose = function(message) {
		console.log('Socket has been closed');
	};

	// an event listener to handle socket errors
	socket.onerror = function(message) {
		webRTCResponseHandler.handleErrorMessage("Error: " + message);
	};
}

export const getLocalPreview = () => {
	return new Promise((resolve, reject) => {
		navigator.mediaDevices.getUserMedia(constants.CAMERA_CONFIG).then((stream) => {
			store.setLocalStream(stream);
			ui.updateVideoStream(stream);
			resolve(stream);		
		}).catch(e => {
			console.log("encounter local camera or audio error.", e);
			reject(null);
		});
	});
	
}

export const sendToServer = (msg) => {
    let msgJSON = JSON.stringify(msg);
    socket.send(msgJSON);
}