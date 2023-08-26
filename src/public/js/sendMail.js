const sendButton = document.getElementById("sendMailButton")

function getEmail() {
  const emailInput = document.getElementById("mailInput").value
  return emailInput
}

// sendButton.addEventListener("click", (evt) =>{
//   console.log(typeof getEmail());
// })

sendButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    let email = getEmail()
    fetch(`/api/users/sendrestoremail`, {
      method: "POST",
      body: email,
      headers: {
        "Content-Type": "application",
      },
    }).then((result) => {
      if (result.status === 200) {
        Toastify({
          text: `Su correo fue enviado`,
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
        setTimeout(() => {
          window.location.replace("/api/views/login");
        }, 1000);
      
    }else{
      Toastify({
        text: `No se pudo enviar el email`,
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
    }})
})