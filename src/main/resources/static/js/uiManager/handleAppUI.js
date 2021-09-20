import * as constants from "../appSetting/constants.js";
import * as store from "../appSetting/store.js";
import * as appevent from "../eventBinding/appEventBinding.js";
import * as peerManager from "../webSocketHandler/peerManager.js";

let mainCameraId = "";
const JoiningScreen = "local_camera";
const MainScreen = "conference_room";

export const toggleCamera = (state) => {
    const isMeetingStarted = store.getState().meetingStarted;
    let devicePreName = isMeetingStarted ? "main_" : "";
    if(state) {
        document.getElementById(devicePreName + "camera_on").classList.remove('d-none');
        document.getElementById(devicePreName + "camera_off").classList.add('d-none');
    } else {
        document.getElementById(devicePreName + "camera_on").classList.add('d-none');
        document.getElementById(devicePreName + "camera_off").classList.remove('d-none');
    }
    
    const cameraStream = store.getState().localStream;
    const cameraState = cameraStream.getVideoTracks()[0].enabled;
    cameraStream.getVideoTracks()[0].enabled = !cameraState;
}

export const toggleMic = (state) => {
    const isMeetingStarted = store.getState().meetingStarted;
    let devicePreName = isMeetingStarted ? "main_" : "";
    if(state) {
        document.getElementById(devicePreName + "mic_on").classList.remove('d-none');
        document.getElementById(devicePreName + "mic_off").classList.add('d-none');
    } else {
        document.getElementById(devicePreName + "mic_on").classList.add('d-none');
        document.getElementById(devicePreName + "mic_off").classList.remove('d-none');
    }
}

export const updateVideoStream = (stream) => {
    let screenSharingFlag = store.getState().screenSharingActive;
    const isMeetingStarted = store.getState().meetingStarted;
    mainCameraId = isMeetingStarted ? MainScreen : JoiningScreen;
    const camera = document.getElementById(mainCameraId);
    if(screenSharingFlag){
        camera.classList.add('no-flip');
    } else {
        camera.classList.remove('no-flip');
    }
    camera.srcObject = stream;

    camera.addEventListener('loadedmetadata', () => {
        camera.play()
    });
}

const stopCamera = (cameraId) => {
    const cameraStream = store.getState().localStream;
    if(cameraStream && cameraId !== null) {
        const tracks = cameraStream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });

        store.setLocalStream(null);
        const camera = document.getElementById(cameraId);
        camera.srcObject = null;
    }
}

export const startMeetingCamera = () => {
    stopCamera(JoiningScreen);
    store.setMeetingStarted(true);
    navigator.mediaDevices.getUserMedia(constants.CAMERA_CONFIG).then((stream) => {
        store.setLocalStream(stream);
        updateVideoStream(stream);		
    }).catch(e => {
        console.log("encounter local camera or audio error.", e);
    });
}

export const updateRemoteVideo = (stream) => {
    const camera = document.getElementById("remote_room");
    camera.srcObject = stream;

    camera.addEventListener('loadedmetadata', () => {
        camera.play()
    });
}

export const startMeeting = () => {
	document.getElementById("joining_screen").classList.add('d-none');
	document.getElementById("conversation").classList.remove('d-none');
    startMeetingCamera(true);
}

export const leaveMeeting = () => {
	document.getElementById("joining_screen").classList.remove('d-none');
	document.getElementById("conversation").classList.add('d-none');
    appevent.removeStartScreenEvents();
    stopCamera(MainScreen);
    store.reset();
}

export const addNewUser = (data) => {
    let remotvideo = document.getElementById(data.from);
    if(remotvideo == undefined || remotvideo == null) {
        const remoteUserSection = document.getElementById("remote_users");
        
        // -------------------- video element ------------------
        const videoElem = document.createElement("video");
        videoElem.setAttribute("id", data.from);
        videoElem.classList.add("video");
        videoElem.setAttribute("muted", "muted");
        videoElem.srcObject = data.stream;

        //-------------- video container ------------------------
        const container = document.createElement('div');
        container.classList.add("col-4");

        //-------------------  add video element inside container ------------------
        container.appendChild(videoElem);

        //------------------ add container to remote user section -------------------
        remoteUserSection.appendChild(container);
        videoElem.muted = true;

        videoElem.addEventListener('loadedmetadata', () => {
            videoElem.play();
        });
    } else {
        remotvideo.srcObject = data.stream;
    }
}


export const addNewPeerUser = (stream, userId) => {
    let newUserId = "remote_" + userId.toLocaleString();
    let remotvideo = document.getElementById(newUserId);
    if(remotvideo == undefined || remotvideo == null) {
        const remoteUserSection = document.getElementById("remote_users");
        
        // -------------------- video element ------------------
        const videoElem = document.createElement("video");
        videoElem.setAttribute("id", newUserId);
        videoElem.classList.add("remote-video");
        videoElem.setAttribute("autoplay", "");
        videoElem.setAttribute("muted", "");
        videoElem.srcObject = stream;

        //-------------- video container ------------------------
        const container = document.createElement('div');
        container.classList.add("col-12");

        //-------------------  add video element inside container ------------------
        container.appendChild(videoElem);

        //------------------ add container to remote user section -------------------
        remoteUserSection.appendChild(container);
        videoElem.muted = true;

        videoElem.addEventListener('loadedmetadata', () => {
            videoElem.play();
        });
    } else {
        remotvideo.srcObject = stream;
    }
}

export const shareMainScreen = () => {
    let flag = store.getState().screenSharingActive;
    switchCameraAndScreenShare(flag);
}

const switchCameraAndScreenShare = async (flag) => {
    try {
        let currentStream = null;
        if(flag) {
            currentStream = store.getState().localStream;
            store.getState().screenSharingStream.getTracks.forEach(track => track.stop());
        } else {
            currentStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });

            store.setScreenSharingStream(currentStream);
        }

        let peers = peerManager.getPeers();
        const keys = Object.keys(peers);
        let index = 0;
        while(index < keys.length){
            let peer = peers[keys[index]].pc;
            let senders = peer.getSenders();
            const sender = senders.find(sender => sender.track.kind === currentStream.getVideoTracks()[0].kind);

            if(sender) {
                sender.replaceTrack(currentStream.getVideoTracks()[0]);
            }
            index++;
        }

        store.setScreenSharingActive(!flag);
        updateVideoStream(currentStream);
    } catch(err) {
        console.log(`Error while sharing screen. Err: ${err}`);
    }
}

export const showFullScreen = () => {
    alert("show full screen");
}