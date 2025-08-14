// Service Portal - Dashboard JavaScript
// Version: 1.0.0

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    
    // Wait for main.js to initialize first
    setTimeout(() => {
        initializeDashboard();
    }, 200);
});

// Dashboard initialization
function initializeDashboard() {
    // Check authentication
    if (!isUserAuthenticated()) {
        redirectToLogin();
        return;
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize charts
    initializeCharts();
    
    // Load recent activity
    loadRecentActivity();
    
    // Update last login time
    updateLastLoginTime();
    
    // Set up auto-refresh
    setupAutoRefresh();
}

// Check if user is authenticated
function isUserAuthenticated() {
    const user = localStorage.getItem('servicehub-user');
    const token = localStorage.getItem('servicehub-auth-token') || sessionStorage.getItem('servicehub-auth-token');
    
    return user && token;
}

// Redirect to login if not authenticated
function redirectToLogin() {
    window.location.href = '/pages/login.html';
}

// Load dashboard statistics
async function loadDashboardData() {
    try {
        showLoading(document.querySelector('main'));
        
        // Simulate API calls for dashboard data
        const [stats, revenueData, vehicleStatusData] = await Promise.all([
            loadDashboardStats(),
            loadRevenueData(),
            loadVehicleStatusData()
        ]);
        
        // Update dashboard with loaded data
        updateDashboardStats(stats);
        
        hideLoading(document.querySelector('main'));
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
        hideLoading(document.querySelector('main'));
    }
}

// Load dashboard statistics (mock data)
async function loadDashboardStats() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock statistics data
    return {
        activeVehicles: 247,
        totalCustomers: 189,
        monthlyRevenue: '€12,450',
        pendingTasks: 8
    };
}

// Load revenue data for chart (mock data)
async function loadRevenueData() {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [8500, 9200, 10100, 11300, 10800, 12450]
    };
}

// Load vehicle status data for chart (mock data)
async function loadVehicleStatusData() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
        labels: ['Active', 'Inactive', 'Maintenance', 'Offline'],
        data: [187, 32, 18, 10],
        colors: ['#10B981', '#6B7280', '#F59E0B', '#EF4444']
    };
}

// Update dashboard statistics display
function updateDashboardStats(stats) {
    // Update stat counters with animation
    animateCounter('active-vehicles-count', stats.activeVehicles);
    animateCounter('total-customers-count', stats.totalCustomers);
    animateCounter('pending-tasks-count', stats.pendingTasks);
    
    // Update revenue (no animation for currency)
    const revenueElement = document.getElementById('monthly-revenue');
    if (revenueElement) {
        revenueElement.textContent = stats.monthlyRevenue;
    }
}

// Animate counter numbers
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1000; // 1 second
    const start = 0;
    const increment = targetValue / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Initialize charts
async function initializeCharts() {
    try {
        // Wait for Chart.js to be available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }
        
        // Load chart data
        const [revenueData, vehicleStatusData] = await Promise.all([
            loadRevenueData(),
            loadVehicleStatusData()
        ]);
        
        // Initialize revenue chart
        initializeRevenueChart(revenueData);
        
        // Initialize vehicle status chart
        initializeVehicleStatusChart(vehicleStatusData);
        
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize revenue line chart
function initializeRevenueChart(data) {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: currentLanguage === 'en' ? 'Revenue (€)' : 'Fatturato (€)',
                data: data.data,
                borderColor: '#00D4FF',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00D4FF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Initialize vehicle status doughnut chart
function initializeVehicleStatusChart(data) {
    const ctx = document.getElementById('vehicle-status-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels.map(label => {
                // Translate labels if needed
                const translations = {
                    'Active': currentLanguage === 'en' ? 'Active' : 'Attivi',
                    'Inactive': currentLanguage === 'en' ? 'Inactive' : 'Inattivi',
                    'Maintenance': currentLanguage === 'en' ? 'Maintenance' : 'Manutenzione',
                    'Offline': currentLanguage === 'en' ? 'Offline' : 'Offline'
                };
                return translations[label] || label;
            }),
            datasets: [{
                data: data.data,
                backgroundColor: data.colors,
                borderWidth: 0,
                hoverBorderWidth: 2,
                hoverBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Load recent activity (mock data)
async function loadRecentActivity() {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock activity data
        const activities = [
            {
                icon: 'fas fa-car',
                iconColor: 'text-green-600 dark:text-green-400',
                iconBg: 'bg-green-100 dark:bg-green-900/20',
                title: currentLanguage === 'en' ? 'New vehicle registered' : 'Nuovo veicolo registrato',
                description: 'BMW X5 - License: AB123CD',
                time: '2 hours ago',
                timeIt: '2 ore fa'
            },
            {
                icon: 'fas fa-user-plus',
                iconColor: 'text-blue-600 dark:text-blue-400',
                iconBg: 'bg-blue-100 dark:bg-blue-900/20',
                title: currentLanguage === 'en' ? 'Customer profile updated' : 'Profilo cliente aggiornato',
                description: 'Mario Rossi - Contact info updated',
                time: '4 hours ago',
                timeIt: '4 ore fa'
            },
            {
                icon: 'fas fa-chart-line',
                iconColor: 'text-purple-600 dark:text-purple-400',
                iconBg: 'bg-purple-100 dark:bg-purple-900/20',
                title: currentLanguage === 'en' ? 'Monthly report generated' : 'Report mensile generato',
                description: 'November 2024 performance report',
                time: '6 hours ago',
                timeIt: '6 ore fa'
            },
            {
                icon: 'fas fa-wrench',
                iconColor: 'text-orange-600 dark:text-orange-400',
                iconBg: 'bg-orange-100 dark:bg-orange-900/20',
                title: currentLanguage === 'en' ? 'Maintenance scheduled' : 'Manutenzione programmata',
                description: 'Fiat 500 - Service due next week',
                time: '8 hours ago',
                timeIt: '8 ore fa'
            }
        ];
        
        displayRecentActivity(activities);
        
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

// Display recent activity items
function displayRecentActivity(activities) {
    const container = document.getElementById('recent-activity-list');
    if (!container) return;
    
    // Clear loading placeholder
    container.innerHTML = '';
    
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors';
        
        activityElement.innerHTML = `
            <div class="flex-shrink-0">
                <div class="w-10 h-10 ${activity.iconBg} rounded-lg flex items-center justify-center">
                    <i class="${activity.icon} ${activity.iconColor}"></i>
                </div>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    ${activity.title}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    ${activity.description}
                </p>
            </div>
            <div class="flex-shrink-0">
                <p class="text-xs text-gray-400 dark:text-gray-500">
                    ${currentLanguage === 'en' ? activity.time : activity.timeIt}
                </p>
            </div>
        `;
        
        container.appendChild(activityElement);
    });
}

// Update last login time
function updateLastLoginTime() {
    const user = localStorage.getItem('servicehub-user');
    if (!user) return;
    
    try {
        const userData = JSON.parse(user);
        const loginTime = userData.loginTime;
        
        if (loginTime) {
            const date = new Date(loginTime);
            const options = {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            const formattedTime = date.toLocaleDateString(
                currentLanguage === 'en' ? 'en-US' : 'it-IT',
                options
            );
            
            const element = document.getElementById('last-login-time');
            if (element) {
                element.textContent = formattedTime;
            }
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
}

// Setup auto-refresh for dashboard data
function setupAutoRefresh() {
    // Refresh dashboard data every 5 minutes
    setInterval(() => {
        console.log('Auto-refreshing dashboard data...');
        loadDashboardData();
    }, 5 * 60 * 1000);
    
    // Refresh recent activity every 2 minutes
    setInterval(() => {
        console.log('Auto-refreshing recent activity...');
        loadRecentActivity();
    }, 2 * 60 * 1000);
}

// Show error message
function showError(message) {
    // Create or update error notification
    let errorNotification = document.getElementById('error-notification');
    
    if (!errorNotification) {
        errorNotification = document.createElement('div');
        errorNotification.id = 'error-notification';
        errorNotification.className = 'fixed top-20 right-4 z-50 max-w-sm';
        document.body.appendChild(errorNotification);
    }
    
    errorNotification.innerHTML = `
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 shadow-lg">
            <div class="flex">
                <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-circle text-red-400"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-red-700 dark:text-red-300">${message}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-red-400 hover:text-red-600">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorNotification && errorNotification.parentNode) {
            errorNotification.remove();
        }
    }, 5000);
}

// Utility function to format currency
function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat(
        currentLanguage === 'en' ? 'en-EU' : 'it-IT',
        {
            style: 'currency',
            currency: currency
        }
    ).format(amount);
}

// Export dashboard functions for global access
window.Dashboard = {
    loadDashboardData,
    showError,
    formatCurrency
};

console.log('Dashboard JavaScript loaded successfully'); 