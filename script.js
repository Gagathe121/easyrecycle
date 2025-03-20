document.querySelector("form").addEventListener("submit", function(event) { // Ajout d'un écouteur d'événement sur le formulaire
  event.preventDefault(); /* Empêche l'envoi réel du formulaire  
                             pour qu'on puisse traiter les données avec JavaScript
                             en restant sur la même page */

  const dechet = document.querySelector("#dechet").value.toLowerCase().split(" "); /* Récupère le nom du déchet 
                                                                                      mets en minuscule et divise en tableau de mot
                                                                                      pour éviter la correspondance exacte
                                                                                      entre la saisie utilisateur et la data */

  fetch('data/dechets.json')  // Récupère le fichier JSON
    .then(response => response.json()) 
    .then(data => { 
      
            
   const resultat = data.find(item => { // Recherche dans le JSON le déchet qui contient tous les mots saisis par l'utilisateur        
        return dechet.every(mot => item.objet.toLowerCase().includes(mot)); /* Pour chaque déchet 
                                                                               vérifie si chaque mot saisi par l'utilisateur est présent dans l'objet*/
      });
      
     
   const resultElement = document.querySelector("#resultat");  // Affiche les résultats dans le paragraphe avec l'id "resultat"
      
      if (resultat) { // Si le déchet est trouvé, on affiche les informations
        const poubelleValue = resultat.poubelle.replace(/^Poubelle\s+/i, ''); // Enlève l'intitulé "Poubelle" pour afficher uniquement la valeur
        
        resultElement.innerHTML = `                                             
          <strong>Déchet trouvé :</strong><br> 
          <strong>Objet :</strong> ${resultat.objet} <br> 
          <strong>Catégorie :</strong> ${resultat.categorie} <br>
          <strong>Poubelle :</strong> ${poubelleValue} <br>  
        `;                            // Affiche seulement la valeur de l'objet trouvé pour éviter la répétition du mot poubelle
        
      } else {
        resultElement.innerHTML = "Désolé, nous n'avons pas trouvé ce déchet."; // Si le déchet n'est pas trouvé, on affiche un message d'erreur
      }
    })
    .catch(error => {  // En cas d'erreur affiche un message d'erreur      
      document.querySelector("#resultat").innerHTML = "Une erreur est survenue, veuillez réessayer plus tard."; 
    });
});