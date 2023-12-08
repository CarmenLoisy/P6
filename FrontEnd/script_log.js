console.log("sophie.bluel@test.tld")
console.log("S0phie")
// Sélection des éléments du DOM
const mailInput = document.getElementById('emailInput')
const mdpInput = document.getElementById('passwordInput')
const sendInput = document.getElementById('send-input')
const errorDial = document.getElementById('error-message')

// URL pour l'authentification
const loginUrl = "http://localhost:5678/api/users/login"
// Fonction d'authentification 
async function logIn(data) { // Opération asynchrone de côté client vers le serveur
  const loginOptions = {
    method: "POST",//Soumettre des données au serveur
    headers: {// L'en-têtes HTTP de la requête
      "content-type": "application/json",
    },
    body: data,//Données envoyées au format JSON
  }
  return await (await fetch(loginUrl, loginOptions)).json()//effectue la requête POST fetch et attendre la requête avant de continuer
}

// Gestionnaire d'événements pour le bouton d'envoi
sendInput.addEventListener("click", async (event) => {
  try {
    event.preventDefault()
    // Parcourir les propriétés et d'accéder à leurs valeurs
    const user = JSON.stringify({//Convertir les donnes JS en une chaîne JSON
		email: mailInput.value,
		password: mdpInput.value,
	  })
    // stocker la réponse de la fonction logIn.
	const response = await logIn(user)//attendre que la fonction logIn soit terminée
    // Traitement de la réponse
    console.log(response)
    if (response.userId === 1) {// condition si (userId) est la réponse du serveur
      sessionStorage.setItem("token", response.token)//stocke le jeton dans le stockage local
      window.location.href = "index.html"//redirige vers la page d'index
    } else {//sinon affiche un message d'erreur
      errorDial.style.display = "block"// dans une boîte modale
    }
  } catch (err) {//Intercepte l'erreur et l'affiche dans la console
    console.error(err)
  }
})