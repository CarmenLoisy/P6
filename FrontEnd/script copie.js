const urlWorks = "http://localhost:5678/api/works";
fetch(urlWorks) // Utilisation de fetch pour envoyer une requête GET
	.then((response) => {
		if (!response.ok) {
			// Vérifier si la requête a réussi (statut 200-299)
			throw new Error("Erreur de requête réseau");
		}
		return response.json(); // Convertir la réponse en JSON
	})
	.then((data) => {
		// Traitement des données récupérées
		const gallery = document.querySelector(".gallery"); //Sélection de l'élément DOM avec la classe "gallery" pour y ajouter les travaux.
		for (const elements of data) {
			// Utilisation de for...of pour simplifier la boucle
			const project = createProject(elements); //Appel de la fonction à partir des données
			gallery.appendChild(project); //ajout dans la galerie
		}
		console.log(typeof project + ": project " + data.length);
	});
function createProject(elements) {
	// Création des balises
	const img = document.createElement("img");
	const imgTitle = document.createElement("figcaption");
	project = document.createElement("figure");
	// Configuration des éléments avec les données
	img.src = elements.imageUrl;
	imgTitle.innerText = elements.title;
	// Attachement des éléments au DOM
	project.appendChild(img);
	project.appendChild(imgTitle);
	// Ajout de classes et attributs
	project.classList.add("project");
	project.setAttribute("data-category", elements.category.name); // l'objet elements a une propriété category qui elle-même a une propriété name.
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
		const filterSet = new Set(); // Utiliser un objet Set pour stocker les filtres uniques
		const filters = document.querySelectorAll(".filtres div"); // Récupérez la liste des filtres
		function setActiveFilter(filter) {
			// Fonction pour activer le filtre
			filters.forEach((f) => f.classList.remove("active")); //appliquer la classe "active" à l'élément spécifique
			filter.classList.add("active");
			console.log(filter.classList);
		}
		filters.forEach((filter) => {
			// Écoutez les clics sur les boutons de filtre
			filter.addEventListener("click", () => {
				// Récupérez le nom de la catégorie du filtre cliqué
				const filterName = filter.textContent.trim(); // Utilisez le contenu textuel du filtre comme catégorie
				console.log(filterName);
				const projects = document.querySelectorAll(".project"); // Filtrage des projets en fonction du nom de la catégorie
				projects.forEach((project) => {
					const projectCategory = project.getAttribute("data-category");
					project.style.display =
						filterName === "Tous" || filterName === projectCategory ? "block" : "none";
				});
				setActiveFilter(filter); // Mettre en surbrillance le filtre actif
			});
			if (filter.classList.contains("tous")) {
				// Mettez en surbrillance le filtre par défaut (ici, le premier filtre)
				setActiveFilter(filter);
			}
			filterSet.add(filter.textContent.trim()); // Ajouter le filtre à l'objet Set
		});
		console.log("Liste unique des filtres:", filterSet); // Accéder à la liste unique des filtres
	})
	.catch((error) => {
		console.error(
			"Une erreur s'est produite lors de la récupération des catégories : ",
			error
		);
	});
// Vérifier l'état de connexion
function isConnected() {
	return !!sessionStorage.getItem("token"); //récupère l'élément stocké sous la clé "token"
}
//L'opérateur !! convertir la valeur de retour en un booléen
const loginLogoutButton = document.querySelector(".login_logout");
const buttonModif = document.querySelector(".js-modal");
const filters = document.querySelector(".filtres");
if (isConnected()) {
	loginLogoutButton.innerText = "Logout"; //Changer le texte lorsque l'utilisateur est connecté
	buttonModif.style.display = "flex";
	filters.style.display = "none";
	loginLogoutButton.addEventListener("click", () => {
		sessionStorage.removeItem("token"); //supprime le jeton de connexion de la session de stockage
		window.location.replace("index.html"); //rediriger vers deconnexion
	});
}
//Affichage des projets dans la modale
async function fetchData(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Erreur de requête réseau");
	}
	return response.json();
}
function createProjectElement(elements) {
	const projectModale = document.createElement("figure");
	projectModale.classList.add("project");
	projectModale.setAttribute("data-category", elements.category.name);

	const img = document.createElement("img");
	img.src = elements.imageUrl;
	projectModale.appendChild(img);

	const corbeille = document.createElement("i");
	corbeille.classList.add("fa-solid", "fa-trash-can");

	const contentCorbeille = document.createElement("div");
	contentCorbeille.classList.add("trash");
	contentCorbeille.appendChild(corbeille);
	projectModale.appendChild(contentCorbeille);

	contentCorbeille.addEventListener("click", () => handleTrashClick(elements.id));

	return projectModale;
}

async function handleTrashClick(projectId) {
	const confirmation = window.confirm(
		"Êtes-vous sûr de vouloir supprimer ce projet ?"
	);
	if (confirmation) {
		const token = sessionStorage.getItem("token");
		if (token) {
			try {
				const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					accept: "application/json",
				});

				if (!response.ok) {
					throw new Error("Erreur de requête réseau");
				}

				const projectModale = document.querySelector(
					`.project[data-category="${projectId}"]`
				);
				if (projectModale) {
					projectModale.remove();
				}
			} catch (error) {
				console.error(error);
			}
		}
	}
}

async function main() {
	try {
		const data = await fetchData(urlWorks);
		const galleryModale = document.querySelector(".project-modale");
		data
			.map(createProjectElement)
			.forEach((projectModale) => galleryModale.appendChild(projectModale));
	} catch (error) {
		console.error(error);
	}
}

main();

// Récupère tous les éléments modals
const modalElements = document.querySelectorAll(".js-modal");
// Variable pour stocker le modal actif
let activeModal = null;
// Récupère le composant modal principal
const modal = document.querySelector(".modal");
// Fonction pour ouvrir un modal
const openModal = (event) => {
	const targetModalId = event.currentTarget.getAttribute("href").substring(1); // Extrait l'ID du modal à partir de l'attribut href du lien déclencheur
	const modalElement = document.getElementById(targetModalId); // Trouve l'élément modal correspondant à l'ID
	if (modalElement) { // Si l'élément modal existe
	 	activeModal = modalElement; // Défini le modal actuel comme actif
	 	modalElement.style.display = "flex";
	 	modalElement.removeAttribute("aria-hidden");
		modalElement.setAttribute("aria-modal", true);
		activeModal.addEventListener("click", closeModal);
		modalElement.querySelector(".fa-xmark").addEventListener("click", closeModal);
		modalElement.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
	}
};
// Fonction pour fermer le modal actif
const closeModal = () => {
	if (!activeModal) return; // Si aucun modal actif, termine la fonction
	activeModal.style.display = "none"; // Cache le modal actif, rétablit l'attribut aria-hidden, supprime l'attribut aria-modal et supprime les écouteurs d'événements
	activeModal.setAttribute("aria-hidden", true);
	activeModal.removeAttribute("aria-modal");
	activeModal.removeEventListener("click", closeModal);
	activeModal.querySelector(".fa-xmark").removeEventListener("click", closeModal);
	activeModal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
	activeModal = null; // Défini le modal actuel comme vide
};
// Fonction pour empêcher la propagation d'événements
const stopPropagation = (event) => {
	event.stopPropagation();
};
// Attache l'écouteur d'événements «click» à tous les éléments avec la classe «js-modal»
modalElements.forEach((element) => {
	element.addEventListener("click", openModal);
});
// Récupère les éléments des modales, les boutons et les flèches de navigation
const modale1 = document.querySelector(".modal-1");
const modale2 = document.querySelector(".modal-2");
const boutonAjouter = document.querySelector(".button1");
const leftArrow = document.querySelector(".fa-arrow-left");
// Fonction pour basculer vers le modal 2 et désactiver la fermeture du modal 1
boutonAjouter.addEventListener("click", (event) => {
	// Cache le modal principal et affiche le modal 2
	modale1.style.display = "none";
	modale2.style.display = "block";
	// Ajoute les écouteurs d'événements pour fermer le modal 2
	modal.addEventListener("click", closeModal);
	modal.querySelector(".modal-2.js-modal-stop > .fa-xmark").addEventListener("click", closeModal);
	modal.querySelector(".modal-2.js-modal-stop").addEventListener("click", stopPropagation);
});
// Fonction pour basculer vers le modal 1 et activer la fermeture du modal 1
leftArrow.addEventListener("click", () => {
	// Cache le modal 2 et affiche le modal 1
	modale2.style.display = "none";
	modale1.style.display = "flex";
});
// Previsualiser photo
const btnAddPhoto = document.querySelector(".button3");
const inputPhoto = document.querySelector("#file");
btnAddPhoto.addEventListener("change", () => {
	const addPhoto = document.querySelector(".ajoutPhoto");
	const addPhotoIcon = document.querySelector(".fa-image");
	const addPhotoInstructions = document.querySelector(".instruction");
	console.log(inputPhoto.files.length);
	if (inputPhoto.files.length > 0) {
		const photo = inputPhoto.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.src = e.target.result;
			img.classList.add("uploaded-photo");
			addPhoto.appendChild(img);
		};
		reader.readAsDataURL(photo);
		addPhotoIcon.style.display = "none";
		inputPhoto.style.display = "none";
		addPhotoInstructions.style.display = "none";
		btnAddPhoto.style.display = "none";
	}
});
// Envoi des nouveaux projets
const titleInput = document.getElementById("title");
const categorySelect = document.querySelector("select");
const fileInput = document.getElementById("file");
const addButton = document.querySelector(".btn_validate");
addButton.addEventListener("click", () => {
	const title = titleInput.value;
	const category = categorySelect.value;
	const imageFile = fileInput.files[0];
	const formData = new FormData();
	formData.append("title", title);
	formData.append("category", category);
	formData.append("image", imageFile);
	const token = sessionStorage.getItem("token");
	if (token) {
		fetch(urlWorks, {
			method: "POST",
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			accept: "application/json",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Erreur de requête réseau");
				}
				return response.json();
			})
			.then((data) => {
				alert("Projet ajouté avec succès !");
				location.reload(true);
			})
			.catch((error) => {
				console.error(error);
				alert("Erreur, le formulaire n’est pas correctement rempli.");
			});
	}
});
