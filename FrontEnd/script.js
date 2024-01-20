const urlWorks = "http://localhost:5678/api/works";
const urlCategories = "http://localhost:5678/api/categories";
async function fetchData(url) {//Requêtes asynchrones pour récupérer des données à partir de l'un des deux endpoints
	const response = await fetch(url); // Utilisation de fetch pour envoyer une requête GET
	if (!response.ok) {// Vérifier si la requête a réussi (statut 200-299)
		throw new Error(`Erreur de requête réseau`);
	}
	return response.json(); // Convertir la réponse en JSON
}
async function main() {//Affichage des données dans...
	try {//... la galerie
		const data = await fetchData(urlWorks);
		const gallery = document.querySelector(".gallery");
		data.forEach((element) => { // Utilisation de forEach pour simplifier la boucle
			const project = createProject(element);
			gallery.appendChild(project);
		});
	} catch (error) {
		console.error(error);
	}
	try {//... la modale
		const data = await fetchData(urlWorks);
		const galleryModale = document.querySelector(".project-modale");
		data
			.map(createProjectElement)
			.forEach((projectModale) => galleryModale.appendChild(projectModale));
	} catch (error) {
		console.error(error);
	}
}
function createProject(element) {//Générer des éléments HTML pour afficher les projets dans galerie
	const project = document.createElement("figure");//
	const img = document.createElement("img");
    img.setAttribute("alt", element.title); // Utiliser la valeur de l'élément actuel
	const imgTitle = document.createElement("figcaption");//
	img.src = element.imageUrl; // Ajout d'attributs//
	imgTitle.innerText = element.title;//
	project.appendChild(img); // Attachement des éléments au DOM
	project.appendChild(imgTitle);
	project.classList.add("project"); // Ajout de classes
	project.setAttribute("data-category", element.category); // l'objet element a une propriété category qui elle-même a une propriété name.
	return project;
}

function initCategories() {// Filtrage des projets
	const filterSet = new Set(); // Utilisation d'un objet Set pour stocker les filtres uniques
	const filters = document.querySelectorAll(".filtres div");
	function setActiveFilter(filter) {// Fonction pour activer le filtre
		filters.forEach((f) => f.classList.remove("active"));
		filter.classList.add("active");
	}
	filters.forEach((filter) => {// Écoute des clics sur les boutons de filtre
		filter.addEventListener("click", () => {// Récupération du nom de la catégorie du filtre cliqué
			const filterName = filter.textContent.trim();
			const projects = document.querySelectorAll(".project");
			projects.forEach((project) => {// Filtrage des projets en fonction du nom de la catégorie
				const projectCategory = project.getAttribute("data-category");
				project.style.display =
					filterName === "Tous" || filterName === projectCategory ? "block" : "none";
			});
			setActiveFilter(filter); // Mise en surbrillance du filtre actif
		});
		if (filter.classList.contains("tous")) {// Mettez en surbrillance le filtre par défaut (ici, le premier filtre)
			setActiveFilter(filter);
		}
		filterSet.add(filter.textContent.trim()); // Ajout du filtre à l'objet Set pour s'assurer qu'il est unique
	});
	//console.log("Liste unique des filtres:", filterSet);
}
function isConnected() {//Récupère l'élément stocké sous la clé "token"
	return !!sessionStorage.getItem("token");
}
function setupPage() {//si l'utilisateur est connecté
	if (isConnected()) {
		const ModeEdition = document.querySelector(".ModeEdition");
		const loginLogoutButton = document.querySelector(".login_logout");
		const buttonModif = document.querySelector(".js-modal");
		const filters = document.querySelector(".filtres");

		ModeEdition.style.display = "flex";
		loginLogoutButton.innerText = "Logout";
		buttonModif.style.display = "flex";
		filters.style.display = "none";

		loginLogoutButton.addEventListener("click", () => {
			sessionStorage.removeItem("token"); //supprime le jeton de connexion de la session de stockage
			window.location.replace("index.html"); //rediriger vers deconnexion
		});
	}
}
async function init() { //Exécuter les tâches en parallèle
	await Promise.all([main(), initCategories(), setupPage()]);
}
init();
//Gérer l'ouverture et la fermeture d'une fenêtre modale
const modalElements = document.querySelectorAll(".js-modal");
let activeModal = null; // Variable pour stocker le modal actif
const modal = document.querySelector(".modal");
function openModal(event) {// Fonction pour ouvrir un modal
	event.preventDefault(); // Éviter le rafraîchissement de la page
	const targetModalId = event.currentTarget.getAttribute("href").substring(1); // Extrait l'ID du modal à partir de l'attribut href du lien déclencheur
	const modalElement = document.getElementById(targetModalId); // Trouve l'élément modal correspondant à l'ID
	if (modalElement) {// Si l'élément modal existe
		activeModal = modalElement; // Défini le modal actuel comme actif
		modalElement.style.display = "flex";
		modalElement.removeAttribute("aria-hidden");
		activeModal.addEventListener("click", closeModal);
		modalElement.querySelector(".fa-xmark").addEventListener("click", closeModal);
		modalElement.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
	}
}
function closeModal() {// Fonction pour fermer le modal actif
	if (!activeModal) return; // Si aucun modal actif, termine la fonction
	activeModal.style.display = "none";
	activeModal.setAttribute("aria-hidden", true);
	activeModal.removeAttribute("aria-modal");
	activeModal.removeEventListener("click", closeModal);
	activeModal.querySelector(".fa-xmark").removeEventListener("click", closeModal);
	activeModal
		.querySelector(".js-modal-stop")
		.removeEventListener("click", stopPropagation);
	activeModal = null; // Défini le modal actuel comme vide
}
function stopPropagation(event) {// Fonction pour empêcher la propagation d'événements
	event.stopPropagation();
}
modalElements.forEach((element) => {// Attache l'écouteur d'événements «click» à tous les éléments avec la classe «js-modal»
	element.addEventListener("click", openModal);
});
function createProjectElement(element) {//Générer des éléments HTML pour afficher les projets dans la modale
	const projectModale = document.createElement("figure");
	projectModale.classList.add("project");

	// Utilisation de l'ID du projet comme ID de l'élément
    projectModale.id = `project-${element.id}`;
	
	projectModale.setAttribute("data-category", element.category);// l'objet element a une propriété category qui elle-même a une propriété name.
	const img = document.createElement("img");
	img.src = element.imageUrl; // Ajout d'attribut
	projectModale.appendChild(img);

	const corbeille = document.createElement("i");
	corbeille.classList.add("fa-solid", "fa-trash-can");
	const contentCorbeille = document.createElement("div");
	contentCorbeille.classList.add("trash");
	contentCorbeille.appendChild(corbeille);
	projectModale.appendChild(contentCorbeille);
	
	contentCorbeille.addEventListener("click", (event) => { // Passer l'événement à la fonction handleTrashClick
	 	handleTrashClick(element.id, event);
	 	event.preventDefault(); // Empêcher le comportement par défaut du lien (éviter le rechargement de la page)
	 });
	return projectModale;
}
async function handleTrashClick(projectId, event) {//Gestion de la corbeille
	event.preventDefault(); // Empêcher le comportement par défaut du lien (éviter le rechargement de la page)
		const token = sessionStorage.getItem("token");
		if (token) { // Si un token est présent suppression du projet
			try {//requête de type DELETE à l'API pour supprimer le projet spécifié id
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
				// Supprimer l'élément du DOM
				const projectElement = document.getElementById(`project-${projectId}`);
				if (projectElement) {
					projectElement.remove();
					console.log(projectElement)
				  }
			} catch (error) {
				console.error(error);
			}
		}
	}
//Passer du modal 1 au modal 2
const modale1 = document.querySelector(".modal-1");
const modale2 = document.querySelector(".modal-2");
const boutonAjouter = document.querySelector(".button1");
const leftArrow = document.querySelector(".fa-arrow-left");
boutonAjouter.addEventListener("click", (event) => {
	modale1.style.display = "none";
	modale2.style.display = "block";
	modal.addEventListener("click", closeModal);
	modal.querySelector(".modal-2.js-modal-stop > .fa-xmark").addEventListener("click", closeModal);
	modal.querySelector(".modal-2.js-modal-stop").addEventListener("click", stopPropagation);
});
leftArrow.addEventListener("click", () => {
	modale2.style.display = "none";
	modale1.style.display = "flex";
});
//Envoyer d’un nouveau projet au back-end via le formulaire de la modale.
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("categories");
const addButton = document.querySelector(".btn_validate");
const addPhoto = document.querySelector(".ajoutPhoto");
const fileInput = document.getElementById("file");
let previousImage = null;
const handleFileChange = () => {//Gérer le changement de fichier
  const btnAddPhoto = document.querySelector(".button3");
  const addPhotoIcon = document.querySelector(".fa-image");
  const addPhotoInstructions = document.querySelector(".instruction");
  if (previousImage) {// Supprimer l'image précédente si elle existe
    previousImage.remove();
  }
  if (fileInput.files.length > 0) { //vérifie s'il y a au moins un fichier dans fileInput.
    const photo = fileInput.files[0]; //Récupérér la première image
    const reader = new FileReader(); //lire le contenu du fichier image 
    reader.onload = (e) => {//Si la lecture du fichier est terminée
      const img = new Image();//chargement l'image
      img.src = e.target.result; //les données sous forme d'URL
      img.classList.add("uploaded-photo");
      previousImage = img;// Mettre à jour l'image précédente
      addPhoto.appendChild(img);//afficher la prévisualisation de l'image
    };
    reader.readAsDataURL(photo);
    addPhotoIcon.style.display = "none";
    btnAddPhoto.style.display = "none";
    addPhotoInstructions.style.display = "none";
  }
};
const handleSubmit = async (event) => {//Soumission du formulaire
  event.preventDefault();
  const title = titleInput.value; //récupère les valeurs 
  const category = categorySelect.value;
  const imageFile = fileInput.files[0];
  const formData = new FormData(); // traiter des données de formulaire pour envoyer les données au serveur.
  formData.append("title", title); //ajoute une paire clé-valeur title
  formData.append("category", category);
  formData.append("image", imageFile);
  // Gestion des erreurs de validation
  const isValidTitle = titleInput.validity.valid;
  const isValidFile = fileInput.validity.valid;
  if (!isValidTitle || !isValidFile || category === "") { 
    addPhoto.classList.toggle("invalid", !isValidFile);
    titleInput.classList.toggle("invalid", !isValidTitle);
    categorySelect.classList.toggle("invalid", category === "");
    return;
  }
  const token = sessionStorage.getItem("token"); //Récupération du jeton d'authentification
  try {
    const response = await fetch(urlWorks, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      accept: "application/json",
    });
    if (!response.ok) {
      throw new Error("Erreur de requête réseau");
    }
	const element = await response.json();
	
	    // Ajout à la galerie
		const gallery = document.querySelector(".gallery");
		const project = createProject(element);
		gallery.appendChild(project);
	
		// Ajout à la modale
		const galleryModale = document.querySelector(".project-modale");
		const projectModale = createProjectElement(element);
		galleryModale.appendChild(projectModale);
	
	// Effacer les valeurs du formulaire après l'ajout réussi
	titleInput.value = "";
	fileInput.value = "";
	categorySelect.value = "";
	closeModal()

  } catch (error) {
    console.error(error);
  }
};
addButton.addEventListener("click", handleSubmit); // Ajout d'événement sur le bouton "Valider"
fileInput.addEventListener("change", handleFileChange); // Ajout d'événement sur le changement de fichier
addPhoto.addEventListener("click", () => {// Ajout d'événement sur le bouton "Ajouter photo"
  fileInput.click();
});