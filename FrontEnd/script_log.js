const mailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const sendInput = document.getElementById("send-input");
const errorDial = document.getElementById("error-message");
const loginUrl = "http://localhost:5678/api/users/login";

async function logIn(data) { // Fonction d'authentification
	const loginOptions = {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: data,
	};
	return await (await fetch(loginUrl, loginOptions)).json(); //effectuer la requête POST fetch et attendre la requête avant de continuer
}

sendInput.addEventListener("click", async (event) => { // Gestionnaire d'événements pour le bouton d'envoi
	try {
		event.preventDefault();

		// Vérification de la validité des champs
		const isValidEmail = mailInput.checkValidity();
		const isValidPassword = passwordInput.checkValidity();

		switch (true) {
			case !isValidEmail && !isValidPassword:
				errorDial.style.display = "block";
				break;
			case !isValidEmail:
				errorDial.innerText = "Adresse e-mail invalide";
				break;
			case !isValidPassword:
				errorDial.innerText = "Mot de passe invalide";
				break;
			default:
				errorDial.style.display = "none";
				break;
		}

		const user = JSON.stringify({ //Convertir les donnes JS en une chaîne JSON
			email: mailInput.value,
			password: passwordInput.value,
		});

		const response = await logIn(user); // stocker la réponse de la fonction logIn.

		if (response.userId === 1) { // condition si (userId) est la réponse du serveur
			sessionStorage.setItem("token", response.token); //stocke le jeton dans le stockage local
			window.location.href = "index.html";
		} else {
			errorDial.style.display = "block";
		}
	} catch (err) {
		console.error(err);
	}
});

console.log("sophie.bluel@test.tld");
console.log("S0phie");
