import * as store from "../appSetting/store.js";

let mediaRecorder;

const vp9Codec = 'video/webm; codecs=vp=9';
const vp9Options = { mimeType: vp9Codec };
const recordedChunks = [];

export const startRecording = () => {
    const stream = store.getState().localStream;
    if(MediaRecorder.isTypeSupported(vp9Codec)) {
        mediaRecorder = new MediaRecorder(stream, vp9Options);
    } else {
        mediaRecorder = new MediaRecorder(stream);
    }

    mediaRecorder.ondataavailable = handleAvailableData;
    mediaRecorder.start();
}

export const pauseRecording = () => {
    mediaRecorder.pause();
}

export const recordingRecording = () => {
    mediaRecorder.resume();
}

export const stopRecording = () => {
    mediaRecorder.stop();
}

const downloadRecordedVideo = () => {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });

    const url = URL.createObjectURL(blob);
}

const handleAvailableData = (event) => {
    if(event.data.size > 0) {
        recordedChunks.push(event.data);
        downloadRecordedVideo();
    }
}
