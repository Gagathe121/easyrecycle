document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche l'envoi réel du formulaire

  // Récupère la saisie de l'utilisateur, la met en minuscule, enlève accents et caractères spéciaux
  const dechet = document.querySelector("#dechet").value.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // Enlève les accents
    .replace(/[^a-z0-9 ]/g, "")  // Enlève les caractères spéciaux
    .split(" ") // Divise la saisie par mots
    .map(mot => mot.trim()); // Élimine les espaces superflus

  console.log("Saisie de l'utilisateur après nettoyage et séparation :", dechet); // Débogage

  fetch('data/dechets.json') // Récupère le fichier JSON
    .then(response => response.json())
    .then(data => {
      // Recherche dans chaque élément du JSON si tous les mots saisis par l'utilisateur sont présents
      const resultat = data.find(item => {
        // Nettoyage de l'objet du fichier JSON
        const itemName = item.objet.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
          .replace(/[^a-z0-9 ]/g, ""); // Enlève les caractères spéciaux

        console.log("Nom de l'objet dans le JSON après nettoyage :", itemName); // Débogage

        // On compare chaque mot de la saisie utilisateur avec le nom de l'objet
        return dechet.every(mot => itemName.includes(mot)); // Vérifie si chaque mot de la saisie existe dans le nom de l'objet
      });

      const resultElement = document.querySelector("#resultat");

      if (resultat) {
        const poubelleValue = resultat.poubelle.replace(/^Poubelle\s+/i, ''); // Nettoie le texte de la poubelle
        resultElement.innerHTML = `
          <strong>Déchet trouvé :</strong><br>
          <strong>Objet :</strong> ${resultat.objet} <br>
          <strong>Catégorie :</strong> ${resultat.categorie} <br>
          <strong>Poubelle :</strong> ${poubelleValue} <br>
        `;
      } else {
        resultElement.innerHTML = "Désolé, nous n'avons pas trouvé ce déchet.<br> Veuillez indiquer la nature du déchet uniquement <br> (ex: 'pot','bouteille' ou'épluchures').";
      }
    })
    .catch(error => {
      console.error("Erreur de récupération du fichier JSON : ", error); // Affiche l'erreur si le fichier JSON n'est pas trouvé
      document.querySelector("#resultat").innerHTML = "Une erreur est survenue, veuillez réessayer plus tard.";
    });
});