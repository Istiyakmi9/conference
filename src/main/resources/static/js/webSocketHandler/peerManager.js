import * as store from "../appSetting/store.js";


export const peerConnections = {};

export const resetPeerConnections = () => {
    peerConnections = {};
}

export const setPeerConnection = (connectionId, peerConnection) => {
    if(pc) {
        peerConnections[connectionId] = peerConnection;
    }
}

export const getPeers = () => {
    return peerConnections;
}

export const createUid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}