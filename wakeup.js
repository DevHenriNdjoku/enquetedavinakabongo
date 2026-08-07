    fetch('https://davinakabongo.onrender.com/coucou/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
    console.log('Réponse du serveur :', data);
    })
    .catch(error => {
        console.error('Erreur lors de la soumission du questionnaire:', error);
    }); 
