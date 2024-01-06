const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const sendInput = document.getElementById("send-input");
const errorDial = document.getElementById("error-message");
const loginUrl = "http://localhost:5678/api/users/login"; // URL pour l'authentification

async function logIn(data) {
  const loginOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: data,
  };
  return await (await fetch(loginUrl, loginOptions)).json();
}

sendInput.addEventListener("click", async (event) => {
  try {
    event.preventDefault();

    // Vérifiez la validité de l'e-mail et du mot de passe
    const isValidEmail = emailInput.checkValidity();
    const isValidPassword = passwordInput.checkValidity();

    if (!isValidEmail) {
      emailInput.classList.add("invalid");
    } else {
      emailInput.classList.remove("invalid");
    }

    if (!isValidPassword) {
      passwordInput.classList.add("invalid");
    } else {
      passwordInput.classList.remove("invalid");
    }

    if (isValidEmail && isValidPassword) {
      const user = JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      });

      const response = await logIn(user);

      if (response.userId === 1) {
        sessionStorage.setItem("token", response.token);
        window.location.href = "index.html";
      } else {
        errorDial.style.display = "block";
      }
    }
  } catch (err) {
    console.error(err);
  }
});
console.log("sophie.bluel@test.tld") 
console.log("S0phie")