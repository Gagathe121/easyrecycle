document.addEventListener("DOMContentLoaded", function() { // Attend que le DOM soit chargé avant execution du code 

// === Gestion du bouton "À propos" ===
document.getElementById("toggle-apropos").addEventListener("click", function() {
  const apropos = document.getElementById("apropos-content");
    if (apropos.style.display === "" || apropos.style.display === "none") { // Vérifie l'état actuel et bascule entre "none" et "block"
    apropos.style.display = "block";
    apropos.scrollIntoView({ behavior: "smooth" }); // Défilement vers le bas de la page pour afficher le texte
  } else {
    apropos.style.display = "none"; // Masque le texte par défaut
  } 
});

  // === Gestion de la soumission du formulaire ===
  document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche l'envoi réel du formulaire
    const champDechet = document.querySelector("#dechet");
    const saisieUtilisateur = champDechet.value;
    const dechetMots = saisieUtilisateur // Nettoyage et découpage des mots
      .split(" ")
      .map(mot => nettoyerTexte(mot.trim()));

    console.log("Saisie utilisateur après nettoyage :", dechetMots); // Debug

    fetch('data/dechets.json')
      .then(response => response.json())
      .then(data => {
        const resultat = data.find(item => {
        const itemNettoye = nettoyerTexte(item.objet);
        console.log("Objet JSON nettoyé :", itemNettoye); // Debug
        return dechetMots.every(mot => itemNettoye.includes(mot));
        });

        const resultElement = document.querySelector("#resultat");
        if (resultat) {
        const poubelleClean = resultat.poubelle.replace(/^Poubelle\s+/i, '');
        resultElement.innerHTML = `
            <strong>Déchet trouvé :</strong>
            ${resultat.objet} <br>
            <strong>Poubelle :</strong> ${poubelleClean} <br> 
           <p class="petite-phrase">Si ce déchet n'est pas le vôtre, veuillez préciser objet, matière <em>(ex: 'pot de yaourt en verre')</em></p>
`;
        } else {
          resultElement.innerHTML = `
            Désolé, nous n'avons pas trouvé ce déchet.<br><em>Veuillez indiquer la nature du déchet uniquement <br>
            (ex: "pot", "bouteille" ou "épluchures").</em>                       `;
        }

        champDechet.value = ""; // Vide le champ de saisie après traitement
      })
      .catch(error => {
        console.error("Erreur de récupération du fichier JSON : ", error);
        document.querySelector("#resultat").innerHTML = "Une erreur est survenue, veuillez réessayer plus tard.";
      });
  });
});

// === Fonction utilitaire pour nettoyer les textes ===
function nettoyerTexte(texte) {
  return texte.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // Enlève les accents
    .replace(/[^a-z0-9 ]/g, "");  // Enlève les caractères spéciaux
}