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
// Récupère tous les éléments modals
const modalElements = document.querySelectorAll('.js-modal')  

// Variable pour stocker le modal actif
let activeModal = null  

// Récupère le composant modal principal
const modal = document.querySelector('.modal')  

// Fonction pour ouvrir un modal
const openModal = (event) => {
  // Extrait l'ID du modal à partir de l'attribut href du lien déclencheur
  const targetModalId = event.currentTarget.getAttribute('href').substring(1)  

  // Trouve l'élément modal correspondant à l'ID
  const modalElement = document.getElementById(targetModalId)  

  // Si l'élément modal existe
  if (modalElement) {
    // Défini le modal actuel comme actif
    activeModal = modalElement  

    // Affiche le modal, supprime l'attribut aria-hidden, ajoute l'attribut aria-modal et ajoute des écouteurs d'événements
    modalElement.style.display = 'flex'  
    modalElement.removeAttribute('aria-hidden')  
    modalElement.setAttribute('aria-modal', true)  
    activeModal.addEventListener('click', closeModal)  
    modalElement.querySelector('.fa-xmark').addEventListener('click', closeModal)  
    modalElement.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)  
  }
}  

// Fonction pour fermer le modal actif
const closeModal = () => {
  // Si aucun modal actif, termine la fonction
  if (!activeModal) return  

  // Cache le modal actif, rétablit l'attribut aria-hidden, supprime l'attribut aria-modal et supprime les écouteurs d'événements
  activeModal.style.display = 'none'  
  activeModal.setAttribute('aria-hidden', true)  
  activeModal.removeAttribute('aria-modal')  
  activeModal.removeEventListener('click', closeModal)  
  activeModal.querySelector('.fa-xmark').removeEventListener('click', closeModal)  
  activeModal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)  

  // Défini le modal actuel comme vide
  activeModal = null  
}  

// Attache l'écouteur d'événements «click» à tous les éléments avec la classe «js-modal»
modalElements.forEach(element => {
  element.addEventListener('click', openModal)  
})  

// Récupère les éléments des modales secondaires
const modale1 = document.querySelector('.modal-wrapper')  
const modale2 = document.querySelector('.blockModal2')  

// Récupère les boutons et les flèches de navigation
const boutonAjouter = document.querySelector(".button1")  
const leftArrow = document.querySelector(".fa-arrow-left")  

// Fonction pour basculer vers le modal 2 et désactiver la fermeture du modal 1
boutonAjouter.addEventListener('click', (event) => {
  // Cache le modal principal et affiche le modal 2
  modale1.style.display = 'none'  
  modale2.style.display = 'flex'  

  // Ajoute les écouteurs d'événements pour fermer le modal 2
  modal.addEventListener('click', closeModal)  
  modal.querySelector('.blockModal2.js-modal-stop > .fa-xmark').addEventListener('click', closeModal)  
  modal.querySelector('.blockModal2.js-modal-stop').addEventListener('click', stopPropagation)  
})  

// Fonction pour basculer vers le modal 1 et activer la fermeture du modal 1
leftArrow.addEventListener('click', () => {
  // Cache le modal 2 et affiche le modal 1
  modale2.style.display = 'none'  
  modale1.style.display = 'flex'  
})  

// Fonction pour empêcher la propagation d'événements
const stopPropagation = (event) => {
  event.stopPropagation()  
}  
