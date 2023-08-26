const form = document.getElementById("registerForm");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 201) {
      window.location.replace("/api/views/login");
    } else {
      Toastify({
        text: `No se pudo crear el usuario`,
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
    }
  });
});
