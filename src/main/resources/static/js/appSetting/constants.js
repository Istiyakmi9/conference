//export const WebSocketServerUrl = "http://localhost:8080/server";
export const WebSocketServerUrl = "ws://localhost:8080/conference";
export const WebSocketServerSecureUrl = "wss://192.168.0.101:8443/conference";

export const CHAT = "CHAT";
export const CHAT_STRANGER = "CHAT_STRANGER";
export const VIDEO_CHAT = "VIDEO_CHAT";
export const VIDEO_STRANGER = "VIDEO_STRANGER";

export const CALLEE_NOT_FOUND = "CALLEE_NOT_FOUND";
export const CALL_ACCEPTED = "CALL_ACCEPTED";
export const CALL_REJECTED = "CALL_REJECTED";
export const CALL_UNAVAILABLE = "CALL_UNAVAILABLE";

export const OFFER = "OFFER";
export const ANSWER = "ANSWER";
export const ALL = "ALL";
export const ICE_CANDIDATE = "ICE_CANDIDATE";
export const REQUEST_FOR_OFFER = "REQUEST_FOR_OFFER";
export const REGISTER_CONNECTED = "REGISTER_CONNECTED";
export const JOIN = "JOIN";
export const FETCH_SESSION_ID = "FETCH_SESSION_ID";
export const JOIN_RESPONSE = "JOIN_RESPONSE";
export const LEAVE = "LEAVE";

export const CAMERA_CONFIG = { audio: true, video: true }
export const Ice_configuration = {
    iceServers: [
        { 'urls': 'stun:stun.stunprotocol.org:3478' },
        { 'urls': 'stun:stun.l.google.com:19302' },
    ]
}