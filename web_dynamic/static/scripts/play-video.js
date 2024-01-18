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

  fetch(
    `http://127.0.0.1:5001/api/v1/users/${user_id}/subscribe/${content_user_id}`,
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
      document.getElementById("sub_button").textContent = "Unsubscribe";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
