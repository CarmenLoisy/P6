const urlWorks = "http://localhost:5678/api/works";
const urlCategories = "http://localhost:5678/api/categories";

async function fetchData(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Erreur de requête réseau`);
	}
	return response.json();
}
function createProject(elements) {
	const project = document.createElement("figure");
	project.classList.add("project");
	project.setAttribute("data-category", elements.category.name);

	const img = document.createElement("img");
	img.src = elements.imageUrl;

	const imgTitle = document.createElement("figcaption");
	imgTitle.innerText = elements.title;
	project.appendChild(img);
	project.appendChild(imgTitle);

	return project;
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
		const gallery = document.querySelector(".gallery");

		data.forEach((elements) => {
			const project = createProject(elements);
			gallery.appendChild(project);
		});

		console.log(`projects count: ${data.length}`);
	} catch (error) {
		console.error(error);
	}
	try {
		const dataModale = await fetchData(urlWorks);
		const galleryModale = document.querySelector(".project-modale");

		dataModale
			.map(createProjectElement)
			.forEach((projectModale) => galleryModale.appendChild(projectModale));

		console.log(`modale projects count: ${dataModale.length}`);
	} catch (error) {
		console.error(error);
	}
}

async function initCategories() {
	try {
		const dataCategory = await fetchData(urlCategories);
		const filterSet = new Set();
		const filters = document.querySelectorAll(".filtres div");

		function setActiveFilter(filter) {
			filters.forEach((f) => f.classList.remove("active"));
			filter.classList.add("active");
		}

		filters.forEach((filter) => {
			filter.addEventListener("click", () => {
				const filterName = filter.textContent.trim();
				const projects = document.querySelectorAll(".project");

				projects.forEach((project) => {
					const projectCategory = project.getAttribute("data-category");
					project.style.display =
						filterName === "Tous" || filterName === projectCategory ? "block" : "none";
				});

				setActiveFilter(filter);
			});

			if (filter.classList.contains("tous")) {
				setActiveFilter(filter);
			}

			filterSet.add(filter.textContent.trim());
		});

		console.log("Liste unique des filtres:", filterSet);
	} catch (error) {
		console.error(
			"Une erreur s'est produite lors de la récupération des catégories : ",
			error
		);
	}
}

function isConnected() {
	return !!sessionStorage.getItem("token");
}

async function setupPage() {
	if (isConnected()) {
		const loginLogoutButton = document.querySelector(".login_logout");
		const buttonModif = document.querySelector(".js-modal");
		const filters = document.querySelector(".filtres");

		loginLogoutButton.innerText = "Logout";
		buttonModif.style.display = "flex";
		filters.style.display = "none";

		loginLogoutButton.addEventListener("click", () => {
			sessionStorage.removeItem("token");
			window.location.replace("index.html");
		});
	}
}

async function init() {
	await Promise.all([main(), initCategories(), setupPage()]);
}

init();

const modalElements = document.querySelectorAll(".js-modal");
let activeModal = null;
const modal = document.querySelector(".modal");

function openModal(event) {
	const targetModalId = event.currentTarget.getAttribute("href").substring(1);
	const modalElement = document.getElementById(targetModalId);
	if (modalElement) {
		activeModal = modalElement;
		modalElement.style.display = "flex";
		modalElement.removeAttribute("aria-hidden");
		modalElement.setAttribute("aria-modal", true);
		activeModal.addEventListener("click", closeModal);
		modalElement.querySelector(".fa-xmark").addEventListener("click", closeModal);
		modalElement
			.querySelector(".js-modal-stop")
			.addEventListener("click", stopPropagation);
	}
}

function closeModal() {
	if (!activeModal) return;
	activeModal.style.display = "none";
	activeModal.setAttribute("aria-hidden", true);
	activeModal.removeAttribute("aria-modal");
	activeModal.removeEventListener("click", closeModal);
	activeModal.querySelector(".fa-xmark").removeEventListener("click", closeModal);
	activeModal
		.querySelector(".js-modal-stop")
		.removeEventListener("click", stopPropagation);
	activeModal = null;
}

function stopPropagation(event) {
	event.stopPropagation();
}

modalElements.forEach((element) => {
	element.addEventListener("click", openModal);
});

const modale1 = document.querySelector(".modal-1");
const modale2 = document.querySelector(".modal-2");
const boutonAjouter = document.querySelector(".button1");
const leftArrow = document.querySelector(".fa-arrow-left");

boutonAjouter.addEventListener("click", (event) => {
	modale1.style.display = "none";
	modale2.style.display = "block";
	modal.addEventListener("click", closeModal);
	modal
		.querySelector(".modal-2.js-modal-stop > .fa-xmark")
		.addEventListener("click", closeModal);
	modal
		.querySelector(".modal-2.js-modal-stop")
		.addEventListener("click", stopPropagation);
});

leftArrow.addEventListener("click", () => {
	modale2.style.display = "none";
	modale1.style.display = "flex";
});

const btnAddPhoto = document.querySelector(".button3");
const inputPhoto = document.querySelector("#file");
const addPhoto = document.querySelector(".ajoutPhoto");
const fileInput = document.getElementById("file");
addPhoto.addEventListener("click", () => {
	fileInput.click();
});
fileInput.addEventListener("change", () => {
	console.log("Fichier sélectionné :", fileInput.files[0]);
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
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("categories");
const addButton = document.querySelector(".btn_validate");
addButton.addEventListener("click", async (event) => {
	event.preventDefault();
	const title = titleInput.value;
	const category = categorySelect.value;
	const imageFile = fileInput.files[0];
	const formData = new FormData();

	formData.append("title", title);
	formData.append("category", category);
	formData.append("image", imageFile);
	const token = sessionStorage.getItem("token");
	
	const isValidTitle = titleInput.validity.valid;
	const isValidFile = fileInput.validity.valid;
	if (!isValidTitle || !isValidFile) {
		addPhoto.classList.toggle("invalid", !isValidFile);
		titleInput.classList.toggle("invalid", !isValidTitle);
		switch (category) {
			case "1":
			case "2":
			case "3":
				categorySelect.classList.remove("invalid");
				break;
			case "":
				categorySelect.classList.add("invalid");
				break;
		}
		return;
	}
	 if (category === "") {
	 	return;
	 }
	try {
		const response = await fetch(urlWorks, {
			method: "POST",
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			accept: "application/json",
		});
		location.reload(true);
		if (!response.ok) {
			throw new Error("Erreur de requête réseau");
		}
	} catch (error) {
		console.error(error);
	}
});