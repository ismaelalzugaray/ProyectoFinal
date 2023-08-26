

const changeButton = document.getElementById("sendPasswordButton")

changeButton.addEventListener("click", (evt) => {
    evt.preventDefault()
    const data = {
        password: document.getElementById("passwordInput").value,
        email : document.getElementById("emailInput").value
    } 

    fetch(`/api/users/restorepassword`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }}).then((result) => {
            if (result.status === 200){
                Toastify({
                    text: `Su contraseña ha sido restablecida`,
                    className: "info",
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                  }).showToast();
                  setTimeout(() => {
                    window.location.replace("/api/views/login");
                  }, 2000);
            }else {
                if (result.status===400){
                    Toastify({
                        text: `La nueva contraseña no puede ser igual a la anterior`,
                        className: "info",
                        style: {
                          background: "linear-gradient(to right, #00b09b, #96c93d)",
                        },
                      }).showToast();
                }else{
                    Toastify({
                    text: `No se pudo restablecer la contraseña`,
                    className: "info",
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                  }).showToast();}
            }

    })})