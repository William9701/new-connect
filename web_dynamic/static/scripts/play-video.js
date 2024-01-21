function like(content_id, user_id) {
  event.preventDefault();
  var data = {
    user_id: user_id,
    content_id: content_id,
    reaction: "like",
  };
  fetch("http://127.0.0.1:5001/api/v1/reactions/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(() => {
    fetch(`http://127.0.0.1:5001/api/v1/reactions/${content_id}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(`likes-${content_id}`).textContent = data.likes;
        document.getElementById(`dislikes-${content_id}`).textContent =
          data.dislikes;
        document.getElementById("like_logo").src =
          "/static/images/blue_like.png";
        document.getElementById("dislike_logo").src =
          "/static/images/dislike.png";
      });
  });
}

function dislike(content_id, user_id) {
  event.preventDefault();
  var data = {
    user_id: user_id,
    content_id: content_id,
    reaction: "dislike",
  };
  fetch("http://127.0.0.1:5001/api/v1/reactions/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(() => {
    fetch(`http://127.0.0.1:5001/api/v1/reactions/${content_id}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(`dislikes-${content_id}`).textContent =
          data.dislikes;
        document.getElementById(`likes-${content_id}`).textContent = data.likes;
        document.getElementById("dislike_logo").src =
          "/static/images/black_dislike.png";
        document.getElementById("like_logo").src = "/static/images/like.png";
      });
  });
}

function Save(content_id) {
  event.preventDefault();
  // Fetch the video file details from the server
  fetch(`http://127.0.0.1:5001/api/v1/contents/${content_id}`)
    .then((response) => response.json())
    .then((data) => {
      var contentUrl = data.content; // Get the relative URL of the video file from the JSON data

      // Remove the '..' from the relative URL
      contentUrl = contentUrl.replace("..", "");

      // Convert the relative URL to an absolute URL
      var a = document.createElement("a");
      a.href = contentUrl;
      var absoluteUrl = a.href;

      // Fetch the video file
      fetch(absoluteUrl)
        .then((response) => response.blob()) // Get a Blob representing the video data
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = `Connect_${data.description}.mp4`; // Specify the filename
          a.click(); // Simulate the click
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var span = document.getElementById("close");

  var modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var span = document.getElementById("close");
  var copy = document.getElementById("copy");
  var copy_text = document.getElementById("copy_text");

  btn.onclick = function () {
    event.preventDefault();
    modal.style.display = "block";
    copy_text.textContent = window.location.href;
  };

  span.onclick = function () {
    event.preventDefault();
    modal.style.display = "none";
  };

  copy.onclick = function () {
    event.preventDefault();
    navigator.clipboard.writeText(copy_text.textContent);
    alert("Copied the text: " + copy_text.textContent);
  };

  window.onclick = function (event) {
    event.preventDefault();
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

function Subscription(user_id, content_user_id) {
  event.preventDefault();

  // Define the data to be sent in the body of the request
  let data = {
    subscriber_id: user_id,
    subscribed_id: content_user_id,
  };

  // Check the current subscription status
  let isSubscribed =
    document.getElementById("sub_button").textContent.trim() === "Unsubscribe";

  // Define the API endpoint based on the subscription status
  let apiEndpoint = isSubscribed
    ? `http://127.0.0.1:5001/api/v1/users/${user_id}/unsubscribe/${content_user_id}`
    : `http://127.0.0.1:5001/api/v1/users/${user_id}/subscribe/${content_user_id}`;

  fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      // Update the button text based on the new subscription status
      document.getElementById("sub_button").textContent = isSubscribed
        ? "Subscribe"
        : "Unsubscribe";
      fetch(`http://127.0.0.1:5001/api/v1/users/${content_user_id}`)
        .then((response) => response.json())
        .then((data) => {
          var len = data.subscribers.length;
          var subscriberText = len === 1 ? "Subscriber" : "Subscribers";
          document.getElementById(
            "sub_count"
          ).textContent = `${len} ${subscriberText}`;
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function handleEnter(event, user_id, content_id) {
  if (event.key === "Enter") {
    event.preventDefault();
    let comment = document.getElementById("commentInput").value;

    // Define the data to be sent in the body of the request
    let data = {
      user_id: user_id,
      content_id: content_id,
      text: comment,
    };

    fetch(
      `http://127.0.0.1:5001/api/v1/contents/${user_id}/${content_id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Clear the input field after successful submission
        document.getElementById("commentInput").value = "";
        fetch(`http://127.0.0.1:5001/api/v1/contents/${content_id}/comment`)
          .then((response) => response.json())
          .then((comments) => {
            // Update the comment count
            document.getElementById(
              "comment_count"
            ).textContent = `${comments.length} Comments`;

            fetch("http://127.0.0.1:5001/api/v1/users")
              .then((response) => response.json())
              .then((users) => {
                // Sort the comments by 'created_at' in descending order
                comments.sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                // Create the HTML for each comment
                let commentsHTML = "";
                for (let comment of comments) {
                  // Find the user who made the comment
                  let user = users.find((user) => user.id === comment.user_id);
                  if (user) {
                    commentsHTML += `
                        <div class="old-comment">
                            <img src="${remove_dot(user.image)}" />
                            <div>
                                <h3>
                                    ${user.first_name} ${user.last_name}
                                    <span>${format_time_diff(
                                      comment.created_at
                                    )}</span>
                                </h3>
                                <p>${comment.text}</p>
                                <div class="acomment-action">
                                    <img src="/static/images/like.png" />
                                    <span>244</span>
                                    <img src="/static/images/dislike.png" />
                                    <span>2</span>
                                    <span>REPLY</span>
                                    <a href="">ALL replies</a>
                                </div>
                            </div>
                        </div>`;
                  }
                }

                // Replace the existing comments section with the new HTML
                document.getElementById("commentsSection").innerHTML =
                  commentsHTML;
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
  }
}

function remove_dot(content) {
  if (content.startsWith("..")) {
    return content.slice(2);
  } else {
    return content;
  }
}
function format_time_diff(created_at) {
  let now = new Date();
  let ncreated_at = new Date(created_at);
  // Calculate the time difference in seconds
  let time_diff = Math.floor((now - ncreated_at) / 1000);

  // Subtract 1 hour from the time difference
  time_diff -= 3600;

  if (time_diff < 60) {
    return "Now";
  } else if (time_diff < 3600) {
    let minutes = Math.floor(time_diff / 60);
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  } else if (time_diff < 86400) {
    let hours = Math.floor(time_diff / 3600);
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  } else if (time_diff < 172800) {
    return "Yesterday";
  } else if (time_diff < 604800) {
    let days = Math.floor(time_diff / 86400);
    return days === 1 ? `${days} day ago` : `${days} days ago`;
  } else if (time_diff < 2419200) {
    let weeks = Math.floor(time_diff / 604800);
    return weeks === 1 ? `${weeks} week ago` : `${weeks} weeks ago`;
  } else if (time_diff < 29030400) {
    let months = Math.floor(time_diff / 2419200);
    return months === 1 ? `${months} month ago` : `${months} months ago`;
  } else {
    let years = Math.floor(time_diff / 29030400);
    return years === 1 ? `${years} year ago` : `${years} years ago`;
  }
}
function com_like(comment_id, user_id) {
  event.preventDefault();
  var data = {
    user_id: user_id,
    comment_id: comment_id,
    reaction: "like",
  };
  fetch("http://127.0.0.1:5001/api/v1/comment_reaction/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(() => {
    fetch(`http://127.0.0.1:5001/api/v1/comments_reaction/${comment_id}`)
      .then((response) => response.json())
      .then((data) => {
        // Dynamically generate the id for each comment's like count
        var likeCountId = `comment_like_${comment_id}`;
        var dislikeCountId = `comment_dislike_${comment_id}`;
        document.getElementById(likeCountId).textContent = data.likes;
        document.getElementById(dislikeCountId).textContent = data.dislikes;
      });
  });
}

function com_dislike(comment_id, user_id) {
  event.preventDefault();
  var data = {
    user_id: user_id,
    comment_id: comment_id,
    reaction: "dislike",
  };
  fetch("http://127.0.0.1:5001/api/v1/comment_reaction/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(() => {
    fetch(`http://127.0.0.1:5001/api/v1/comments_reaction/${comment_id}`)
      .then((response) => response.json())
      .then((data) => {
        // Dynamically generate the id for each comment's like count
        var dislikeCountId = `comment_dislike_${comment_id}`;
        var likeCountId = `comment_like_${comment_id}`;
        document.getElementById(dislikeCountId).textContent = data.dislikes;
        document.getElementById(likeCountId).textContent = data.likes;
      });
  });
}

function Reply(comment_id, user_id) {
  event.preventDefault();
  var element = document.getElementById(`comment-comment_${comment_id}`);

  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}
