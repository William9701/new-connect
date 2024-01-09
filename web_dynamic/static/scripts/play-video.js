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
