import * as webRtcInit from "./webSocketHandler/webRTCInitializer.js";
import * as api from "./webSocketHandler/controllerApi.js"
import * as store from "./appSetting/store.js"
import * as peer from "./webSocketHandler/peerManager.js";

/*-----------------------------------OLD CODE ------------------------------------
webRtcInit.getLocalPreview();
webRtcInit.connect();
--------------------------------------------- OLD CODE END ---------------------- */

store.setRoomId(12345);
api.post("createRoom", { "roomId": "12345" });
store.setMeetingStarted(false);
peer.createUid();
webRtcInit.getLocalPreview(false).then(stream => {
    console.log("camera started");
});
setTimeout(() => {
    webRtcInit.connectToSocket();
}, 2000);
