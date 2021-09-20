let state = {
    localStream: null,
    remoteStream: [],
    roomId: null,
    screenSharingActive: false,
    screenSharingStream: null,
    sessionId: null,
    socketId: null,
    localUserName: null,
    stomp: null,
    cameraRequired: true,
    audioRequired: true,
    meetingStarted: false,
    uid: null,
    connectedPeers: []
}

export const reset = () => {
    state = {
        localStream: null,
        remoteStream: [],
        roomId: null,
        screenSharingActive: false,
        screenSharingStream: null,
        sessionId: null,
        socketId: null,
        localUserName: null,
        stomp: null,
        cameraRequired: true,
        audioRequired: true,
        meetingStarted: false,
        connectedPeers: []
    }
}

export const setConnectedPeers = (peerUid) => {
    let peers = getState().connectedPeers;
    if(peers.filter(x=>x === peerUid).length === 0)
        peers.push(peerUid);
}

export const isPeerExists = (peerUid) => {
    let peers = getState().connectedPeers;
    if(peers.filter(x => x === peerUid).length > 0)
        return true;
    else
        return false;
}

export const setcameraRequired = (cameraRequired) => {
    state = {
        ...state,
        cameraRequired
    }
}

export const setUid = (uid) => {
    state = {
        ...state,
        uid
    }
}

export const setMeetingStarted = (meetingStarted) => {
    state = {
        ...state,
        meetingStarted
    }
}

export const setaudioRequired = (audioRequired) => {
    state = {
        ...state,
        audioRequired
    }
}

export const setRoomId = (roomId) => {
    state = {
        ...state,
        roomId
    }
}

export const setLocalStream = (localStream) => {
    state = {
        ...state,
        localStream
    }
}

export const setlocalUserName = (localUserName) => {
    state = {
        ...state,
        localUserName
    }
}

export const setStomp = (stomp) => {
    state = {
        ...state,
        stomp
    }
}

export const setSocketId = (socketId) => {
    state = {
        ...state,
        socketId
    }
}

export const setScreenSharingActive = (screenSharingActive) => {
    state = {
        ...state,
        screenSharingActive
    }
}

export const setScreenSharingStream = (screenSharingStream) => {
    state = {
        ...state,
        screenSharingStream
    }
}

export const setSessionId = (sessionId) => {
    state = {
        ...state,
        sessionId
    }
}

export const getState = () => {
    return state;
}