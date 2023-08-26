const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  window.location.replace("/api/users/logout");
});
