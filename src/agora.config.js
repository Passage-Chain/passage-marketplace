import AgoraRTC from "agora-rtc-sdk-ng";

// From the Agora documenation:
// The output log level.
// 0: DEBUG. Output all API logs.
// 1: INFO. Output logs of the INFO, WARNING and ERROR level.
// 2: WARNING. Output logs of the WARNING and ERROR level.
// 3: ERROR. Output logs of the ERROR level.
// 4: NONE. Do not output any log.
AgoraRTC.setLogLevel(3);

// set your app id here
export const AGORA_APP_ID = "9cdaa7253de94c8c8160efda06015740"; 
export const SCREENSHARE_UID = 42;

export default {
    AGORA_APP_ID,
    SCREENSHARE_UID,
};