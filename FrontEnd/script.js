// Récupération des travaux depuis le back-end
const urlWorks = "http://localhost:5678/api/works";
// Utilisation de fetch pour envoyer une requête GET
fetch(urlWorks)
	.then((response) => {
		// Vérifier si la requête a réussi (statut 200-299)
		if (!response.ok) {
			throw new Error("Erreur de requête réseau");
		}
		return response.json(); // Convertir la réponse en JSON
	})
	.then((data) => {
		// Traitement des données récupérées
		const gallery = document.querySelector(".gallery"); //Sélection de l'élément DOM avec la classe "gallery" pour y ajouter les travaux.
		// Utilisation de for...of pour simplifier la boucle
		for (const elements of data) {
			const project = createProject(elements); //Appel de la fonction à partir des données
			gallery.appendChild(project); //ajout dans la galerie
		}
	});
function createProject(elements) {
	// Création des balises
	const project = document.createElement("figure");
	const img = document.createElement("img");
	const imgTitle = document.createElement("figcaption");
	// Configuration des éléments avec les données
	img.src = elements.imageUrl;
	imgTitle.innerText = elements.title;
	// Attachement des éléments au DOM
	project.appendChild(img);
	project.appendChild(imgTitle);
	// Ajout de classes et attributs
	project.classList.add("project");
	project.setAttribute("data-category", elements.category.name);

	return project;
}
// Filtrage des projets
fetch("http://localhost:5678/api/categories")
	.then((response) => {
		if (!response.ok) {
			throw new Error("Erreur de requête réseau");
		}
		return response.json();
	})
	.then((dataCategory) => {
		// Récupérez la liste des filtres
		const filters = document.querySelectorAll(".filtres div");
		// Fonction pour activer le filtre
		function setActiveFilter(filter) {
			filters.forEach((f) => f.classList.remove("active"));
			filter.classList.add("active");
		}
		// Écoutez les clics sur les boutons de filtre
		filters.forEach((filter) => {
			filter.addEventListener("click", () => {
				// Récupérez le nom de la catégorie du filtre cliqué
				const filterName = filter.textContent.trim(); // Utilisez le contenu textuel du filtre comme catégorie

				// Filtrage des projets en fonction du nom de la catégorie
				const projects = document.querySelectorAll(".project");

				projects.forEach((project) => {
					const projectCategory = project.getAttribute("data-category");

					project.style.display =
						filterName === "Tous" || filterName === projectCategory ? "block" : "none";
				});
				// Mettre en surbrillance le filtre actif
				setActiveFilter(filter);
			});
			// Mettez en surbrillance le filtre par défaut (ici, le premier filtre)
			if (filter.classList.contains("tous")) {
				setActiveFilter(filter);
			}
		});
	})

	.catch((error) => {
		console.error(
			"Une erreur s'est produite lors de la récupération des catégories : ",
			error
		);
	});
//Authentification de l’utilisateur
// Récupération de login depuis le back-end
const loginUrl = "http://localhost:5678/api-docs/#/default/post_users_login";
fetch(loginUrl);
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

// Vérifier l'état de connexion
function isConnected() {
	return !!sessionStorage.getItem("token"); //récupère l'élément stocké sous la clé "token"
} //L'opérateur !! convertir la valeur de retour en un booléen
const loginLogoutButton = document.querySelector(".login_logout");
if (isConnected()) {
	loginLogoutButton.innerText = "Logout"; //Changer le texte lorsque l'utilisateur est connecté
	loginLogoutButton.addEventListener("click", () => {
		sessionStorage.removeItem("token"); //supprime le jeton de connexion de la session de stockage
		window.location.replace("index.html"); //rediriger vers deconnexion
	})
}
