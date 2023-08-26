const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  window.location.replace("http://localhost:9090/api/users/logout");
});
