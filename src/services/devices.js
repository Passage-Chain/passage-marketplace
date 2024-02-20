function getDevicePermission(params) {
  return navigator.mediaDevices.getUserMedia(params);
}

function stopAllDevices() {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        device.getTracks().forEach((track) => {
          track.stop();
        })
      })
    })
}

function getAllDevices() {
  return new Promise((resolve, reject) => {
    let videoDevices = [];
    let audioInputDevices = [];
    let audioOutputDevices = [];

    //Get devices
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (device) {
          //fix redux serialize
          let object = {
            kind: device.kind,
            label: device.label,
            id: device.deviceId,
          };

          if (device.kind === "audioinput") {
            audioInputDevices.push(object);
          }

          if (device.kind === "videoinput") {
            videoDevices.push(object);
          }

          if (device.kind === "audiooutput") {
            audioOutputDevices.push(object);
          }
        });

        resolve({
          videoDevices,
          audioInputDevices,
          audioOutputDevices,
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);

        reject();
      });
  });
}

export default { getDevicePermission, getAllDevices, stopAllDevices };
