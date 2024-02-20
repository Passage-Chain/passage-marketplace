import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "app",
  initialState: {
    instanceUrl: null,
    videoDevices: [],
    audioDevices: [],
    audioOutputDevices: [],
    selectedVideoDevice: null,
    selectedAudioDevice: null,
    selectedAudioOutputDevice: null,
    isMicMuted: false,
    isAudioDisabled: false,
    isVideoDisabled: false,
    audioVolume: 50,
    isSplashed: false,
    videoStream: null,
    WASDControl: false,
    touchControl: false,
  },
  reducers: {
    setInstanceUrl: (state, action) => {
      state.instanceUrl = action.payload;
    },
    setVideoDevices: (state, action) => {
      state.videoDevices = [...action.payload];
    },
    setAudioDevices: (state, action) => {
      state.audioDevices = [...action.payload];
    },
    setAudioOutupDevices: (state, action) => {
      state.audioOutputDevices = [...action.payload];
    },
    setSelectedVideoDevice: (state, action) => {
      state.selectedVideoDevice = action.payload;
    },
    setSelectedAudioDevice: (state, action) => {
      state.selectedAudioDevice = action.payload;
    },
    setSelectedAudioOutputDevice: (state, action) => {
      state.selectedAudioOutputDevice = action.payload;
    },
    setIsMicMuted: (state, action) => {
      state.isMicMuted = action.payload;
    },
    setIsAudioDisabled: (state, action) => {
      state.isAudioDisabled = action.payload;
    },
    setIsVideoDisabled: (state, action) => {
      state.isVideoDisabled = action.payload;
    },
    setAudioVolume: (state, action) => {
      state.audioVolume = action.payload;
    },
    setVideoStream: (state, action) => {
      state.videoStream = action.payload;
    },
    setIsSplashed: (state, action) => {
      state.isSplashed = action.payload;
    },
    setWASDControl: (state, action) => {
      state.WASDControl = action.payload;
    },
    setTouchControl: (state, action) => {
      state.touchControl = action.payload;
    },
  },
});

export const {
  setInstanceUrl,
  setVideoDevices,
  setAudioDevices,
  setAudioOutupDevices,
  setSelectedVideoDevice,
  setSelectedAudioDevice,
  setSelectedAudioOutputDevice,
  setIsMicMuted,
  setIsAudioDisabled,
  setIsVideoDisabled,
  setAudioVolume,
  setVideoStream,
  setIsSplashed,
  setWASDControl,
  setTouchControl,
} = counterSlice.actions;

export default counterSlice.reducer;
