// Récupération des travaux depuis le back-end
const urlWorks = "http://localhost:5678/api/works" 
// Utilisation de fetch pour envoyer une requête GET
fetch(urlWorks)
	.then((response) => {
		// Vérifier si la requête a réussi (statut 200-299)
		if (!response.ok) {
			throw new Error("Erreur de requête réseau") 
		}
		return response.json()  // Convertir la réponse en JSON
	})
	.then((data) => {
		// Traitement des données récupérées
		const gallery = document.querySelector(".gallery")  //Sélection de l'élément DOM avec la classe "gallery" pour y ajouter les travaux.
		// Utilisation de for...of pour simplifier la boucle
		for (const elements of data) {
			const project = createProject(elements)  //Appel de la fonction à partir des données
			gallery.appendChild(project)  //ajout dans la galerie
		}
	}) 
function createProject(elements) {
	// Création des balises
	const project = document.createElement("figure") 
	const img = document.createElement("img") 
	const imgTitle = document.createElement("figcaption") 
	// Configuration des éléments avec les données
	img.src = elements.imageUrl 
	imgTitle.innerText = elements.title 
	// Attachement des éléments au DOM
	project.appendChild(img) 
	project.appendChild(imgTitle) 
	// Ajout de classes et attributs
	project.classList.add("project") 
	project.setAttribute("data-category", elements.category.name) 

	return project 
}
// Filtrage des projets
fetch("http://localhost:5678/api/categories")
	.then((response) => {
		if (!response.ok) {
			throw new Error("Erreur de requête réseau") 
		}
		return response.json() 
	})
	.then((dataCategory) => {
		// Récupérez la liste des filtres
		const filters = document.querySelectorAll(".filtres div") 
		// Fonction pour activer le filtre
		function setActiveFilter(filter) {
			filters.forEach((f) => f.classList.remove("active")) 
			filter.classList.add("active") 
		}
		// Écoutez les clics sur les boutons de filtre
		filters.forEach((filter) => {
			filter.addEventListener("click", () => {
				// Récupérez le nom de la catégorie du filtre cliqué
				const filterName = filter.textContent.trim()  // Utilisez le contenu textuel du filtre comme catégorie

				// Filtrage des projets en fonction du nom de la catégorie
				const projects = document.querySelectorAll(".project") 

				projects.forEach((project) => {
					const projectCategory = project.getAttribute("data-category") 

					project.style.display =
						filterName === "Tous" || filterName === projectCategory ? "block" : "none" 
				}) 
				// Mettre en surbrillance le filtre actif
				setActiveFilter(filter) 
			}) 
			// Mettez en surbrillance le filtre par défaut (ici, le premier filtre)
			if (filter.classList.contains("tous")) {
				setActiveFilter(filter) 
			}
		}) 
	})

	.catch((error) => {
		console.error(
			"Une erreur s'est produite lors de la récupération des catégories : ",
			error
		) 
	}) 
//Authentification de l’utilisateur
// Récupération de login depuis le back-end
const loginUrl = "http://localhost:5678/api-docs/#/default/post_users_login" 
fetch(loginUrl) 
async function logIn(data) {
	const loginOptions = {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: data,
	} 
	return await (await fetch(loginUrl, loginOptions)).json() 
}

// Vérifier l'état de connexion
function isConnected() {
	return !!sessionStorage.getItem("token") //récupère l'élément stocké sous la clé "token"
} //L'opérateur !! convertir la valeur de retour en un booléen
const loginLogoutButton = document.querySelector(".login_logout")
const buttonModif = document.querySelector('.js-modal')
const filters = document.querySelector(".filtres")
if (isConnected()) {
	loginLogoutButton.innerText = "Logout" //Changer le texte lorsque l'utilisateur est connecté
	buttonModif.style.display = 'flex'
	filters.style.display = 'none'
	loginLogoutButton.addEventListener("click", () => {
		sessionStorage.removeItem("token") //supprime le jeton de connexion de la session de stockage
		window.location.replace("index.html")  //rediriger vers deconnexion
	})
}

let modal = null //stocker l'élément modal actuel

const openModal = function (e) {
  const targetModalId = e.currentTarget.getAttribute('href').substring(1)
  modal = document.getElementById(targetModalId) 
  if (modal) {
    modal.style.display = 'flex' 
    modal.removeAttribute('aria-hidden') 
    modal.setAttribute('aria-modal', 'true') 
    modal.addEventListener('click', closeModal) 
    modal.querySelector('.fa-xmark').addEventListener('click', closeModal) 
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation) 
  }
} 

const closeModal = function (e) {
  if (!modal) return 
  modal.style.display = 'none' 
  modal.setAttribute('aria-hidden', 'true') 
  modal.removeAttribute('aria-modal') 
  modal.removeEventListener('click', closeModal) 
  modal.querySelector('.fa-xmark').removeEventListener('click', closeModal) 
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation) 
  modal = null 
} 

const stopPropagation = function (e) {
  e.stopPropagation() 
} 

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal) 
}) 

//Affichage des projets dans la modale

fetch("http://localhost:5678/api/works")
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur de requête réseau') 
    }
    return response.json() 
  })
  .then(data => {
    const galleryModale = document.querySelector(".project-modale") 

    const createProjectElement = (elements) => {
      const projectModale = document.createElement("figure") 
      const img = document.createElement("img") 
      img.src = elements.imageUrl 

      projectModale.appendChild(img) 
      galleryModale.appendChild(projectModale) 

      projectModale.classList.add("project") 
      projectModale.setAttribute("data-category", elements.category.name) 

      const createTrashIcon = () => {
        const corbeille = document.createElement("i") 
        corbeille.classList.add("fa-solid", "fa-trash-can") 
        return corbeille 
      } 

      const contentCorbeille = document.createElement("div") 
	  contentCorbeille.classList.add("trash") 
      contentCorbeille.appendChild(createTrashIcon()) 
      projectModale.appendChild(contentCorbeille) 

      contentCorbeille.addEventListener("click", () => handleTrashClick(elements.id)) 
    } 

    const handleTrashClick = (projectId) => {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?") 
      if (confirmation) {
        const token = sessionStorage.getItem("token") 
        if (token) {
          fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`
            },
            accept: "application/json",
          })
            .then(response => {
              if (!response.ok) {
                throw new Error("Erreur de requête réseau") 
              }
              return response 
            })
            .then(() => {
              const projectModale = document.querySelector(`.project[data-category="${projectId}"]`) 
              if (projectModale) {
                projectModale.remove() 
              }
            })
            .catch(error => {
              console.error(error) 
            }) 
        }
      }
    } 

    data.forEach(createProjectElement) 
  })
  .catch(error => {
    console.error(error) 
  }) 
