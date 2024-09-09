document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".search-bar")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting normally
      var query = document.querySelector('input[name="q"]').value; // Get the search query

      // Send a GET request to your API
      fetch("http://127.0.0.1:5001/api/v1/locations/" + query)
        .then((response) => response.json()) // Parse the response as JSON
        .then((locations) => {
          // Check if the locations array is empty
          if (!Array.isArray(locations) || locations.length === 0) {
            var list_container = document.querySelector(".list-container");
            list_container.innerHTML = ""; // Clear the list-container

            // Display a message or take other appropriate action
            var noResults = document.createElement("div");
            var imgElement = document.createElement("img");
            imgElement.id = "opps-logo";
            imgElement.src = "../static/images/opps.png";
            imgElement.alt = "";
            noResults.appendChild(imgElement);
            var SorryNote = document.createElement("div");
            SorryNote.className = "sorry";

            var message = document.createElement("p");
            message.textContent =
              "Sorry No live content for " + query + " now.";
            SorryNote.appendChild(message);
            noResults.appendChild(SorryNote);
            list_container.appendChild(noResults);
          } else {
            // Send a GET request to get the users
            fetch("http://127.0.0.1:5001/api/v1/users")
              .then((response) => response.json()) // Parse the response as JSON
              .then((users) => {
                var list_container = document.querySelector(".list-container"); // Get the list-container element
                list_container.innerHTML = ""; // Clear the list-container

                locations.forEach((location) => {
                  var vid_list = document.createElement("div");
                  vid_list.className = "vid-list";

                  var a = document.createElement("a");
                  a.href = "play/" + location.content_id;

                  var video = document.createElement("video");
                  video.autoplay = true;

                  // Send a GET request to the content API using location.content_id
                  fetch(
                    "http://127.0.0.1:5001/api/v1/contents/" +
                      location.content_id
                  )
                    .then((response) => response.json())
                    .then((content) => {
                      // Set the video source once you have the content data
                      video.src = content.content;
                      video.className = "thumbnail";

                      var flex_div = document.createElement("div");
                      flex_div.className = "flex-div";

                      var img = document.createElement("img");
                      img.src = "../static/images/Jack.png";
                      flex_div.appendChild(img);

                      var vid_info = document.createElement("div");
                      vid_info.className = "vid-info";

                      var info_text = document.createElement("div");
                      info_text.className = "info_text";

                      users.forEach((user) => {
                        if (user.id == location.user_id) {
                          var user_link = document.createElement("a");
                          user_link.href = "play-video.html";
                          user_link.textContent =
                            user.first_name + " " + user.last_name;

                          info_text.appendChild(user_link);
                        }
                      });

                      var p_desc = document.createElement("p");
                      p_desc.textContent = content.description;

                      var p_views = document.createElement("p");
                      p_views.textContent = content.number_of_views + " views";

                      info_text.appendChild(p_desc);
                      info_text.appendChild(p_views);
                      vid_info.appendChild(info_text);

                      flex_div.appendChild(vid_info);

                      a.appendChild(video);
                      vid_list.appendChild(a);
                      vid_list.appendChild(flex_div);
                      list_container.appendChild(vid_list);
                    })
                    .catch((error) =>
                      console.error("Error fetching content:", error)
                    );
                });
              })
              .catch((error) => console.error("Error fetching users:", error));
          }
        })
        .catch((error) => console.error("Error fetching locations:", error));
    });

  var menuicon = document.querySelector(".menu-icon");
  var sidebar = document.querySelector(".sidebar");
  var container = document.querySelector(".container");

  menuicon.onclick = function () {
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle("large-container");
  };
});

/* --------this part is for the location icon querry side ----*/
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".location-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the link from navigating
      var name = this.getAttribute("data-name"); // Get the location name

      // Send a GET request to your API
      fetch("http://127.0.0.1:5001/api/v1/locations/" + name)
        .then((response) => response.json()) // Parse the response as JSON
        .then((locations) => {
          // Check if the locations array is empty
          if (!Array.isArray(locations) || locations.length === 0) {
            var list_container = document.querySelector(".list-container");
            list_container.innerHTML = ""; // Clear the list-container

            // Display a message or take other appropriate action
            var noResults = document.createElement("div");
            var imgElement = document.createElement("img");
            imgElement.id = "opps-logo";
            imgElement.src = "../static/images/opps.png";
            imgElement.alt = "";
            noResults.appendChild(imgElement);
            var SorryNote = document.createElement("div");
            SorryNote.className = "sorry";

            var message = document.createElement("p");
            message.textContent =
              "Sorry No live content for " + query + " now.";
            SorryNote.appendChild(message);
            noResults.appendChild(SorryNote);
            list_container.appendChild(noResults);
          } else {
            // Send a GET request to get the users
            fetch("http://127.0.0.1:5001/api/v1/users")
              .then((response) => response.json()) // Parse the response as JSON
              .then((users) => {
                var list_container = document.querySelector(".list-container"); // Get the list-container element
                list_container.innerHTML = ""; // Clear the list-container

                locations.forEach((location) => {
                  var vid_list = document.createElement("div");
                  vid_list.className = "vid-list";

                  var a = document.createElement("a");
                  a.href = "play/" + location.content_id;

                  var video = document.createElement("video");
                  video.autoplay = true;

                  // Send a GET request to the content API using location.content_id
                  fetch(
                    "http://127.0.0.1:5001/api/v1/contents/" +
                      location.content_id
                  )
                    .then((response) => response.json())
                    .then((content) => {
                      // Set the video source once you have the content data
                      video.src = content.content;
                      video.className = "thumbnail";

                      var flex_div = document.createElement("div");
                      flex_div.className = "flex-div";

                      var img = document.createElement("img");
                      img.src = "../static/images/Jack.png";
                      flex_div.appendChild(img);

                      var vid_info = document.createElement("div");
                      vid_info.className = "vid-info";

                      users.forEach((user) => {
                        if (user.id == location.user_id) {
                          var user_link = document.createElement("a");
                          user_link.href = "play-video.html";
                          user_link.textContent =
                            user.first_name + " " + user.last_name;

                          vid_info.appendChild(user_link);
                        }
                      });

                      var p_desc = document.createElement("p");
                      p_desc.textContent = content.description;

                      var p_views = document.createElement("p");
                      p_views.textContent = content.number_of_views + " views";

                      vid_info.appendChild(p_desc);
                      vid_info.appendChild(p_views);

                      flex_div.appendChild(vid_info);

                      a.appendChild(video);
                      vid_list.appendChild(a);
                      vid_list.appendChild(flex_div);
                      list_container.appendChild(vid_list);
                    })
                    .catch((error) =>
                      console.error("Error fetching content:", error)
                    );
                });
              })
              .catch((error) => console.error("Error fetching users:", error));
          }
        })
        .catch((error) => console.error("Error fetching locations:", error));
    });
  });
});

async function updateContent() {
  console.log("Interval function called");

  // Fetch contents
  fetch("http://127.0.0.1:5001/api/v1/contents")
    .then((response) => response.json())
    .then((contents) => {
      // Fetch users
      fetch("http://127.0.0.1:5001/api/v1/users")
        .then((response) => response.json())
        .then((users) => {
          // Fetch views
          fetch("http://127.0.0.1:5001/api/v1/views")
            .then((response) => response.json())
            .then((views) => {
              // Clear the existing content in the container
              var container = document.querySelector(".list-container");
              container.innerHTML = "";

              // Iterate over contents and update the container
              contents.forEach((content) => {
                var vidList = document.createElement("div");
                vidList.className = "vid-list";

                var link = document.createElement("a");
                link.href = "/play/" + content.id;
                link.setAttribute(
                  "onclick",
                  `views('${content.id}', '${content.user_id}')`
                );

                var video = document.createElement("video");
                video.muted = true;
                video.src = content.content;
                video.className = "thumbnail";

                link.appendChild(video);
                vidList.appendChild(link);

                var flexDiv = document.createElement("div");
                flexDiv.className = "flex-div";

                var img = document.createElement("img");

                var vidInfo = document.createElement("div");
                vidInfo.className = "vid-info";

                var info_text = document.createElement("div");
                info_text.className = "info-text";

                users.forEach(async (user) => {
                  if (user.id == content.user_id) {
                    img.src = user.image; // Set the user's image
                    var userLink = document.createElement("a");
                    userLink.href = "#";
                    userLink.className = "openModal";
                    userLink.setAttribute(
                      "data-modal-id",
                      "modal-" + content.id
                    );
                    userLink.textContent =
                      user.first_name + " " + user.last_name;
                    info_text.appendChild(userLink);

                    var modal = document.createElement("div");
                    modal.id = "modal-" + content.id;
                    modal.className = "modal";

                    var modalContent = document.createElement("div");
                    modalContent.className = "modal-content";

                    var closeButton = document.createElement("span");
                    closeButton.className = "close";
                    closeButton.setAttribute(
                      "data-modal-id",
                      "modal-" + content.id
                    );
                    closeButton.innerHTML = "×";

                    closeButton.addEventListener("click", function () {
                      const modalId = this.getAttribute("data-modal-id");
                      document.getElementById(modalId).style.display = "none";
                    });

                    var userInfo = document.createElement("div");
                    userInfo.className = "user-info";

                    var userForm = document.createElement("form");
                    userForm.action = "/user-profile";
                    userForm.method = "POST";

                    var userLink = document.createElement("a");
                    userLink.href = "#";
                    userLink.onclick = function () {
                      userForm.submit();
                    };

                    var userImage = document.createElement("img");
                    userImage.src = user.image;
                    userImage.alt = "User Image";
                    userImage.className = "user-image";

                    var userIdInput = document.createElement("input");
                    userIdInput.type = "hidden";
                    userIdInput.name = "user_id";
                    userIdInput.value = content.user_id;

                    userLink.appendChild(userImage);
                    userForm.appendChild(userLink);
                    userForm.appendChild(userIdInput);

                    var userDetails = document.createElement("div");
                    userDetails.className = "user-details";

                    var userName = document.createElement("p");
                    userName.textContent =
                      user.first_name + " " + user.last_name;

                    var subscribersCount = document.createElement("p");
                    var subscribers = await Subscribers_count(content.user_id);
                    subscribersCount.innerHTML = `Subscribers: <span id="subscribers">${subscribers} ${
                      subscribers === 1 ? "Subscriber" : "Subscribers"
                    }</span>`;

                    var videosPostedCount = document.createElement("p");
                    var videosPosted = await video_count(content.user_id);
                    videosPostedCount.innerHTML = `Videos Posted: <span id="videosPosted">${videosPosted} ${
                      videosPosted === 1 ? "Video" : "Videos"
                    }</span>`;

                    userDetails.appendChild(userName);
                    userDetails.appendChild(subscribersCount);
                    userDetails.appendChild(videosPostedCount);

                    userInfo.appendChild(userForm);
                    userInfo.appendChild(userDetails);

                    var videoGrid = document.createElement("div");
                    videoGrid.className = "video-grid";

                    var userVideos = await User_video(content.user_id);
                    if (userVideos) {
                      userVideos.forEach((video) => {
                        var videoThumbnail = document.createElement("div");
                        videoThumbnail.className = "video-thumbnail";

                        var videoElement = document.createElement("video");
                        videoElement.src = video.content;
                        videoElement.controls = true;

                        videoThumbnail.appendChild(videoElement);
                        videoGrid.appendChild(videoThumbnail);
                      });
                    }

                    modalContent.appendChild(closeButton);
                    modalContent.appendChild(userInfo);
                    modalContent.appendChild(videoGrid);
                    modal.appendChild(modalContent);
                    info_text.appendChild(modal);
                  }
                });

                var descriptionParagraph = document.createElement("p");
                descriptionParagraph.textContent = content.description;

                // Calculate view count
                var viewCount = 0;
                views.forEach((view) => {
                  if (content.id == view.content_id) {
                    viewCount++;
                  }
                });

                var viewsParagraph = document.createElement("p");
                viewsParagraph.id = "content_view";
                viewsParagraph.textContent =
                  viewCount + " " + (viewCount === 1 ? "view" : "views");

                info_text.appendChild(descriptionParagraph);
                info_text.appendChild(viewsParagraph);

                vidInfo.appendChild(info_text);

                flexDiv.appendChild(img);
                flexDiv.appendChild(vidInfo);
                vidList.appendChild(flexDiv);

                container.appendChild(vidList);
              });

              // Add event listeners for video playback on hover
              document
                .querySelectorAll(".vid-list .thumbnail")
                .forEach(function (video) {
                  video.addEventListener("mouseover", function () {
                    video.play();
                  });

                  video.addEventListener("mouseout", function () {
                    video.pause();
                  });
                });

              // Add event listeners for modals
              document
                .querySelectorAll(".openModal")
                .forEach(function (modalLink) {
                  modalLink.addEventListener("click", function (event) {
                    event.preventDefault();
                    const modalId = this.getAttribute("data-modal-id");
                    document.getElementById(modalId).style.display = "block";
                  });
                });

              window.addEventListener("click", function (event) {
                if (event.target.classList.contains("modal")) {
                  event.target.style.display = "none";
                }
              });
            })
            .catch((error) => console.error("Error fetching views:", error));
        })
        .catch((error) => console.error("Error fetching users:", error));
    })
    .catch((error) => console.error("Error fetching contents:", error));
}

function views(content_id, user_id) {
  event.preventDefault();
  console.log(user_id);
  var data = {
    user_id: user_id,
    content_id: content_id,
  };
  fetch("http://127.0.0.1:5001/api/v1/views/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(() => {
    fetch(`http://127.0.0.1:5001/api/v1/views/${content_id}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(
          "content_view"
        ).textContent = `${data.views} views`;
        window.location.href = `/play/${content_id}`;
      });
  });
}

async function Subscribers_count(user_id) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5001/api/v1/users/${user_id}`
    );
    const user = await response.json();
    // Create a list of subscriber IDs
    const subscriber_ids = user.subscribers.map((subscriber) => subscriber.id);
    // Return the count of subscribers
    return subscriber_ids.length;
  } catch (error) {
    console.error("Error:", error);
    return 0; // Return 0 in case of an error
  }
}

async function video_count(user_id) {
  try {
    const response = await fetch(`http://127.0.0.1:5001/api/v1/contents`);
    const contents = await response.json();
    // Create a list of videos for the given user_id
    const bag = contents.filter((video) => video.user_id === user_id);
    // Return the count of videos or '0' if no videos found
    return bag.length ? bag.length : "0";
  } catch (error) {
    console.error("Error:", error);
    return "0"; // Return '0' in case of an error
  }
}

async function User_video(user_id) {
  try {
    const response = await fetch(`http://127.0.0.1:5001/api/v1/contents`);
    const contents = await response.json();
    const bag = contents.filter((video) => video.user_id === user_id);
    return bag;
  } catch (error) {
    console.error("Error:", error);
    return []; // Return an empty array in case of an error
  }
}

let previousContentCount = 0;

async function checkForNewContent() {
  try {
    const response = await fetch("http://127.0.0.1:5001/api/v1/contents");
    const contents = await response.json();
    const currentContentCount = contents.length;

    if (currentContentCount !== previousContentCount) {
      previousContentCount = currentContentCount;
      updateContent();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Initial content check
checkForNewContent();

// Set interval to check for new content every 5 seconds
setInterval(checkForNewContent, 5000);
