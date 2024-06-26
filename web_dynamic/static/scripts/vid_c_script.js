//#1
let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

//#2
//#1 - Config setup
let config = {
  appid: "acbf8699486446d187af549922bbb88c",
  token: null,
  uid: null,
  channel: null,
};

//#2 - Setting tracks for when user joins
let localTracks = {
  audioTrack: null,
  videoTrack: null,
};

//#3 - Want to hold state for users audio and video so user can mute and hide
let localTrackState = {
  audioTrackMuted: false,
  videoTrackMuted: false,
};

//#4 - Set remote tracks to store other users
let remoteTracks = {};

document
  .getElementById("join-btn")
  .addEventListener("click", async function () {
    let roomName = document.querySelector('input[name="channel"]').value;
    let username = document.getElementById("username").value;

    // Check if both inputs are filled
    if (!roomName || !username) {
      alert("Both fields must be filled to join or create a room");
      return;
    }

    config.channel = roomName;
    config.uid = username;

    await joinStreams();
    document.getElementById("join-wrapper").style.display = "none";
    document.getElementById("footer").style.display = "flex";
  });

document.getElementById("mic-btn").addEventListener("click", async () => {
  //Check if what the state of muted currently is
  //Disable button
  if (!localTrackState.audioTrackMuted) {
    //Mute your audio
    await localTracks.audioTrack.setMuted(true);
    localTrackState.audioTrackMuted = true;
    document.getElementById("mic-btn").style.backgroundColor =
      "rgb(255, 80, 80, 0.7)";
  } else {
    await localTracks.audioTrack.setMuted(false);
    localTrackState.audioTrackMuted = false;
    document.getElementById("mic-btn").style.backgroundColor = "#1f1f1f8e";
  }
});

document.getElementById("camera-btn").addEventListener("click", async () => {
  //Check if what the state of muted currently is
  //Disable button
  if (!localTrackState.videoTrackMuted) {
    //Mute your audio
    await localTracks.videoTrack.setMuted(true);
    localTrackState.videoTrackMuted = true;
    document.getElementById("camera-btn").style.backgroundColor =
      "rgb(255, 80, 80, 0.7)";
  } else {
    await localTracks.videoTrack.setMuted(false);
    localTrackState.videoTrackMuted = false;
    document.getElementById("camera-btn").style.backgroundColor = "#1f1f1f8e";
  }
});

document.getElementById("leave-btn").addEventListener("click", async () => {
  //Loop threw local tracks and stop them so unpublish event gets triggered, then set to undefined
  //Hide footer
  for (trackName in localTracks) {
    let track = localTracks[trackName];
    if (track) {
      track.stop();
      track.close();
      localTracks[trackName] = null;
    }
  }

  //Leave the channel
  await client.leave();
  document.getElementById("footer").style.display = "none";
  document.getElementById("user-streams").innerHTML = "";
  document.getElementById("join-wrapper").style.display = "block";
});

//Method will take all my info and set user stream in frame
let joinStreams = async () => {
  //Is this place hear strategicly or can I add to end of method?

  client.on("user-published", handleUserJoined);
  client.on("user-left", handleUserLeft);

  client.enableAudioVolumeIndicator(); // Triggers the "volume-indicator" callback event every two seconds.
  client.on("volume-indicator", function (evt) {
    for (let i = 0; evt.length > i; i++) {
      let speaker = evt[i].uid;
      let volume = evt[i].level;
      if (volume > 0) {
        document.getElementById(`volume-${speaker}`).src =
          "../static/images/volume-on.svg";
      } else {
        document.getElementById(`volume-${speaker}`).src =
          "../static/images/volume-off.svg";
      }
    }
  });

  //#6 - Set and get back tracks for local user
  [config.uid, localTracks.audioTrack, localTracks.videoTrack] =
    await Promise.all([
      client.join(
        config.appid,
        config.channel,
        config.token || null,
        config.uid || null
      ),
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack(),
    ]);

  // #7 - Adjust camera settings (video encoder configuration)
  const videoEncoderConfig = {
    width: 640, // Set the desired width of the video
    height: 480, // Set the desired height of the video
    frameRate: AgoraRTC.FRAME_RATE_FPS_30, // Set the desired frame rate
    bitrate: 1200, // Set the desired bitrate (in Kbps)
    orientationMode: AgoraRTC.ORIENTATION_MODE_ADAPTIVE, // Set the orientation mode
  };

  //#7 - Create player and add it to player list
  await localTracks.videoTrack.setEncoderConfiguration(videoEncoderConfig);
  let player = `<div class="video-containers" id="video-wrapper-${config.uid}">
                        <p class="user-uid"><img class="volume-icon" id="volume-${config.uid}" src="../static/images/volume-on.svg" /> ${config.uid}</p>
                        <div class="video-player player" id="stream-${config.uid}"></div>
                  </div>`;

  document
    .getElementById("user-streams")
    .insertAdjacentHTML("beforeend", player);
  //#8 - Player user stream in div
  localTracks.videoTrack.play(`stream-${config.uid}`);

  //#9 Add user to user list of names/ids

  //#10 - Publish my local video tracks to entire channel so everyone can see it
  await client.publish([localTracks.audioTrack, localTracks.videoTrack]);
};

let handleUserJoined = async (user, mediaType) => {
  console.log("Handle user joined");

  //#11 - Add user to list of remote users
  remoteTracks[user.uid] = user;

  //#12 Subscribe ro remote users
  await client.subscribe(user, mediaType);

  if (mediaType === "video") {
    let player = document.getElementById(`video-wrapper-${user.uid}`);
    console.log("player:", player);
    if (player != null) {
      player.remove();
    }

    player = `<div class="video-containers" id="video-wrapper-${user.uid}">
                        <p class="user-uid"><img class="volume-icon" id="volume-${user.uid}" src="../static/images/volume-on.svg" /> ${user.uid}</p>
                        <div  class="video-player player" id="stream-${user.uid}"></div>
                      </div>`;
    document
      .getElementById("user-streams")
      .insertAdjacentHTML("beforeend", player);
    user.videoTrack.play(`stream-${user.uid}`);
  }

  if (mediaType === "audio") {
    user.audioTrack.play();
  }
};

let handleUserLeft = (user) => {
  console.log("Handle user left!");
  //Remove from remote users and remove users video wrapper
  delete remoteTracks[user.uid];
  document.getElementById(`video-wrapper-${user.uid}`).remove();
};
