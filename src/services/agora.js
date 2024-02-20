import AgoraRTC from "agora-rtc-sdk-ng";
import agoraConfig from "../agora.config";
import account from "./account";
import { getToken } from "../configs";

var channelMuteState = {
    audio: false,
    video: false,
};

var localMuteState = {
    audio: false,
    video: false,
};

var client;

var localTracks = {
    videoTrack: null,
    audioTrack: null,
};

function setVideoDevice(newDevice) {
    if (localTracks.videoTrack) localTracks.videoTrack.setDevice(newDevice);
}

function setAudioDevice(newDevice) {
    if (localTracks.audioTrack) localTracks.audio.setDevice(newDevice);
}

function updateStateAudioTrack(isMute) {
    if(!client) return;
    localMuteState.audio = isMute;

    if (channelMuteState.audio || localMuteState.audio) {
        client.unpublish(localTracks.audioTrack);
    } else {
        client.publish(localTracks.audioTrack);
    }
}

function updateStateVideoTrack(isMute) {
    if(!client) return;
    localMuteState.video = isMute;

    if (channelMuteState.video || localMuteState.video) {
        client.unpublish(localTracks.videoTrack);
    } else {
        client.publish(localTracks.videoTrack);
    }
}

async function createClient(
    channelId,
    agoraToken,
    agoraUid,
    isAudioEnable,
    isVideoEnable)
{
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    //TODO: remove debugging
    window.agc = client;

    localTracks.audioTrack = null;
    localTracks.videoTrack = null;

    console.log("AgoraRTC client initialized");

    client.on("connection-state-change", (event) => {
        console.debug(event);
    });

    client.on("error", (event) => {
        console.debug(event);
    });

    client.on("exception", (event) => {
        console.debug(event);
    });

    client.on("token-privilege-will-expire", async (event) => {
        try {
            const response = await account.getAgoraToken(
                getToken(), channelId, client.uid);
            const token = response.data?.token;
            await client.renewToken(token);
        } catch (error) {
            console.log(error)
        }
    });

    // This may help with camera continuity when the user's media setup changes
    // i.e. if their webcam is unplugged or hiccoughs. Fotched from here:
    // https://github.com/AgoraIO/API-Examples-Web/blob/main/Demo/basicVideoCall/basicVideoCall.js#L85
    AgoraRTC.onCameraChanged = async changedDevice => {
        // When plugging in a device, switch to a device that is newly plugged in.
        if (changedDevice.state === "ACTIVE") {
            localTracks.videoTrack.setDevice(changedDevice.device.deviceId);
            // Switch to an existing device when the current device is unplugged.
        } else if (changedDevice.device.label === localTracks.videoTrack.getTrackLabel()) {
            const oldCameras = await AgoraRTC.getCameras();
            oldCameras[0] && localTracks.videoTrack.setDevice(oldCameras[0].deviceId);
        }
    };

    channelMuteState.audio = !Boolean(isAudioEnable);
    channelMuteState.video = !Boolean(isVideoEnable);

    if (isAudioEnable) {
        console.log('services/agora.js createClient calling AgoraRTC.createMicrophoneAudioTrack()');
        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    }

    if (isVideoEnable) {
        console.log('services/agora.js createClient calling AgoraRTC.createCameraVideoTrack()');
        localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
    }

    await client.join(
        agoraConfig.AGORA_APP_ID,
        channelId,
        agoraToken,
        parseInt(agoraUid));

    await client.publish([localTracks.audioTrack, localTracks.videoTrack]);

    // both should start out false, meaning *not* muted
    updateStateAudioTrack(localMuteState.audio);
    updateStateVideoTrack(localMuteState.video);
}

async function deleteClient() {
    if (!client) {
        return;
    }
    client.localTracks.forEach((track) => {
        track.close();
    });

    await client.leave();
}

const getChannelName = () => client.channelName;

export default {
    createClient,
    getChannelName,
    deleteClient,
    localTracks,
    updateStateAudioTrack,
    updateStateVideoTrack,
    setVideoDevice,
    setAudioDevice
};
