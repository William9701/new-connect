document.addEventListener("DOMContentLoaded", function () {
  var userId = document.body.getAttribute("data-user-id");
  document.getElementById("fileinput").addEventListener("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      // Display the selected image
      document.getElementById("avatar").src = reader.result;

      // Create a FormData object
      var formData = new FormData();
      formData.append("file", file);

      // Send a POST request to the server with the image file
      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          // The server responds with the URL of the uploaded image
          // Extract the file path from the message
          var filePath = data.split(" ").pop();

          // Set the src of the img element to the file path
          document.getElementById("avatar").src = filePath;

          // Prepare the data for the PUT request
          var userData = {
            image: filePath, 
          };

          // Send a PUT request to the users API
          fetch("http://127.0.0.1:5001/api/v1/users/" + userId, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
        });
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      document.getElementById("avatar").src = "";
    }
  });
});

var userId = document.body.getAttribute("data-user-id");
function saveChanges() {
  // Get form data
  var formData = {
    username: document.getElementById("username").value,
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    email: document.getElementById("email").value,
    // Add other form fields as needed
  };

  // Send PUT request to the server
  fetch("http://127.0.0.1:5001/api/v1/users/" + userId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle response from the server, e.g., show success message
      console.log(data);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
    });
}
