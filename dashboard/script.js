// Configuration API
const API_BASE_URL = 'https://davinakabongo.onrender.com';
const API_ENDPOINTS = {
    dashboard: `${API_BASE_URL}/dashboard/`,
    stats: `${API_BASE_URL}/dashboard/stats/`
};

// État global
let dashboardData = null;
let statsData = null;
let currentSection = 'overview';
let filters = {
    period: 'all',
    transport: 'all',
    status: 'all',
    search: ''
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeFilters();
    loadAllData();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav li');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show/hide sections
            document.querySelectorAll('.dashboard-section').forEach(sec => {
                sec.style.display = 'none';
            });
            
            const targetSection = document.getElementById(section);
            if (targetSection) {
                targetSection.style.display = 'block';
                currentSection = section;
            }
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
}

// Filtres
function initializeFilters() {
    document.getElementById('filterPeriod').addEventListener('change', (e) => {
        filters.period = e.target.value;
        applyFilters();
    });
    
    document.getElementById('filterTransport').addEventListener('change', (e) => {
        filters.transport = e.target.value;
        applyFilters();
    });
    
    document.getElementById('filterStatus').addEventListener('change', (e) => {
        filters.status = e.target.value;
        applyFilters();
    });
    
    document.getElementById('searchInput').addEventListener('input', debounce((e) => {
        filters.search = e.target.value;
        applyFilters();
    }, 500));
}

// Debounce utilitaire
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Chargement des données
async function loadAllData() {
    showLoading();
    
    try {
        const [dashboardResponse, statsResponse] = await Promise.all([
            fetch(API_ENDPOINTS.dashboard),
            fetch(API_ENDPOINTS.stats)
        ]);
        
        if (!dashboardResponse.ok || !statsResponse.ok) {
            throw new Error('Erreur lors du chargement des données');
        }
        
        dashboardData = await dashboardResponse.json();
        statsData = await statsResponse.json();
        
        // Populate filters
        populateFilterOptions();
        
        // Render data
        renderAllData();
        
        hideLoading();
        showToast('Données chargées avec succès', 'success');
        
    } catch (error) {
        console.error('Erreur:', error);
        hideLoading();
        showToast('Erreur lors du chargement des données', 'error');
    }
}

// Populate filter options
function populateFilterOptions() {
    const transportSelect = document.getElementById('filterTransport');
    const statusSelect = document.getElementById('filterStatus');
    
    // Clear existing options (keep first)
    transportSelect.innerHTML = '<option value="all">Tous les modes</option>';
    statusSelect.innerHTML = '<option value="all">Tous les statuts</option>';
    
    // Add transport options
    if (dashboardData?.modes_transport) {
        dashboardData.modes_transport.forEach(item => {
            const option = document.createElement('option');
            option.value = item.mode_transport_actuel;
            option.textContent = item.mode_transport_actuel;
            transportSelect.appendChild(option);
        });
    }
    
    // Add status options
    if (dashboardData?.repartition_statut) {
        dashboardData.repartition_statut.forEach(item => {
            const option = document.createElement('option');
            option.value = item.status;
            option.textContent = item.status;
            statusSelect.appendChild(option);
        });
    }
}

// Render all data
function renderAllData() {
    renderKPICards();
    renderStatutTable();
    renderTransportTable();
    renderSatisfactionTable();
    renderFrequenceTable();
    renderTempsTable();
    renderArriveeTable();
    renderDepartTable();
    renderDescenteTable();
    renderSatisfactionDetailTable();
    renderCombinaisonTable();
    renderConflitsTable();
    renderDangerTable();
    renderAmenagementTable();
    renderDifficultesTable();
    renderSouhaitsTable();
    renderPMBTable();
    renderEtudeTable();
    renderDescenteTempsTable();
}

// Render KPI Cards
function renderKPICards() {
    const container = document.getElementById('kpiContainer');
    
    if (!statsData?.stats_rapides) {
        container.innerHTML = '<p>Aucune donnée disponible</p>';
        return;
    }
    
    const kpiConfigs = {
        'Total Réponses': { color: 'var(--accent)', icon: 'fa-users', trend: '+' },
        'Situations Dangereuses': { color: 'var(--danger)', icon: 'fa-shield-alt', trend: '-' },
        'Satisfaits': { color: 'var(--success)', icon: 'fa-thumbs-up', trend: '+' },
        'Conflits Fréquents': { color: 'var(--warning)', icon: 'fa-exclamation-triangle', trend: '-' }
    };
    
    container.innerHTML = statsData.stats_rapides.map(kpi => {
        const config = kpiConfigs[kpi.titre] || { color: 'var(--accent)', icon: 'fa-chart-bar', trend: '+' };
        const trendClass = config.trend === '+' ? 'positive' : 'negative';
        
        return `
            <div class="kpi-card" style="--card-color: ${config.color};">
                <div class="kpi-header">
                    <div class="kpi-icon" style="background: ${config.color}20; color: ${config.color};">
                        <i class="fas ${config.icon}"></i>
                    </div>
                    <span class="kpi-trend ${trendClass}">
                        <i class="fas fa-arrow-${config.trend === '+' ? 'up' : 'down'}"></i>
                        ${kpi.pourcentage ? kpi.pourcentage + '%' : ''}
                    </span>
                </div>
                <div class="kpi-value">${kpi.valeur}</div>
                <div class="kpi-label">${kpi.titre}</div>
                ${kpi.pourcentage ? `<div class="kpi-detail">${kpi.pourcentage}% du total</div>` : ''}
            </div>
        `;
    }).join('');
}

// Helper: Create table HTML
function createTable(data, columns, options = {}) {
    const { showProgress = true, progressKey = 'count', maxValue = null } = options;
    
    if (!data || data.length === 0) {
        return '<p class="text-muted">Aucune donnée disponible</p>';
    }
    
    const maxCount = maxValue || Math.max(...data.map(item => item[progressKey] || 0));
    
    const tableHeaders = columns.map(col => `<th>${col.label}</th>`).join('');
    
    const tableRows = data.map((item, index) => {
        const count = item[progressKey] || 0;
        const percentage = maxCount > 0 ? ((count / maxCount) * 100).toFixed(1) : 0;
        
        const cells = columns.map(col => {
            if (col.type === 'progress') {
                return `
                    <td>
                        <span class="count-badge">${count}</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${percentage}%; background: ${col.color || 'var(--accent)'};"></div>
                        </div>
                        <small style="font-size: 12px; color: var(--text-secondary);">${percentage}%</small>
                    </td>
                `;
            } else if (col.type === 'text') {
                return `<td>${col.format ? col.format(item[col.key]) : item[col.key] || 'N/A'}</td>`;
            } else {
                return `<td>${item[col.key] || 'N/A'}</td>`;
            }
        }).join('');
        
        return `<tr>${cells}</tr>`;
    }).join('');
    
    return `
        <table class="data-table">
            <thead>
                <tr>${tableHeaders}</tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
}

// Render functions for each table
function renderStatutTable() {
    const container = document.getElementById('statutTable');
    const data = dashboardData?.repartition_statut || [];
    
    container.innerHTML = createTable(data, [
        { key: 'status', label: 'Statut', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--accent)' }
    ]);
}

function renderTransportTable() {
    const container = document.getElementById('transportTable');
    const data = dashboardData?.modes_transport || [];
    
    container.innerHTML = createTable(data, [
        { key: 'mode_transport_actuel', label: 'Mode de Transport', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--success)' }
    ]);
}

function renderSatisfactionTable() {
    const container = document.getElementById('satisfactionTable');
    const data = dashboardData?.satisfaction || [];
    
    container.innerHTML = createTable(data, [
        { key: 'satisfaction_organisation_deplacement_inbtp', label: 'Niveau de Satisfaction', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--warning)' }
    ]);
}

function renderFrequenceTable() {
    const container = document.getElementById('frequenceTable');
    const data = dashboardData?.frequence_deplacement || [];
    
    container.innerHTML = createTable(data, [
        { key: 'fequenceDeplacement', label: 'Fréquence', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--info)' }
    ]);
}

function renderTempsTable() {
    const container = document.getElementById('tempsTable');
    const data = dashboardData?.temps_deplacement || [];
    
    container.innerHTML = createTable(data, [
        { key: 'temps_deplacement', label: 'Durée', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--accent)' }
    ]);
}

function renderArriveeTable() {
    const container = document.getElementById('arriveeTable');
    const data = dashboardData?.moment_arrivee || [];
    
    container.innerHTML = createTable(data, [
        { key: 'moment_arrivee', label: "Moment d'Arrivée", type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--info)' }
    ]);
}

function renderDepartTable() {
    const container = document.getElementById('departTable');
    const data = dashboardData?.moment_depart || [];
    
    container.innerHTML = createTable(data, [
        { key: 'moment_depart', label: 'Moment de Départ', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--info)' }
    ]);
}

function renderDescenteTable() {
    const container = document.getElementById('descenteTable');
    const data = dashboardData?.lieu_descente || [];
    
    container.innerHTML = createTable(data, [
        { key: 'lieu_de_descente', label: 'Lieu de Descente', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--accent)' }
    ]);
}

function renderSatisfactionDetailTable() {
    const container = document.getElementById('satisfactionDetailTable');
    const data = dashboardData?.satisfaction || [];
    
    container.innerHTML = createTable(data, [
        { key: 'satisfaction_organisation_deplacement_inbtp', label: 'Niveau de Satisfaction', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--warning)' }
    ]);
}

function renderCombinaisonTable() {
    const container = document.getElementById('combinaisonTable');
    const data = dashboardData?.combinaison_transport || [];
    
    container.innerHTML = createTable(data, [
        { key: 'combinaison_transport', label: 'Combinaison', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--success)' }
    ]);
}

function renderConflitsTable() {
    const container = document.getElementById('conflitsTable');
    const data = dashboardData?.conflits || [];
    
    container.innerHTML = createTable(data, [
        { key: 'confli_entre_usage', label: 'Type de Conflit', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--danger)' }
    ]);
}

function renderDangerTable() {
    const container = document.getElementById('dangerTable');
    const data = dashboardData?.situations_dangereuses;
    
    if (data) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; color: var(--danger);">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3 style="margin: 15px 0; font-size: 32px; color: var(--danger);">${data.total}</h3>
                <p style="color: var(--text-secondary);">Situations dangereuses signalées</p>
                <div class="progress-bar" style="margin: 20px 0;">
                    <div class="progress" style="width: ${data.pourcentage}%; background: var(--danger);"></div>
                </div>
                <p style="font-weight: 600; color: var(--danger);">${data.pourcentage}% des répondants</p>
            </div>
        `;
    }
}

function renderAmenagementTable() {
    const container = document.getElementById('amenagementTable');
    const data = dashboardData?.top_amenagements || [];
    
    container.innerHTML = createTable(data, [
        { key: 'nom', label: 'Aménagement', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--accent)' }
    ]);
}

function renderDifficultesTable() {
    const container = document.getElementById('difficultesTable');
    const data = dashboardData?.top_difficultes || [];
    
    container.innerHTML = createTable(data, [
        { key: 'nom', label: 'Difficulté', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--danger)' }
    ]);
}

function renderSouhaitsTable() {
    const container = document.getElementById('souhaitsTable');
    const data = dashboardData?.top_souhaits || [];
    
    container.innerHTML = createTable(data, [
        { key: 'nom', label: 'Aménagement Souhaité', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--success)' }
    ]);
}

function renderPMBTable() {
    const container = document.getElementById('pmbTable');
    const data = dashboardData?.amenagement_pmb || [];
    
    container.innerHTML = createTable(data, [
        { key: 'amenagement_pietons_mot_bus', label: 'Type', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--info)' }
    ]);
}

function renderEtudeTable() {
    const container = document.getElementById('etudeTable');
    const data = dashboardData?.niveau_etude || [];
    
    container.innerHTML = createTable(data, [
        { key: 'niveauEtude', label: "Niveau d'Étude", type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--accent)' }
    ]);
}

function renderDescenteTempsTable() {
    const container = document.getElementById('descenteTempsTable');
    const data = dashboardData?.temps_descente || [];
    
    container.innerHTML = createTable(data, [
        { key: 'temps_deplacement_descente_inbtp', label: 'Temps de Descente', type: 'text' },
        { key: 'count', label: 'Nombre', type: 'progress', color: 'var(--info)' }
    ]);
}




// État pour la vue combinée
let combinedViewExpanded = false;

// Fonction pour créer un tableau amélioré avec classement
function createEnhancedTable(data, options = {}) {
    const {
        valueKey = 'nom',
        countKey = 'count',
        title = '',
        color = 'var(--accent)',
        maxItems = 10,
        showRank = true,
        showPercentage = true,
        emptyMessage = 'Aucune donnée disponible'
    } = options;
    
    if (!data || data.length === 0) {
        return `<p class="text-muted" style="text-align: center; padding: 20px;">
                    <i class="fas fa-inbox" style="font-size: 24px; display: block; margin-bottom: 10px;"></i>
                    ${emptyMessage}
                </p>`;
    }
    
    const limitedData = data.slice(0, maxItems);
    const maxCount = Math.max(...limitedData.map(item => item[countKey] || 0));
    const totalCount = limitedData.reduce((sum, item) => sum + (item[countKey] || 0), 0);
    
    const tableRows = limitedData.map((item, index) => {
        const count = item[countKey] || 0;
        const percentage = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : 0;
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        
        return `
            <tr class="fade-in" style="animation-delay: ${index * 0.05}s;">
                ${showRank ? `
                    <td class="rank-cell">
                        <span class="mini-rank ${rankClass}">${index + 1}</span>
                    </td>
                ` : ''}
                <td>
                    <strong>${item[valueKey] || 'N/A'}</strong>
                    ${index === 0 ? '<span class="badge" style="margin-left: 8px;">Top 1</span>' : ''}
                </td>
                <td class="percentage-cell">
                    <span class="count-badge">${count}</span>
                </td>
                ${showPercentage ? `
                    <td class="percentage-cell" style="color: ${color};">
                        ${percentage}%
                    </td>
                ` : ''}
                <td>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(count / maxCount) * 100}%; background: ${color};"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    return `
        <table class="enhanced-table">
            <thead>
                <tr>
                    ${showRank ? '<th>Rang</th>' : ''}
                    <th>${title || 'Catégorie'}</th>
                    <th>Nombre</th>
                    ${showPercentage ? '<th>%</th>' : ''}
                    <th>Distribution</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
}

// Fonction pour créer la vue combinée
function createCombinedView() {
    const amenagements = dashboardData?.top_amenagements || [];
    const difficultes = dashboardData?.top_difficultes || [];
    const souhaits = dashboardData?.top_souhaits || [];
    
    return {
        amenagements: createEnhancedTable(amenagements, {
            valueKey: 'nom',
            countKey: 'count',
            title: 'Aménagement',
            color: 'var(--accent)',
            maxItems: 5,
            showRank: true,
            showPercentage: true
        }),
        difficultes: createEnhancedTable(difficultes, {
            valueKey: 'nom',
            countKey: 'count',
            title: 'Difficulté',
            color: 'var(--danger)',
            maxItems: 5,
            showRank: true,
            showPercentage: true
        }),
        souhaits: createEnhancedTable(souhaits, {
            valueKey: 'nom',
            countKey: 'count',
            title: 'Souhait',
            color: 'var(--success)',
            maxItems: 5,
            showRank: true,
            showPercentage: true
        })
    };
}

// Render pour les tableaux combinés
function renderCombinedTables() {
    const combinedView = createCombinedView();
    
    document.getElementById('combinedAmenagements').innerHTML = combinedView.amenagements;
    document.getElementById('combinedDifficultes').innerHTML = combinedView.difficultes;
    document.getElementById('combinedSouhaits').innerHTML = combinedView.souhaits;
}

// Render pour les tableaux individuels améliorés
function renderAmenagementTable() {
    const container = document.getElementById('amenagementTable');
    const data = dashboardData?.top_amenagements || [];
    
    container.innerHTML = createEnhancedTable(data, {
        valueKey: 'nom',
        countKey: 'count',
        title: 'Aménagement Prioritaire',
        color: 'var(--accent)',
        maxItems: 10,
        showRank: true,
        showPercentage: true,
        emptyMessage: 'Aucun aménagement prioritaire signalé'
    });
}

function renderDifficultesTable() {
    const container = document.getElementById('difficultesTable');
    const data = dashboardData?.top_difficultes || [];
    
    container.innerHTML = createEnhancedTable(data, {
        valueKey: 'nom',
        countKey: 'count',
        title: 'Difficulté',
        color: 'var(--danger)',
        maxItems: 10,
        showRank: true,
        showPercentage: true,
        emptyMessage: 'Aucune difficulté signalée'
    });
}

function renderSouhaitsTable() {
    const container = document.getElementById('souhaitsTable');
    const data = dashboardData?.top_souhaits || [];
    
    container.innerHTML = createEnhancedTable(data, {
        valueKey: 'nom',
        countKey: 'count',
        title: 'Aménagement Souhaité',
        color: 'var(--success)',
        maxItems: 10,
        showRank: true,
        showPercentage: true,
        emptyMessage: 'Aucun souhait exprimé'
    });
}

// Nouvelle fonction pour la disponibilité des piétons
function renderDisponibilitePietonsTable() {
    const container = document.getElementById('disponibilitePietonsTable');
    const data = dashboardData?.disponibilite_pietons || [];
    
    // Transformation des données pour une meilleure présentation
    const transformedData = data.map(item => ({
        nom: item.disponibilit_amenagement_pieto_autour_inbtp || 'Non spécifié',
        count: item.count || 0,
        icon: getAvailabilityIcon(item.disponibilit_amenagement_pieto_autour_inbtp)
    }));
    
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <p style="color: var(--text-secondary); font-size: 14px;">
                <i class="fas fa-info-circle"></i> 
                Disponibilité des aménagements piétons autour de l'INBTP
            </p>
        </div>
        ${createEnhancedTable(transformedData, {
            valueKey: 'nom',
            countKey: 'count',
            title: 'Disponibilité',
            color: 'var(--info)',
            maxItems: 10,
            showRank: true,
            showPercentage: true,
            emptyMessage: 'Aucune donnée sur la disponibilité'
        })}
    `;
}

// Nouvelle fonction pour l'absence d'espace aménagé
function renderAbsenceEspaceTable() {
    const container = document.getElementById('absenceEspaceTable');
    const data = dashboardData?.absence_espace || [];
    
    // Transformation des données
    const transformedData = data.map(item => ({
        nom: item.absence_espace_amenage_et_difficulte_de_circulation || 'Non spécifié',
        count: item.count || 0,
        icon: getAbsenceIcon(item.absence_espace_amenage_et_difficulte_de_circulation)
    }));
    
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <p style="color: var(--text-secondary); font-size: 14px;">
                <i class="fas fa-exclamation-triangle"></i> 
                Problèmes d'absence d'espace aménagé et difficultés de circulation
            </p>
        </div>
        ${createEnhancedTable(transformedData, {
            valueKey: 'nom',
            countKey: 'count',
            title: 'Type de Problème',
            color: 'var(--warning)',
            maxItems: 10,
            showRank: true,
            showPercentage: true,
            emptyMessage: 'Aucun problème signalé'
        })}
    `;
}

// Fonctions utilitaires pour les icônes
function getAvailabilityIcon(value) {
    if (!value) return 'fa-question-circle';
    const lowercase = value.toLowerCase();
    
    if (lowercase.includes('oui') || lowercase.includes('disponible') || lowercase.includes('existe')) {
        return 'fa-check-circle';
    } else if (lowercase.includes('non') || lowercase.includes('indisponible') || lowercase.includes('absent')) {
        return 'fa-times-circle';
    } else if (lowercase.includes('partiel') || lowercase.includes('partiellement')) {
        return 'fa-adjust';
    } else {
        return 'fa-question-circle';
    }
}

function getAbsenceIcon(value) {
    if (!value) return 'fa-question-circle';
    const lowercase = value.toLowerCase();
    
    if (lowercase.includes('trottoir') || lowercase.includes('passage')) {
        return 'fa-walking';
    } else if (lowercase.includes('route') || lowercase.includes('chaussée')) {
        return 'fa-road';
    } else if (lowercase.includes('stationnement') || lowercase.includes('parking')) {
        return 'fa-parking';
    } else if (lowercase.includes('signalisation') || lowercase.includes('panneau')) {
        return 'fa-traffic-light';
    } else if (lowercase.includes('éclairage') || lowercase.includes('lumi')) {
        return 'fa-lightbulb';
    } else {
        return 'fa-exclamation-triangle';
    }
}

// Fonction pour basculer la vue combinée
function toggleCombinedView() {
    combinedViewExpanded = !combinedViewExpanded;
    
    const combinedGrid = document.querySelector('.combined-analysis-grid');
    if (combinedGrid) {
        if (combinedViewExpanded) {
            combinedGrid.style.gap = '30px';
            combinedGrid.querySelectorAll('.combined-item').forEach(item => {
                item.style.padding = '30px';
            });
        } else {
            combinedGrid.style.gap = '20px';
            combinedGrid.querySelectorAll('.combined-item').forEach(item => {
                item.style.padding = '20px';
            });
        }
    }
    
    // Afficher un toast
    showToast(
        combinedViewExpanded ? 'Vue détaillée activée' : 'Vue compacte activée',
        'success'
    );
}

// Mise à jour de la fonction renderAllData
function renderAllData() {
    renderKPICards();
    renderStatutTable();
    renderTransportTable();
    renderSatisfactionTable();
    renderFrequenceTable();
    renderTempsTable();
    renderArriveeTable();
    renderDepartTable();
    renderDescenteTable();
    renderSatisfactionDetailTable();
    renderCombinaisonTable();
    renderConflitsTable();
    renderDangerTable();
    
    // Nouveaux rendus
    renderCombinedTables();
    renderAmenagementTable();
    renderDifficultesTable();
    renderSouhaitsTable();
    renderDisponibilitePietonsTable();
    renderAbsenceEspaceTable();
    
    // Anciens rendus conservés
    renderPMBTable();
    renderEtudeTable();
    renderDescenteTempsTable();
}












// Apply filters
function applyFilters() {
    // Implement filtering logic based on current filters
    console.log('Applying filters:', filters);
    // You can add client-side filtering here if needed
}

// Refresh data
function refreshData() {
    loadAllData();
}

// Export data
function exportData() {
    if (!dashboardData) {
        showToast('Aucune donnée à exporter', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'dashboard_data_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Export réussi', 'success');
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Loading states
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = type === 'success' ? 'var(--success)' : 'var(--danger)';
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}




// Auto-refresh every 5 minutes
setInterval(() => {
    refreshData();
}, 300000);