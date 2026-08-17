// Configuration des questions de l'enquête

const surveyQuestions = [
    {
        id: 1,
        type: 'select-text',
        key: 'residence',
        question: "Quel est votre lieu de résidence (commune/quartier) ?",
        required: true,
        communes: [
            "Sélectionnez votre commune",
            "Kinshasa",
            "Barumbu",
            "Bumbu",
            "Gombe",
            "Kalamu",
            "Kasa-Vubu",
            "Kimbanseke",
            "Kinsenso",
            "Kintambo",
            "Lemba",
            "Limete",
            "Lingwala",
            "Makala",
            "Maluku",
            "Masina",
            "Matete",
            "Mont Ngafula",
            "Ndjili",
            "Ngaba",
            "Ngaliema",
            "Nsele",
            "Selembao",
            "Autre"
        ]
    },
    {
        id: 2,
        type: 'radio',
        key: 'status',
        question: "Quel est votre statut ?",
        required: true,
        options: [
            "Étudiant",
            "Enseignant",
            "Personnel administratif",
            "Autre"
        ]
    },{
        id: 3,
        type: 'radio',
        key: 'niveauEtude',
        question: ". Quel est votre niveau d’étude ? ",
        required: true,
        options: [
            "Préparatoire",
            "L1",
            "L2",
            "L3",
            "M1",
            "M2",
            "Non applicable",
        ]
    },{
        id: 4,
        type: 'radio',
        key: 'fequenceDeplacement',
        question: ". Quel est votre frequence de deplacement vers l'INBTP ? ",
        required: true,
        options: [
            "Tout les jours",
            "Plusieurs fois par semaine",
            "quelque fois par mois",
            "Rarement"
        ]
    },
    
    {
        id: 5,
        type: 'radio',
        question: " À quel moment effectuez-vous généralement vos déplacements liés à l’INBTP ? Pour l’arrivée ?",
        key: 'moment_arrivee',
        required: true,
        options: [
            "Avant 7h00",
            "Entre 7h00 et 7h30",
            "Entre 7h30 et 8h00",
            "Entre 8h00 et 8h30",
            "Après 8h30",
            "Autre"
        ]
    },
    {
        id: 6,
        type: 'radio',
        question: " À quel moment effectuez-vous généralement vos déplacements liés à l’INBTP ? Pour le depart ?",
        key: 'moment_depart',
        required: true,
        options: [
            "Avant 12h00",
            "Entre 12h00 et 14h00",
            "Entre 14h00 et 16h00",
            "Entre 16h00 et 18h00",
            "Après 18h00",
            "Autre"
        ]
    },
    {
        id: 7,
        type: 'radio',
        key: 'mode_transport_actuel',
        question: "Quel moyen de transport utilisez-vous principalement pour vous rendre à l'INBTP ?",
        required: true,
        options: [
            "Marche à pied",
            "Moto personnelle",
            "Moto taxi",
            "Bus",
            "Taxi",
            "Véhicule personnel",
            "Vélo",
            "Autre"
        ]
    },
    {
        id: 8,
        type: 'radio',
        key: 'combinaison_transport',
        question: "Utilisez-vous une combinaison de plusieurs moyens de transport pour effectuer votre trajet ?",
        required: true,
        options: [
            "Oui",
            "Non"
        ]
    },
    
    {
        id: 9,
        type: 'radio',
        key: 'combinaison_utilisee',
        question: "Quelle combinaison utilisez-vous ?",
        required: true,
        options: [
            "Maison → Marche → Bus",
            "Maison → Marche → Moto",
            "Maison → Moto → Bus",
            "Maison → Marche → Bus → Moto",
            "Maison → Bus",
            "Maison → Moto",
            "Maison → Marche",
            "Autre"
        ],
        condition: function(answers) {
            return answers["combinaison_transport"] === "Oui";
        }
    },

    {
        id: 10,
        type: 'radio',
        key: 'temps_deplacement',
        question: "Combien de temps mettez-vous en moyenne pour arriver à l'INBTP ?",
        required: true,
        options: [
            "Moins de 15 minutes",
            "15 à 30 minutes",
            "30 à 45 minutes",
            "45 minutes à 1 heure",
            "Plus d'1 heure",
            "Autre"
        ]
    },
    
    {
        id: 11,
        type: 'radio',
        key: 'lieu_de_descente',
        question: ". À quel endroit descendez-vous généralement de votre moyen de transport pour poursuivre votre trajet vers l’INBTP  ?",
        required: true,
        options: [
            "À proximité immédiate de l’INBTP ",
            " À quelques mètres de l’INBTP ",
            " À une distance nécessitant de marcher plusieurs minutes ",
            " À une distance nécessitant de prendre une moto ",
        
        ]
    },{
        id: 12,
        type: 'radio',
        key: 'temps_deplacement_descente_inbtp',
        question: "Depuis votre point de descente, combien de temps faut-il généralement pour rejoindre l’INBTP à pied ?",
        required: true,
        options: [
            "Moins de 5min ",
            "5min à 10min ",
            "10min à 15min ",
            "Plus de 15min ",
            
        ]
    },
    {
        id: 13,
        type: 'radio',
        key: 'satisfaction_organisation_deplacement_inbtp',
        question: "Comment évaluez-vous l’organisation actuelle des déplacements autour de l’INBTP ?",
        required: true,
        options: [
            "Très satisfaisante ",
            "Satisfaisante",
            " Peu satisfaisante",
            "Mauvaise"
        ]
    },
    {
        id: 14,
        type: 'checkbox',
        key: 'difficulte_proximite_inbtp',
        question: "Quelles difficultés rencontrez-vous principalement lors de vos déplacements à proximité de l’INBTP ?(Vous pouvez sélectionner plusieurs réponses ) ",
        required: true,
        options: [
            "Difficultés de circulation",
            " Difficultés liées à la dépose et à la prise en charge des passagers ",
            "Stationnement ou arrêt désordonné des véhicules et motos ",
            "Distance importante entre le point de descente et l’INBTP ",
            " Difficultés de circulation des piétons ",
            " Manque d’espaces aménagés pour attendre ",
            "Difficultés pour traverser la route ",
            " Conflits entre les différents usagers ",
            "Risque d’accident ",
            "Insuffisance de signalisation ",
        ]
    },{
        id: 15,
        type: 'radio',
        key: 'confli_entre_usage',
        question: "Observez-vous fréquemment des conflits entre les différents usagers (bus, motos, voitures et piétons) ?  ",
        required: true,
        options: [
            "Très frequemment",
            " Frequemment ",
            "Parfois ",
            "Rarement ",
            " Jamais "
        ]
    },
    {
        id: 16,
        type: 'radio',
        key: 'situation_dangereuse',
        question: " Avez-vous déjà rencontré une situation dangereuse lors de vos déplacements autour de l’INBTP ?",
        required: true,
        options: [
            "Oui",
            " Non "
        ]
    },
    {
        id: 17,
        type: 'text',
        key: 'situation_dangereuse_details',
        question: "Si oui, précisez :",
        required: true,
        condition: function(answers) {
            return answers["situation_dangereuse"] === "Oui";
        }
    },
    {
        id: 18,
        type: 'radio',
        question: ". Les piétons disposent-ils actuellement d’un espace suffisamment sécurisé pour circuler à proximité de l’INBTP ? ",
        key: 'disponibilit_amenagement_pieto_autour_inbtp',
        required: true,
        options: [
            "Oui",
            "Partiellement",
            "Non"
        ]
    },
    {
        id: 19,
        type: 'radio',
        question: "Selon vous, l’absence d’espaces aménagés pour la dépose, la prise en charge et l’attente des usagers contribue-t-elle aux difficultés de circulation autour de l’INBTP ? ",
        key: 'absence_espace_amenage_et_difficulte_de_circulation',
        required: true,
        options: [
            "Oui, Beaucoup",
            "Legerement",
            "Non",
        ]
    },
    {
        id: 20,
        type: 'radio',
        question: " Pensez-vous qu’un espace organisé permettant de gérer les bus, motos-taxis et piétons serait nécessaire autour de l’INBTP? ",
        key: 'amenagement_pietons_mot_bus',
        required: true,
        options: [
            "Oui",
            "Non",
        ]
    },
    
    {
        id: 21,
        type: 'checkbox',
        question: "Quels aménagements vous semblent prioritaires pour le futur pôle d’échange multimodal ? ?(Vous pouvez sélectionner plusieurs réponses )  ",
        key: 'amenagement_prioritaire',
        required: true,
        options: [
            "Espaces organisés pour la dépose et la prise en charge des passagers ",
            " Arrêts aménagés pour les transports collectifs",
            "Espace organisé pour les motos-taxis ",
            " Trottoirs sécurisés ",
            "Passage piéton",
            "Zone d’attente pour les voyageurs ",
            "Éclairage public ",
            "Signalisation routière ",
            "Abribus",
            "Dispositifs de drainage "
        ]
    },
    {
        id: 22,
        type: 'checkbox',
        question: " Quelle serait, selon vous, la priorité absolue du futur aménagement ? ?(Vous pouvez sélectionner plusieurs réponses ) ",
        key: 'amenagements_souhaites',
        required: true,
        options: [
            "Faciliter l’accès à l’INBTP",
            "Fluidifier la circulation",
            "Trottoirs aménagés",
            " Améliorer la sécurité des piétons",
            "Organiser la dépose et la prise en charge des passagers ",
            "Réduire les conflits entre les différents usagers ",
            " Améliorer le confort des voyageurs ",
        ]
    },
];

// État de l'application
let appState = {
    currentStep: 1,
    totalSteps: surveyQuestions.length,
    answers: {},
    surveyStarted: false,
    validationErrors: {}
};

// Fonction pour filtrer les questions visibles
function getVisibleQuestions() {
    return surveyQuestions.filter(q => {
        if (q.condition) {
            return q.condition(appState.answers);
        }
        return true;
    });
}

// Fonction pour obtenir l'index de la question actuelle
function getCurrentQuestionIndex() {
    const visibleQuestions = getVisibleQuestions();
    return visibleQuestions.findIndex(q => q.id === appState.currentStep);
}

// Fonction pour obtenir la question actuelle
function getCurrentQuestion() {
    const visibleQuestions = getVisibleQuestions();
    const currentIndex = getCurrentQuestionIndex();
    return visibleQuestions[currentIndex];
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    initEventListeners();
});

// Gestion de l'écran de démarrage
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const splashText = document.getElementById('splash-text');
    const app = document.getElementById('app');
    
    // Animation de la grille et des dessins
    setTimeout(() => {
        splashText.classList.add('visible');
    }, 2500);
    
    // Transition vers l'application
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        app.classList.remove('hidden');
        app.classList.add('visible');
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 800);
    }, 4000);
}

// Initialisation des écouteurs d'événements
function initEventListeners() {
    document.getElementById('start-survey').addEventListener('click', startSurvey);
    document.getElementById('prev-btn').addEventListener('click', previousStep);
    document.getElementById('next-btn').addEventListener('click', nextStep);
    document.getElementById('submit-btn').addEventListener('click', submitSurvey);
    document.getElementById('new-response-btn').addEventListener('click', resetSurvey);
}

// Démarrage de l'enquête
function startSurvey() {
    appState.surveyStarted = true;
    appState.currentStep = 1;
    appState.answers = {};
    appState.validationErrors = {};
    
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('survey-page').classList.remove('hidden');
    
    renderQuestion();
}

// Validation d'une question
function validateQuestion(question) {
    clearFieldError(question.id);
    
    if (!question.required) {
        return true;
    }
    
    switch(question.type) {
        case 'radio':
            const selectedRadio = document.querySelector(`input[name="question-${question.id}"]:checked`);
            if (!selectedRadio) {
                showFieldError(question.id, 'Veuillez sélectionner une option');
                return false;
            }
            if (selectedRadio.value === 'Autre') {
                const otherInput = document.getElementById(`other-input-${question.id}`);
                if (otherInput && !otherInput.value.trim()) {
                    showFieldError(question.id, 'Veuillez préciser votre réponse');
                    return false;
                }
            }
            return true;
            
        case 'checkbox':
            const checkedBoxes = document.querySelectorAll(`input[name="question-${question.id}"]:checked`);
            if (checkedBoxes.length === 0) {
                showFieldError(question.id, 'Veuillez sélectionner au moins une option');
                return false;
            }
            const values = Array.from(checkedBoxes).map(cb => cb.value);
            if (values.includes('Autre')) {
                const otherInput = document.getElementById(`other-input-${question.id}`);
                if (otherInput && !otherInput.value.trim()) {
                    showFieldError(question.id, 'Veuillez préciser votre réponse');
                    return false;
                }
            }
            return true;
            
        case 'select-text':
            const communeSelect = document.getElementById('commune-select');
            const quartierInput = document.getElementById('quartier-input');
            let isValid = true;
            
            if (!communeSelect || communeSelect.value === 'Sélectionnez votre commune') {
                showFieldError(question.id, 'Veuillez sélectionner votre commune');
                isValid = false;
            }
            if (!quartierInput || !quartierInput.value.trim()) {
                showFieldError(question.id, 'Veuillez indiquer votre quartier');
                isValid = false;
            }
            return isValid;
            
        case 'text':
            const textInput = document.getElementById(`text-input-${question.id}`);
            if (!textInput || !textInput.value.trim()) {
                showFieldError(question.id, 'Veuillez préciser votre réponse');
                return false;
            }
            return true;
            
        case 'textarea':
            const textarea = document.getElementById(`textarea-${question.id}`);
            if (question.required && (!textarea || !textarea.value.trim())) {
                showFieldError(question.id, 'Veuillez remplir ce champ');
                return false;
            }
            return true;
    }
    
    return true;
}

// Affichage des erreurs de validation
function showFieldError(questionId, message) {
    // Supprimer l'ancien message d'erreur
    clearFieldError(questionId);
    
    const container = document.getElementById('questions-container');
    const errorDiv = document.createElement('div');
    errorDiv.id = `error-${questionId}`;
    errorDiv.className = 'validation-error';
    errorDiv.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#e74c3c" stroke-width="1.5"/>
            <path d="M8 5V9" stroke="#e74c3c" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="8" cy="11.5" r="0.75" fill="#e74c3c"/>
        </svg>
        <span>${message}</span>
    `;
    
    // Ajouter l'erreur après la question
    const questionCard = container.querySelector('.question-card');
    if (questionCard) {
        questionCard.appendChild(errorDiv);
        
        // Ajouter une bordure rouge aux champs concernés
        const inputs = questionCard.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#e74c3c';
        });
    }
    
    // Animation d'apparition
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Scroll vers l'erreur
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Suppression des erreurs de validation
function clearFieldError(questionId) {
    const existingError = document.getElementById(`error-${questionId}`);
    if (existingError) {
        existingError.remove();
    }
    
    // Réinitialiser les bordures
    const container = document.getElementById('questions-container');
    const questionCard = container.querySelector('.question-card');
    if (questionCard) {
        const inputs = questionCard.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }
}

// Rendu de la question actuelle
function renderQuestion() {
    const question = getCurrentQuestion();
    if (!question) return;
    
    const container = document.getElementById('questions-container');
    const visibleQuestions = getVisibleQuestions();
    const currentIndex = getCurrentQuestionIndex();
    
    // Mise à jour de la barre de progression
    appState.totalSteps = visibleQuestions.length;
    const progress = ((currentIndex + 1) / visibleQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('current-step').textContent = currentIndex + 1;
    document.getElementById('total-steps').textContent = visibleQuestions.length;
    
    // Génération du HTML de la question
    let questionHTML = `<div class="question-card">`;
    
    // Badge "Obligatoire" pour les questions requises
    if (question.required) {
        questionHTML += `<span class="required-badge">* Obligatoire</span>`;
    } else {
        questionHTML += `<span class="optional-badge">Optionnel</span>`;
    }
    
    questionHTML += `<h3 class="question-title">${question.question}</h3>`;
    
    switch(question.type) {
        case 'radio':
            questionHTML += renderRadioOptions(question);
            break;
        case 'checkbox':
            questionHTML += renderCheckboxOptions(question);
            break;
        case 'select-text':
            questionHTML += renderSelectText(question);
            break;
        case 'text':
            questionHTML += renderTextInput(question);
            break;
        case 'textarea':
            questionHTML += renderTextarea(question);
            break;
    }
    
    questionHTML += `</div>`;
    container.innerHTML = questionHTML;
    
    // Ajout des écouteurs d'événements pour les options
    addQuestionEventListeners(question);
    
    // Restauration des réponses précédentes
    restoreAnswers(question);
    
    // Mise à jour des boutons de navigation
    updateNavigationButtons(currentIndex, visibleQuestions.length);
}

// Rendu des options radio
function renderRadioOptions(question) {
    let html = '<ul class="options-list">';
    question.options.forEach((option, index) => {
        html += `
            <li class="option-item">
                <input type="radio" 
                       id="option-${index}" 
                       name="question-${question.id}" 
                       value="${option}">
                <label for="option-${index}">${option}</label>
            </li>
        `;
    });
    html += '</ul>';
    
    // Conteneur pour le champ "Autre"
    html += `<div id="other-container-${question.id}" class="other-container" style="display: none;">
        <input type="text" 
               id="other-input-${question.id}" 
               class="other-input" 
               placeholder="Veuillez préciser...">
    </div>`;
    
    return html;
}

// Rendu des options checkbox
function renderCheckboxOptions(question) {
    let html = '<ul class="options-list">';
    question.options.forEach((option, index) => {
        html += `
            <li class="option-item">
                <input type="checkbox" 
                       id="option-${index}" 
                       name="question-${question.id}" 
                       value="${option}">
                <label for="option-${index}">${option}</label>
            </li>
        `;
    });
    html += '</ul>';
    
    html += `<div id="other-container-${question.id}" class="other-container" style="display: none;">
        <input type="text" 
               id="other-input-${question.id}" 
               class="other-input" 
               placeholder="Veuillez préciser...">
    </div>`;
    
    return html;
}

// Rendu du select + texte
function renderSelectText(question) {
    let html = '<div style="margin-bottom: 1rem;">';
    html += `<select id="commune-select" class="select-input">`;
    question.communes.forEach(commune => {
        html += `<option value="${commune}">${commune}</option>`;
    });
    html += '</select>';
    html += '</div>';
    
    html += '<div>';
    html += `<input type="text" 
                   id="quartier-input" 
                   class="text-input" 
                   placeholder="Votre quartier...">`;
    html += '</div>';
    
    return html;
}

// Rendu du champ texte
function renderTextInput(question) {
    return `<input type="text" 
                   id="text-input-${question.id}" 
                   class="text-input" 
                   placeholder="Votre réponse...">`;
}

// Rendu du textarea
function renderTextarea(question) {
    return `<textarea id="textarea-${question.id}" 
                     class="text-input" 
                     rows="4" 
                     placeholder="Votre réponse..."></textarea>`;
}

// Ajout des écouteurs d'événements pour les questions
function addQuestionEventListeners(question) {
    if (question.type === 'radio') {
        const radioInputs = document.querySelectorAll(`input[name="question-${question.id}"]`);
        radioInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                handleRadioChange(question, e.target.value);
                // Effacer l'erreur quand l'utilisateur fait un choix
                clearFieldError(question.id);
            });
        });
        
        // Écouteur pour le champ "Autre"
        const otherInput = document.getElementById(`other-input-${question.id}`);
        if (otherInput) {
            otherInput.addEventListener('input', () => {
                clearFieldError(question.id);
            });
        }
    } else if (question.type === 'checkbox') {
        const checkboxInputs = document.querySelectorAll(`input[name="question-${question.id}"]`);
        const otherContainer = document.getElementById(`other-container-${question.id}`);
        
        checkboxInputs.forEach(input => {
            input.addEventListener('change', () => {
                clearFieldError(question.id);
                const checkedBoxes = document.querySelectorAll(`input[name="question-${question.id}"]:checked`);
                const values = Array.from(checkedBoxes).map(cb => cb.value);
                
                if (values.includes('Autre')) {
                    if (otherContainer) {
                        otherContainer.style.display = 'block';
                    }
                } else {
                    if (otherContainer) {
                        otherContainer.style.display = 'none';
                    }
                }
            });
        });
        
        // Écouteur pour le champ "Autre"
        const otherInput = document.getElementById(`other-input-${question.id}`);
        if (otherInput) {
            otherInput.addEventListener('input', () => {
                clearFieldError(question.id);
            });
        }
    } else if (question.type === 'select-text') {
        const communeSelect = document.getElementById('commune-select');
        const quartierInput = document.getElementById('quartier-input');
        
        if (communeSelect) {
            communeSelect.addEventListener('change', () => {
                clearFieldError(question.id);
            });
        }
        if (quartierInput) {
            quartierInput.addEventListener('input', () => {
                clearFieldError(question.id);
            });
        }
    } else if (question.type === 'text') {
        const textInput = document.getElementById(`text-input-${question.id}`);
        if (textInput) {
            textInput.addEventListener('input', () => {
                clearFieldError(question.id);
            });
        }
    } else if (question.type === 'textarea') {
        const textarea = document.getElementById(`textarea-${question.id}`);
        if (textarea) {
            textarea.addEventListener('input', () => {
                clearFieldError(question.id);
            });
        }
    }
}

// Gestion du changement des options radio
function handleRadioChange(question, value) {
    const otherContainer = document.getElementById(`other-container-${question.id}`);
    
    if (value === 'Autre') {
        if (otherContainer) {
            otherContainer.style.display = 'block';
            // Focus sur le champ texte
            setTimeout(() => {
                const otherInput = document.getElementById(`other-input-${question.id}`);
                if (otherInput) {
                    otherInput.focus();
                }
            }, 100);
        }
    } else {
        if (otherContainer) {
            otherContainer.style.display = 'none';
        }
    }
    
    // Gestion spéciale pour la question 7 (combinaison de transport)
    if (question.id === 7 && value === 'Non') {
        appState.answers[8] = null;
    }
}

// Sauvegarde des réponses
function saveAnswers(question) {
    switch(question.type) {
        case 'radio':
            const selectedRadio = document.querySelector(`input[name="question-${question.id}"]:checked`);
            if (selectedRadio) {
                appState.answers[question.key] = selectedRadio.value;
                
                if (selectedRadio.value === 'Autre') {
                    const otherInput = document.getElementById(`other-input-${question.id}`);
                    if (otherInput) {
                        appState.answers[`${question.key}_other`] = otherInput.value;
                    }
                }
            }
            break;
            
        case 'checkbox':
            const checkedBoxes = document.querySelectorAll(`input[name="question-${question.id}"]:checked`);
            const values = Array.from(checkedBoxes).map(cb => cb.value);
            appState.answers[question.key] = values;
            
            if (values.includes('Autre')) {
                const otherInput = document.getElementById(`other-input-${question.id}`);
                if (otherInput) {
                    appState.answers[`${question.key}_other`] = otherInput.value;
                }
            }
            break;
            
        case 'select-text':
            const communeSelect = document.getElementById('commune-select');
            const quartierInput = document.getElementById('quartier-input');
            if (communeSelect && quartierInput) {
                appState.answers[question.key] = {
                    commune: communeSelect.value,
                    quartier: quartierInput.value
                };
            }
            break;
            
        case 'text':
            const textInput = document.getElementById(`text-input-${question.id}`);
            if (textInput) {
                appState.answers[question.key] = textInput.value;
            }
            break;
            
        case 'textarea':
            const textarea = document.getElementById(`textarea-${question.id}`);
            if (textarea) {
                appState.answers[question.key] = textarea.value;
            }
            break;
    }
}

// Restauration des réponses précédentes
function restoreAnswers(question) {
    const savedAnswer = appState.answers[question.id];
    if (!savedAnswer) return;
    
    switch(question.type) {
        case 'radio':
            const radioInput = document.querySelector(`input[name="question-${question.id}"][value="${savedAnswer}"]`);
            if (radioInput) {
                radioInput.checked = true;
                handleRadioChange(question, savedAnswer);
            }
            break;
            
        case 'checkbox':
            if (Array.isArray(savedAnswer)) {
                savedAnswer.forEach(value => {
                    const checkbox = document.querySelector(`input[name="question-${question.id}"][value="${value}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
                
                // Afficher le champ "Autre" si nécessaire
                if (savedAnswer.includes('Autre')) {
                    const otherContainer = document.getElementById(`other-container-${question.id}`);
                    if (otherContainer) {
                        otherContainer.style.display = 'block';
                    }
                }
            }
            break;
            
        case 'select-text':
            if (typeof savedAnswer === 'object') {
                const communeSelect = document.getElementById('commune-select');
                const quartierInput = document.getElementById('quartier-input');
                if (communeSelect && savedAnswer.commune) {
                    communeSelect.value = savedAnswer.commune;
                }
                if (quartierInput && savedAnswer.quartier) {
                    quartierInput.value = savedAnswer.quartier;
                }
            }
            break;
            
        case 'text':
            const textInput = document.getElementById(`text-input-${question.id}`);
            if (textInput && savedAnswer) {
                textInput.value = savedAnswer;
            }
            break;
            
        case 'textarea':
            const textarea = document.getElementById(`textarea-${question.id}`);
            if (textarea && savedAnswer) {
                textarea.value = savedAnswer;
            }
            break;
    }
    
    // Restauration des champs "Autre"
    if (question.type === 'radio' && savedAnswer === 'Autre') {
        const otherInput = document.getElementById(`other-input-${question.id}`);
        const otherValue = appState.answers[`${question.id}_other`];
        if (otherInput && otherValue) {
            otherInput.value = otherValue;
        }
    }
}

// Navigation
function previousStep() {
    const visibleQuestions = getVisibleQuestions();
    const currentIndex = getCurrentQuestionIndex();
    
    if (currentIndex > 0) {
        // Sauvegarder la réponse actuelle (même si invalide, on la garde)
        saveAnswers(getCurrentQuestion());
        clearFieldError(appState.currentStep);
        
        appState.currentStep = visibleQuestions[currentIndex - 1].id;
        renderQuestion();
    }
}

// function nextStep() {
//     const question = getCurrentQuestion();
//     const visibleQuestions = getVisibleQuestions();
//     const currentIndex = getCurrentQuestionIndex();
    
//     // Valider avant de passer à l'étape suivante
//     if (!validateQuestion(question)) {
//         return; // La validation a échoué, on reste sur la question
//     }
    
//     // Sauvegarder la réponse
//     saveAnswers(question);
//     clearFieldError(question.id);
    
//     if (currentIndex < visibleQuestions.length - 1) {
//         appState.currentStep = visibleQuestions[currentIndex + 1].id;
//         renderQuestion();
        
//         // Scroll en haut du container
//         document.getElementById('questions-container').scrollIntoView({ 
//             behavior: 'smooth', 
//             block: 'start' 
//         });
//     }
// }

function nextStep() {
    const question = getCurrentQuestion();

    // Valider avant de passer à l'étape suivante
    if (!validateQuestion(question)) {
        return;
    }

    // Sauvegarder d'abord la réponse
    saveAnswers(question);

    // Maintenant recalculer les questions visibles
    const visibleQuestions = getVisibleQuestions();
    const currentIndex = getCurrentQuestionIndex();

    clearFieldError(question.id);

    if (currentIndex < visibleQuestions.length - 1) {
        appState.currentStep = visibleQuestions[currentIndex + 1].id;

        renderQuestion();

        document.getElementById('questions-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
function updateNavigationButtons(currentIndex, totalVisible) {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    prevBtn.style.display = currentIndex > 0 ? 'inline-flex' : 'none';
    
    if (currentIndex === totalVisible - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

// Soumission du questionnaire
function submitSurvey() {
    const question = getCurrentQuestion();
    
    // Valider la dernière question
    if (!validateQuestion(question)) {
        return;
    }
    
    // Sauvegarder la dernière réponse
    saveAnswers(question);
    
    // Vérification finale que toutes les questions visibles sont répondues
    const visibleQuestions = getVisibleQuestions();
    let hasErrors = false;
    
    visibleQuestions.forEach(q => {
        if (q.required && !appState.answers[q.id]) {
            hasErrors = true;
        }
    });
    

        fetch('https://davinakabongo.onrender.com/enquete-mobilite/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appState.answers)
    })
    .then(response => response.json())
    .then(data => {
    console.log('Questionnaire soumis avec succès:', data);
    // Affichage de la page de remerciement
    document.getElementById('survey-page').classList.add('hidden');
    document.getElementById('thank-you-page').classList.remove('hidden');
    
    // Animation de succès
    

    const thankYouPage = document.getElementById('thank-you-page');
    thankYouPage.style.opacity = '0';
    thankYouPage.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        thankYouPage.style.transition = 'all 0.5s ease';
        thankYouPage.style.opacity = '1';
        thankYouPage.style.transform = 'translateY(0)';
    }, 100);
    
    // Log des réponses (à remplacer par un appel API plus tard)


    })
    .catch(error => {
        console.error('Erreur lors de la soumission du questionnaire:', error);
        // alert('Certaines questions obligatoires n\'ont pas été répondues. Veuillez vérifier vos réponses.');
    })
    .finally(()=>{
         document.getElementById('survey-page').classList.add('hidden');
    document.getElementById('thank-you-page').classList.remove('hidden');
    
    // Animation de succès
    

    const thankYouPage = document.getElementById('thank-you-page');
    thankYouPage.style.opacity = '0';
    thankYouPage.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        thankYouPage.style.transition = 'all 0.5s ease';
        thankYouPage.style.opacity = '1';
        thankYouPage.style.transform = 'translateY(0)';
    }, 100);
    
   

    });










    if (hasErrors) {
        // alert('Certaines questions obligatoires n\'ont pas été répondues. Veuillez vérifier vos réponses.');
        // return;
    }
    


    
    console.log('Réponses de l\'enquête:', appState.answers);
}

// Réinitialisation de l'enquête
function resetSurvey() {
    appState.currentStep = 1;
    appState.answers = {};
    appState.validationErrors = {};
    appState.surveyStarted = false;
    
    document.getElementById('thank-you-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
    
    // Scroll en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

