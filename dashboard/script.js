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