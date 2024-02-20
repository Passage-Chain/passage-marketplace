import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import agoraConfig from "../agora.config";
import account from "./account";
import { getToken } from "../configs";
import agora from './agora';
import pdev from '../utils/passageDevTools'

export const createClient = async (channelId: string) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8"});

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

    const response =
        await account.getAgoraToken(getToken(), channelId, 42);
    const agoraToken = response.data?.token;

    await client.join(
        agoraConfig.AGORA_APP_ID,
        channelId,
        agoraToken,
        agoraConfig.SCREENSHARE_UID);

    return client;
}

let client: IAgoraRTCClient | undefined;
let videoTrack: ILocalVideoTrack | undefined;
let audioTrack: ILocalAudioTrack | undefined;

export const start = async () => {
    if(!client) {
        client = await createClient(agora.getChannelName());
    }
    if(!videoTrack) {
        const result = await AgoraRTC.createScreenVideoTrack({
            encoderConfig: "1080p_1",
            optimizationMode: "detail",
        }, "auto");

        if(Array.isArray(result)) {
            [videoTrack, audioTrack] = result;
        } else {
            videoTrack = result;
        }

        videoTrack.on('track-ended', stop);
    }
    if(audioTrack) {
        client.publish([videoTrack, audioTrack]);
    } else {
        client.publish(videoTrack);
    }
}

export const pause = () => {
    if(audioTrack) {
        client.unpublish([videoTrack, audioTrack]);
    } else {
        client.unpublish(videoTrack);
    }
}

export const stop = () => {
    if(client && videoTrack) {
        if(audioTrack) {
            client.unpublish([videoTrack, audioTrack]);
        } else {
            client.unpublish(videoTrack);
        }

        client.leave();
        videoTrack.close();
        audioTrack?.close();
    }
    client = undefined;
    videoTrack = undefined;
    audioTrack = undefined;
}

export const isSharing = () => {
    return !!videoTrack;
}

// TODO: remove this, it's purpose is exposure for debugging
(window as any).screenTest = { start, stop, pause };
pdev.screenShare = { start, stop, pause };