import * as webRTCRequest from "../webSocketHandler/webRTCSocketHandler.js"; 
import * as ui from "../uiManager/handleAppUI.js";
import * as store from "../appSetting/store.js"
import * as webRTCInit from "../webSocketHandler/webRTCInitializer.js";

/**--------------------------------  old code --------------------------------------
 * 
 * 
 * 


const startOrJoinMeeting = () => {
	console.log("starting or joining meeting...");
	const urlSearchParams = new URLSearchParams(window.location.search);
	const { code } = Object.fromEntries(urlSearchParams.entries());
	console.log(code);
	if(code) {
		webRTCInit.subscribeChannel(code);
		webRTCRequest.createPeerConnection();
	} else {
		alert("incorrect meeting code supplied");
	}
}

const copySessionCode = () => {
	navigator.clipboard && navigator.clipboard.writeText(store.getState().sessionId);
}


 -------------------------------------- end ---------------------------------------------*/

const startOrJoinMeeting = () => {
	let userName = document.getElementById("username").value;
	if(userName !== null && userName !== "") {
		store.setlocalUserName(userName);
		webRTCRequest.getSessionUid();
		ui.startMeeting();	
	} else {
		console.log("Username is mandatory");
	}
}

export const removeStartScreenEvents = () => {
	micOnButton.removeEventListener('click', null, true);
	micOffButton.removeEventListener('click', null, true);
	cameraOnButton.removeEventListener('click', null, true);
	cameraOffButton.removeEventListener('click', null, true);
}

const subscriptionButton = document.getElementById("join_meeting");
subscriptionButton.addEventListener('click', startOrJoinMeeting);

const micOnButton = document.getElementById("mic_on");
micOnButton.addEventListener('click', () => ui.toggleMic(false));

const micOffButton = document.getElementById("mic_off");
micOffButton.addEventListener('click', () => ui.toggleMic(true));

const cameraOnButton = document.getElementById("camera_on");
cameraOnButton.addEventListener('click', () => ui.toggleCamera(false));

const cameraOffButton = document.getElementById("camera_off");
cameraOffButton.addEventListener('click', () => ui.toggleCamera(true));

/**---------------------  main screen camera events ------------------------------------- */

const mainmicOnButton = document.getElementById("main_mic_on");
mainmicOnButton.addEventListener('click', () => ui.toggleMic(false));

const mainmicOffButton = document.getElementById("main_mic_off");
mainmicOffButton.addEventListener('click', () => ui.toggleMic(true));

const maincameraOnButton = document.getElementById("main_camera_on");
maincameraOnButton.addEventListener('click', () => ui.toggleCamera(false));

const maincameraOffButton = document.getElementById("main_camera_off");
maincameraOffButton.addEventListener('click', () => ui.toggleCamera(true));

const endCall = document.getElementById("end_call");
endCall.addEventListener('click', () => webRTCRequest.endCall());

const shareScreen = document.getElementById('share_screen');
shareScreen.addEventListener('click', () => ui.shareMainScreen());

const mainscreenContainer = document.getElementById("mainscreen-container");
mainscreenContainer.addEventListener('click', () => ui.showActionBar());


