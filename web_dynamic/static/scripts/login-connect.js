function validateForm() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (username == "" || password == "") {
    showToast("Username and password must be filled out");
    return false;
  }
}

function showToast(message) {
  var toast = document.querySelector(".toast");
  toast.querySelector(".toast-body").textContent = message;
  $(toast).toast("show");
}

function signin() {
  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  let form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);
  let params = {
    client_id:
      "265988099697-sn5uq926872kqb0t0nlelaks7kpootv9.apps.googleusercontent.com",
    redirect_uri: "http://127.0.0.1:5000/user_index",
    response_type: "code",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    include_granted_scopes: "true",
    state: "pass-through-value",
  };

  for (var p in params) {
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
