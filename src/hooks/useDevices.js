import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAudioDevices,
  setVideoDevices,
  setAudioOutupDevices,
  setSelectedVideoDevice,
  setSelectedAudioDevice,
  setSelectedAudioOutputDevice
} from "../redux/appSlice";

import devices from "../services/devices";

export default function useDevices(props) {
  const app = useSelector((state) => state.app);

  const dispatch = useDispatch();

  // Add device change listener
  useEffect(() => {
    navigator.mediaDevices.ondevicechange = (event) => {
      console.log("Device changed: ", event);
    }
  }, []);

  useEffect(() => {
    var params = {};

    if (app.selectedVideoDevice) {
      params["video"] = {};
      params.video["deviceId"] = app.selectedVideoDevice;
    } else {
      params["video"] = true;
    }

    if (app.selectedAudioDevice) {
      params["audio"] = {};
      params.audio["deviceId"] = app.selectedAudioDevice;
    } else {
      params["audio"] = true;
    }

    if (app.selectedAudioOutputDevice) {
      params["audioOutput"] = {};
      params.audioOutput["deviceId"] = app.selectedAudioOutputDevice;
    } else {
      params["audio"] = true;
    }

    devices
      .getDevicePermission(params)
      .then((value) => {
        const selectedVideoSetting = value
          .getTracks()
          .find((item) => item.kind === "video")
          .getSettings();

        const selectedAudioSetting = value
          .getTracks()
          .find((item) => item.kind === "audio")
          .getSettings();

          if (!app.selectedVideoDevice) {
            dispatch(setSelectedVideoDevice(selectedVideoSetting.deviceId));
          }
      
          if (!app.selectedAudioDevice) {
            dispatch(setSelectedAudioDevice(selectedAudioSetting.deviceId));
          }

        devices
          .getAllDevices()
          .then((devices) => {
            dispatch(setVideoDevices(devices.videoDevices));
            dispatch(setAudioDevices(devices.audioInputDevices));
            dispatch(setAudioOutupDevices(devices.audioOutputDevices));

            const selectAudioOutputSetting = devices?.audioOutputDevices[0]
            dispatch(setSelectedAudioOutputDevice(selectAudioOutputSetting?.id))
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));

    return(() => {
      devices.stopAllDevices();
    })
  }, []);

  return true;
}
