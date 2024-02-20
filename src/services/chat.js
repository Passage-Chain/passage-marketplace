import AgoraRTM from "agora-rtm-sdk";
import { message } from "antd";
import { ConsoleView } from "react-device-detect";
import agoraConfig from "../agora.config";

var rtmClient;
var channels = {};

async function create(uid, token) {
  rtmClient = AgoraRTM.createInstance(agoraConfig.AGORA_APP_ID, {
    enableCloudProxy: false,
  });

  await rtmClient.login({
    uid: uid,
    token: "",
  });

  subcribeEvents();
}

function joinChannel(channelId, onMessage) {
  console.debug("join/create rtm channel ", channelId)
  var channel = rtmClient.createChannel(channelId);
  

  channel.on("ChannelMessage", (message, memberId, messageProp) => {
    onMessage(message, memberId, messageProp);
    console.debug("ChannelMessage: ", message, " ", memberId);
  });

  channels[channelId] = channel;
}

function leaveChannel(channelId) {
  channels[channelId].leave();
}

function sendMessage(channelId, text) {
  return channels[channelId].sendMessage({
    text,
  });
}

function subcribeEvents() {
  rtmClient.on("ConnectionStateChanged", (newState, reason) => {
    console.debug("ConnectionStateChanged: ", newState);
  });
  rtmClient.on("MessageFromPeer", (message, peerId, props) => {
    console.debug("MessageFromPeer: ", message, " ", peerId);
  });
}

function leave() {
  rtmClient.logout();
}

export default {
  rtmClient,
  create,
  joinChannel,
  leaveChannel,
  sendMessage,
  channels,
};
