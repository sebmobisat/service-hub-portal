/**
 * GLOBAL INTERNATIONALIZATION SYSTEM
 * Service Hub Portal - Complete I18N Implementation
 * 
 * This system handles ALL text translation across the entire application
 * including page titles, meta tags, UI elements, and content.
 */

// Global protection against Node.js exports errors
if (typeof module === 'undefined') {
    var module = {};
}
if (typeof exports === 'undefined') {
    var exports = {};
}
if (typeof require === 'undefined') {
    var require = function() { return {}; };
}

class I18nManager {
    constructor() {
        this.storageKey = 'servicehub-language';
        this.currentLanguage = this.getStoredLanguage();
        this.translations = this.loadTranslations();
        this.init();
    }

    /**
     * Get language from localStorage or default to 'en'
     */
    getStoredLanguage() {
        const stored = localStorage.getItem(this.storageKey);
        console.log('Stored language:', stored);
        return stored || 'en';
    }

    /**
     * Save language to localStorage
     */
    saveLanguage(lang) {
        localStorage.setItem(this.storageKey, lang);
        // Also update the old 'language' key for backward compatibility
        localStorage.setItem('language', lang);
    }

    /**
     * Complete translation dictionary for all application text
     */
    loadTranslations() {
        return {
            it: {
                // Meta and Page Titles
                'meta.dashboard.title': 'Dashboard - Service Hub Portal',
                'meta.certificates.title': 'Certificati - Service Hub Portal', 
                'meta.settings.title': 'Impostazioni - Service Hub Portal',
                
                // Navigation and Sidebar
                'nav.dashboard': 'Dashboard',
                'nav.certificates': 'Certificati',
                'nav.billing': 'Credito',
                'nav.settings': 'Impostazioni',
                'nav.logout': 'Logout',
                
                // Login Page
                'login.title': 'Service Hub Portal',
                'login.subtitle': 'Accedi al tuo account dealer',
                'login.email': 'Email',
                'login.phone': 'Numero di Telefono',
                'login.pin': 'PIN di Accesso',
                'login.remember': 'Ricordami',
                'login.forgot_pin': 'PIN dimenticato?',
                'login.continue': 'Continua',
                'login.send_pin': 'Invia PIN',
                'login.login': 'Accedi',
                'login.delivery_method': 'Metodo di Consegna',
                'login.email_delivery': '📧 Email',
                'login.whatsapp_delivery': '📱 WhatsApp',
                'login.email_description': 'Ricevi il PIN via email',
                'login.whatsapp_description': 'Ricevi il PIN via WhatsApp',
                'login.error.email_required': 'Per favore inserisci la tua email',
                'login.error.email_invalid': 'Per favore inserisci un\'email valida',
                'login.error.phone_required': 'Per favore inserisci il tuo numero di telefono',
                'login.error.phone_invalid': 'Per favore inserisci un numero di telefono valido',
                'login.error.pin_required': 'Per favore inserisci il tuo PIN',
                'login.error.pin_invalid': 'PIN non valido',
                'login.success.pin_sent': 'PIN inviato con successo',
                'login.recovery.title': 'Recupero PIN',
                'login.recovery.description': 'Contatta l\'amministratore di sistema per assistenza nel recupero del PIN.',
                
                // Page Headers
                'page.dashboard.title': 'Dashboard',
                'page.dashboard.subtitle': 'Service Hub Portal',
                'page.certificates.title': 'Certificati',
                'page.certificates.subtitle': 'Gestisci e visualizza tutti i certificati del tuo dealer',
                'page.settings.title': 'Impostazioni',
                'page.settings.subtitle': 'Configura le impostazioni del tuo account',
                'meta.billing.title': 'Credito & Consumi - Service Hub Portal',
                'page.billing.title': 'Credito & Consumi',
                'page.billing.subtitle': 'Saldo Stripe e consumi per canale',
                'billing.balance': 'Credito disponibile',
                'billing.date_range': 'Intervallo date',
                'billing.presets.today': 'Oggi',
                'billing.presets.yesterday': 'Ieri',
                'billing.presets.this_week': 'Questa settimana',
                'billing.presets.last_week': 'Settimana scorsa',
                'billing.presets.this_month': 'Questo mese',
                'billing.presets.this_year': 'Quest\'anno',
                'billing.presets.custom': 'Personalizzato',
                'billing.chart.title': 'Consumi giornalieri',
                'billing.series.emails': 'Email',
                'billing.series.whatsapp': 'WhatsApp',
                'billing.series.openai': 'OpenAI',
                
                // Settings Page
                'settings.language.title': 'Lingua',
                'settings.language.description': 'Seleziona la lingua dell\'interfaccia',
                'settings.language.italian': 'Italiano',
                'settings.language.english': 'English',
                'settings.theme.title': 'Tema',
                'settings.theme.description': 'Seleziona il tema dell\'interfaccia',
                'settings.theme.dark': 'Scuro',
                'settings.theme.light': 'Chiaro',
                'settings.dealer.title': 'Informazioni Dealer',
                'settings.dealer.id': 'ID Dealer',
                'settings.dealer.name': 'Nome Dealer',
                'settings.system.title': 'Sistema',
                'settings.system.version': 'Versione',
                'settings.system.database': 'Stato Database',
                'settings.system.connected': '✅ Connesso',
                
                // Certificate Page
                'certificates.search.title': 'Ricerca e Filtri',
                'certificates.search.description': 'Trova certificati usando diversi criteri',
                'certificates.search.type': 'Cerca per:',
                'certificates.search.select_type': 'Seleziona tipo di ricerca',
                'certificates.search.global': 'Ricerca globale',
                'certificates.search.client': 'Cliente',
                'certificates.search.plate': 'Targa',
                'certificates.search.certificate': 'N° Certificato',
                'certificates.search.imei': 'Seriale',
                'certificates.search.brand': 'Marca',
                'certificates.search.model': 'Modello',
                'certificates.search.fuel': 'Carburante',
                'certificates.search.transmission': 'Trasmissione',
                'certificates.search.year': 'Anno',
                'certificates.search.clear': 'Cancella',
                'certificates.filters.status': 'Stato:',
                'certificates.filters.select': 'Seleziona',
                'certificates.view.label': 'Visualizza:',
                'certificates.view.cards': 'Schede',
                'certificates.view.table': 'Tabella',
                'certificates.action.refresh': 'Aggiorna',
                'certificates.action.customize': 'Personalizza',
                'certificates.active.title': 'Certificati Attivi',
                'certificates.count': 'Totale: {count} certificati',
                'certificates.loading': 'Caricamento certificati...',
                'certificates.error': 'Errore nel caricamento certificati',
                'certificates.retry': 'Riprova',
                'certificates.empty.title': '⚠️ Nessun certificato trovato',
                
                // Vehicle Statistics Cards
                'vehicle.stats.distance': 'DISTANZA',
                'vehicle.stats.trips': 'VIAGGI',
                'vehicle.stats.avg_battery': 'BATTERIA MEDIA',
                'vehicle.stats.drive_time': 'TEMPO GUIDA',
                'certificates.empty.description': 'Modifica i filtri di ricerca o ricarica i dati.',
                
                // Table Headers
                'table.certificate': 'N° Cert',
                'table.date': 'Data',
                'table.client': 'Cliente',
                'table.email': 'Email',
                'table.phone': 'Telefono',
                'table.vehicle': 'Veicolo',
                'table.year': 'Anno',
                'table.fuel': 'Carburante',
                'table.plate': 'Targa',
                'table.odometer': 'Km',
                'table.vin': 'VIN',
                'table.device': 'Device',
                'table.imei': 'Seriale',
                'table.serial': 'Seriale',
                'table.installer': 'Installatore',
                'table.installation': 'Installazione',
                'table.status': 'Status',
                'selected.items': 'selezionati',
                'contact.selected': 'Contatta selezionati',
                'clear.selection': 'Pulisci selezione',
                'contact.dialog.title': 'Comunicazione AI ai selezionati',
                'contact.channel': 'Canale',
                'contact.style': 'Stile',
                'contact.style.formal': 'Formale',
                'contact.style.informal': 'Informale',
                'contact.style.professional': 'Professionale',
                'contact.fields': 'Dati da includere',
                'contact.prompt': 'Prompt per l\'AI',
                'contact.prompt.placeholder': 'Scrivi qui le istruzioni per l\'AI...',
                'contact.preview': 'Anteprima messaggi',
                'contact.generate': 'Genera bozza',
                'contact.send': 'Invia',
                
                // Card Details
                'card.client': 'Cliente',
                'card.vehicle': 'Veicolo',
                'card.creation_date': 'Data Creazione',
                'card.odometer': 'Odometro',
                'card.imei': 'Seriale',
                'card.serial': 'Seriale',
                'card.device_id': 'Device ID',
                'card.vin_number': 'VIN Number',
                'card.installer': 'Installatore',
                'card.installation_point': 'Punto Installazione',
                
                // Card Sections
                'card.title': 'Certificato',
                'card.client_data': 'Dati Cliente',
                'card.client_name': 'Nome Cliente',
                'card.client_email': 'Email Cliente',
                'card.vehicle_data': 'Dati Veicolo',
                'card.vehicle_image': 'Immagine Veicolo',
                'card.device_data': 'Dati Dispositivo',
                
                // Status
                'status.active': 'Attivo',
                'status.inactive': 'Inattivo',
                
                // Dashboard
                'dashboard.welcome.title': 'Benvenuto',
                'dashboard.welcome.loading': 'Caricamento...',
                'dashboard.stats.total_certificates': 'Certificati Totali',
                'dashboard.stats.active_devices': 'Dispositivi Attivi',
                'dashboard.stats.pending': 'In Attesa',
                'dashboard.stats.issues': 'Problemi',
                'dashboard.recent.title': 'Attività Recente',
                'dashboard.recent.system_init': 'Sistema inizializzato',
                'dashboard.recent.dashboard_loaded': 'Dashboard caricata con successo',
                'dashboard.recent.time.now': 'Ora',
                'dashboard.actions.title': 'Azioni Rapide',
                'dashboard.actions.view_certificates': 'Visualizza Certificati',
                'dashboard.actions.view_certificates_desc': 'Gestisci i certificati di installazione',
                'dashboard.actions.settings': 'Impostazioni',
                'dashboard.actions.settings_desc': 'Configura le tue preferenze',
                'dashboard.actions.reports': 'Report',
                'dashboard.actions.reports_desc': 'Prossimamente disponibile',
                
                // Common
                'common.loading': 'Caricamento...',
                'common.error': 'Errore',
                'common.success': 'Successo',
                'common.confirm': 'Conferma',
                'common.cancel': 'Annulla',
                'common.save': 'Salva',
                'common.close': 'Chiudi',
                'common.search': 'Cerca',
                'common.filter': 'Filtra',
                'common.export': 'Esporta',
                'common.import': 'Importa',
                'common.delete': 'Elimina',
                'common.edit': 'Modifica',
                'common.view': 'Visualizza',
                'common.add': 'Aggiungi',
                'common.remove': 'Rimuovi',
                'common.yes': 'Sì',
                'common.no': 'No',
                'common.ok': 'OK',
                
                // Search Placeholders
                'search.placeholder.global': 'Digita per cercare...',
                'search.placeholder.client': 'Nome del cliente...',
                'search.placeholder.plate': 'Targa del veicolo...',
                'search.placeholder.certificate': 'Numero certificato...',
                'search.placeholder.imei': 'Seriale dispositivo...',
                
                // Messages
                'message.logout_confirm': 'Sei sicuro di voler uscire?',
                
                // Customization
                'customize.title': 'Personalizza Vista',
                'customize.table.title': 'Colonne Tabella',
                'customize.table.description': 'Scegli quali colonne visualizzare nella vista tabella (salvato nei cookies)',
                'customize.cards.title': 'Campi Schede',
                'customize.cards.description': 'Scegli quali campi visualizzare nelle schede (salvato nei cookies)',
                'customize.select_all': 'Seleziona Tutto',
                'customize.deselect_all': 'Deseleziona Tutto',
                'customize.reset': 'Ripristina Predefiniti',
                'customize.saved': 'Personalizzazione salvata nei cookies!',
                'customize.confirm_reset': 'Sei sicuro di voler ripristinare le impostazioni predefinite?',
                'customize.reset_success': 'Impostazioni ripristinate e cookies cancellati!',
                'customize.migrated': 'Impostazioni migrate da localStorage a cookies',
                'card.vehicle_image': 'Immagine Veicolo',
                
                // Advanced Search
                'certificates.search.advanced': 'Ricerca Avanzata',
                'advanced_search.title': 'Ricerca Avanzata',
                'advanced_search.description': 'Crea query di ricerca complesse con criteri multipli e operatori',
                'advanced_search.add_criteria': 'Aggiungi Criterio',
                'advanced_search.no_criteria': 'Nessun criterio di ricerca aggiunto',
                'advanced_search.select_field': 'Seleziona Campo',
                'advanced_search.select_operator': 'Seleziona Operatore',
                'advanced_search.remove_criteria': 'Rimuovi Criterio',
                'advanced_search.and': 'E',
                'advanced_search.or': 'O',
                
                // Field groups
                'advanced_search.dates': 'Date',
                'advanced_search.certificate': 'Certificato',
                'advanced_search.client': 'Cliente',
                'advanced_search.vehicle': 'Veicolo',
                
                // Fields
                'advanced_search.field_created_date': 'Data Creazione',
                'advanced_search.field_updated_date': 'Data Aggiornamento',
                'advanced_search.field_certificate_id': 'ID Certificato',
                'advanced_search.field_device_id': 'ID Dispositivo',
                'advanced_search.field_imei': 'IMEI',
                'advanced_search.field_client_name': 'Nome Cliente',
                'advanced_search.field_client_email': 'Email Cliente',
                'advanced_search.field_vehicle_brand': 'Marca Veicolo',
                'advanced_search.field_vehicle_model': 'Modello Veicolo',
                'advanced_search.field_vehicle_year': 'Anno Veicolo',
                'advanced_search.field_vehicle_plate': 'Targa Veicolo',
                'advanced_search.field_vehicle_fuel': 'Carburante Veicolo',
                'advanced_search.field_odometer': 'Chilometraggio',
                
                // Operators (date-specific)
                'advanced_search.op_equals': 'Stesso giorno',
                'advanced_search.op_not_equals': 'Giorno diverso',
                // Operators (exact for numbers/text)
                'advanced_search.op_exact_equals': 'Uguale a',
                'advanced_search.op_exact_not_equals': 'Diverso da',
                'advanced_search.op_greater': 'Maggiore di',
                'advanced_search.op_greater_equal': 'Maggiore o uguale a',
                'advanced_search.op_less': 'Minore di',
                'advanced_search.op_less_equal': 'Minore o uguale a',
                'advanced_search.op_between': 'Tra',
                'advanced_search.op_contains': 'Contiene',
                'advanced_search.op_not_contains': 'Non contiene',
                'advanced_search.op_starts_with': 'Inizia con',
                'advanced_search.op_ends_with': 'Finisce con',
                
                // Inputs
                'advanced_search.from': 'Da',
                'advanced_search.to': 'A',
                'advanced_search.enter_number': 'Inserisci numero',
                'advanced_search.enter_text': 'Inserisci testo',
                
                // Quick filters
                'advanced_search.quick_filters': 'Filtri Rapidi',
                'advanced_search.today': 'Oggi',
                'advanced_search.this_week': 'Questa Settimana',
                'advanced_search.this_month': 'Questo Mese',
                'advanced_search.this_year': 'Quest\'Anno',
                'advanced_search.last_30_days': 'Ultimi 30 Giorni',
                'advanced_search.last_90_days': 'Ultimi 90 Giorni',
                'advanced_search.new_cars_2024': 'Auto Nuove 2024+',
                'advanced_search.high_mileage': 'Alto Chilometraggio',
                
                // Preview
                'advanced_search.preview': 'Anteprima Ricerca',
                'advanced_search.matching_certificates': 'Certificati Corrispondenti',
                
                // Actions
                'advanced_search.clear': 'Pulisci Tutto',
                'advanced_search.save': 'Salva Ricerca',
                'advanced_search.apply': 'Applica Ricerca',
                'advanced_search.search_applied': 'Ricerca applicata',
                'advanced_search.certificates_found': 'certificati trovati',
                'advanced_search.enter_search_name': 'Inserisci nome della ricerca',
                'advanced_search.search_saved': 'Ricerca salvata',
                'advanced_search.query_note': 'ℹ️ Questa query è solo per riferimento. Il filtro viene applicato lato client sui dati già caricati.',
                
                // Vehicle Page
                'meta.vehicle.title': 'Dettagli Veicolo - Service Hub Portal',
                'vehicle.page_title': 'Dettagli Veicolo',
                'vehicle.page_subtitle': 'Informazioni complete del veicolo e storico',
                'vehicle.open_details': 'Apri dettagli veicolo',
                'vehicle.certificate_number': 'Certificato #',
                'vehicle.basic_info': 'Informazioni Base',
                'vehicle.technical_details': 'Dettagli Tecnici',
                'vehicle.device_info': 'Informazioni Dispositivo',
                'vehicle.brand': 'Marca',
                'vehicle.model': 'Modello',
                'vehicle.year': 'Anno',
                'vehicle.plate': 'Targa',
                'vehicle.fuel_type': 'Carburante',
                'vehicle.transmission': 'Trasmissione',
                'vehicle.odometer': 'Chilometraggio',
                'vehicle.color': 'Colore',
                'vehicle.device_id': 'ID Dispositivo',
                'vehicle.imei': 'IMEI',
                'vehicle.serial': 'Seriale',
                'vehicle.installation_date': 'Data Installazione',
                
                // Table Actions
                'table.actions': 'Azioni',
                
                // Vehicle Analytics
                'vehicle.analytics.title': 'Analisi Veicolo',
                'vehicle.analytics.subtitle': 'Report completi di performance e utilizzo',
                'vehicle.analytics.period': 'Periodo',
                'vehicle.analytics.refresh': 'Aggiorna',
                'vehicle.analytics.battery_title': 'Tensione Batteria',
                'vehicle.analytics.battery_subtitle': 'Media giornaliera tensione (V)',
                'vehicle.analytics.distance_time_title': 'Distanza e Tempo',
                'vehicle.analytics.distance_time_subtitle': 'Distanza giornaliera (km) e tempo (ore)',
                'vehicle.analytics.speed_title': 'Analisi Velocità',
                'vehicle.analytics.speed_subtitle': 'Velocità massima giornaliera (km/h)',
                'vehicle.analytics.activity_title': 'Panoramica Attività',
                'vehicle.analytics.activity_subtitle': 'Viaggi ed eventi giornalieri',
                'vehicle.analytics.health_title': 'Salute Sistema & Diagnostica',
                'vehicle.analytics.health_subtitle': 'Errori OBD, incidenti e posizioni sistema',
                'vehicle.analytics.total_distance': 'Distanza Totale',
                'vehicle.analytics.total_trips': 'Viaggi Totali',
                'vehicle.analytics.driving_time': 'Tempo di Viaggio',
                'vehicle.analytics.average_speed': 'Velocità Media',
                'vehicle.analytics.average_battery': 'Media Batteria',
                'vehicle.analytics.fuel_consumed': 'Carburante Utilizzato',
                'vehicle.analytics.fuel_title': 'Consumo Carburante',
                'vehicle.analytics.fuel_subtitle': 'Modelli di consumo carburante giornaliero (L)',
                'vehicle.analytics.system_health_title': 'Stato Sistema e Diagnostica',
                'vehicle.analytics.engine_temp_title': 'Temperatura Motore',
                'vehicle.analytics.rpm_engine_load_title': 'RPM e Carico Motore',
                'vehicle.analytics.advanced_obd_title': 'Parametri OBD Avanzati',
                'ai_report.title': 'Report Analisi AI',
                'ai_report.subtitle': 'Insights intelligenti sulle prestazioni del veicolo',
                'ai_report.vehicle_health': 'Salute Veicolo',
                'ai_report.vehicle_health_subtitle': 'Condizione generale',
                'ai_report.spike_analysis': 'Analisi Picchi',
                'ai_report.spike_analysis_subtitle': 'Insights OBD',
                'ai_report.maintenance': 'Manutenzione',
                'ai_report.maintenance_subtitle': 'Raccomandazioni servizio',
                'ai_report.performance': 'Prestazioni',
                'ai_report.performance_subtitle': 'Modelli di guida',
                'ai_report.potential_issues': 'Problemi Potenziali',
                'ai_report.potential_issues_subtitle': 'Segnali di avvertimento',
                'ai_report.opportunities': 'Opportunità',
                'ai_report.opportunities_subtitle': 'Potenziale commerciale',
                'vehicle.tab_vehicle': 'Veicolo',
                'vehicle.tab_client': 'Cliente',
                'vehicle.tab_analytics': 'Analytics',
                'vehicle.back_to_certificates': 'Torna ai Certificati',
            },
            
            en: {
                // Meta and Page Titles
                'meta.dashboard.title': 'Dashboard - Service Hub Portal',
                'meta.certificates.title': 'Certificates - Service Hub Portal',
                'meta.settings.title': 'Settings - Service Hub Portal',
                
                // Navigation and Sidebar
                'nav.dashboard': 'Dashboard',
                'nav.certificates': 'Certificates',
                'nav.billing': 'Billing',
                'nav.settings': 'Settings',
                'nav.logout': 'Logout',
                
                // Login Page
                'login.title': 'Service Hub Portal',
                'login.subtitle': 'Access your dealer account',
                'login.email': 'Email',
                'login.phone': 'Phone Number',
                'login.pin': 'Access PIN',
                'login.remember': 'Remember me',
                'login.forgot_pin': 'Forgot PIN?',
                'login.continue': 'Continue',
                'login.send_pin': 'Send PIN',
                'login.login': 'Login',
                'login.delivery_method': 'Delivery Method',
                'login.email_delivery': '📧 Email',
                'login.whatsapp_delivery': '📱 WhatsApp',
                'login.email_description': 'Receive PIN via email',
                'login.whatsapp_description': 'Receive PIN via WhatsApp',
                'login.error.email_required': 'Please enter your email',
                'login.error.email_invalid': 'Please enter a valid email',
                'login.error.phone_required': 'Please enter your phone number',
                'login.error.phone_invalid': 'Please enter a valid phone number',
                'login.error.pin_required': 'Please enter your PIN',
                'login.error.pin_invalid': 'Invalid PIN',
                'login.success.pin_sent': 'PIN sent successfully',
                'login.recovery.title': 'PIN Recovery',
                'login.recovery.description': 'Contact your system administrator for PIN recovery assistance.',
                
                // Page Headers
                'page.dashboard.title': 'Dashboard',
                'page.dashboard.subtitle': 'Service Hub Portal',
                'page.certificates.title': 'Certificates',
                'page.certificates.subtitle': 'Manage and view all your dealer certificates',
                'page.settings.title': 'Settings',
                'page.settings.subtitle': 'Configure your account settings',
                'meta.billing.title': 'Credit & Usage - Service Hub Portal',
                'page.billing.title': 'Credit & Usage',
                'page.billing.subtitle': 'Stripe balance and per-channel usage',
                'billing.balance': 'Available credit',
                'billing.date_range': 'Date range',
                'billing.presets.today': 'Today',
                'billing.presets.yesterday': 'Yesterday',
                'billing.presets.this_week': 'This week',
                'billing.presets.last_week': 'Last week',
                'billing.presets.this_month': 'This month',
                'billing.presets.this_year': 'This year',
                'billing.presets.custom': 'Custom',
                'billing.chart.title': 'Daily usage',
                'billing.series.emails': 'Emails',
                'billing.series.whatsapp': 'WhatsApp',
                'billing.series.openai': 'OpenAI',
                
                // Settings Page
                'settings.language.title': 'Language',
                'settings.language.description': 'Select interface language',
                'settings.language.italian': 'Italiano',
                'settings.language.english': 'English',
                'settings.theme.title': 'Theme',
                'settings.theme.description': 'Select interface theme',
                'settings.theme.dark': 'Dark',
                'settings.theme.light': 'Light',
                'settings.dealer.title': 'Dealer Information',
                'settings.dealer.id': 'Dealer ID',
                'settings.dealer.name': 'Dealer Name',
                'settings.system.title': 'System',
                'settings.system.version': 'Version',
                'settings.system.database': 'Database Status',
                'settings.system.connected': '✅ Connected',
                
                // Certificate Page
                'certificates.search.title': 'Search and Filters',
                'certificates.search.description': 'Find certificates using different criteria',
                'certificates.search.type': 'Search by:',
                'certificates.search.select_type': 'Select search type',
                'certificates.search.global': 'Global search',
                'certificates.search.client': 'Customer',
                'certificates.search.plate': 'Plate',
                'certificates.search.certificate': 'Certificate #',
                'certificates.search.imei': 'Serial',
                'certificates.search.brand': 'Brand',
                'certificates.search.model': 'Model',
                'certificates.search.fuel': 'Fuel',
                'certificates.search.transmission': 'Transmission',
                'certificates.search.year': 'Year',
                'certificates.search.clear': 'Clear',
                'certificates.filters.status': 'Status:',
                'certificates.filters.select': 'Select',
                'certificates.view.label': 'View:',
                'certificates.view.cards': 'Cards',
                'certificates.view.table': 'Table',
                'certificates.action.refresh': 'Refresh',
                'certificates.action.customize': 'Customize',
                'certificates.active.title': 'Active Certificates',
                'certificates.count': 'Total: {count} certificates',
                'certificates.loading': 'Loading certificates...',
                'certificates.error': 'Error loading certificates',
                'certificates.retry': 'Retry',
                'certificates.empty.title': '⚠️ No certificates found',
                'certificates.empty.description': 'Modify search filters or reload data.',
                
                // Vehicle Statistics Cards
                'vehicle.stats.distance': 'DISTANCE',
                'vehicle.stats.trips': 'TRIPS',
                'vehicle.stats.avg_battery': 'AVG BATTERY',
                'vehicle.stats.drive_time': 'DRIVE TIME',
                
                // Table Headers
                'table.certificate': 'Cert #',
                'table.date': 'Date',
                'table.client': 'Client',
                'table.email': 'Email',
                'table.phone': 'Phone',
                'table.vehicle': 'Vehicle',
                'table.year': 'Year',
                'table.fuel': 'Fuel',
                'table.plate': 'Plate',
                'table.odometer': 'Miles',
                'table.vin': 'VIN',
                'table.device': 'Device',
                'table.imei': 'Serial',
                'table.serial': 'Serial',
                'table.installer': 'Installer',
                'table.installation': 'Installation',
                'table.status': 'Status',
                'selected.items': 'selected',
                'contact.selected': 'Contact selected',
                'clear.selection': 'Clear selection',
                'contact.dialog.title': 'AI communication to selected',
                'contact.channel': 'Channel',
                'contact.style': 'Style',
                'contact.style.formal': 'Formal',
                'contact.style.informal': 'Informal',
                'contact.style.professional': 'Professional',
                'contact.fields': 'Data to include',
                'contact.prompt': 'AI Prompt',
                'contact.prompt.placeholder': 'Write instructions for the AI here...',
                'contact.preview': 'Message preview',
                'contact.generate': 'Generate draft',
                'contact.send': 'Send',
                
                // Card Details
                'card.client': 'Client',
                'card.vehicle': 'Vehicle',
                'card.creation_date': 'Creation Date',
                'card.odometer': 'Odometer',
                'card.imei': 'Serial',
                'card.serial': 'Serial',
                'card.device_id': 'Device ID',
                'card.vin_number': 'VIN Number',
                'card.installer': 'Installer',
                'card.installation_point': 'Installation Point',
                
                // Card Sections
                'card.title': 'Certificate',
                'card.client_data': 'Client Data',
                'card.client_name': 'Client Name',
                'card.client_email': 'Client Email',
                'card.vehicle_data': 'Vehicle Data',
                'card.vehicle_image': 'Vehicle Image',
                'card.device_data': 'Device Data',
                
                // Status
                'status.active': 'Active',
                'status.inactive': 'Inactive',
                
                // Dashboard
                'dashboard.welcome.title': 'Welcome',
                'dashboard.welcome.loading': 'Loading...',
                'dashboard.stats.total_certificates': 'Total Certificates',
                'dashboard.stats.active_devices': 'Active Devices',
                'dashboard.stats.pending': 'Pending',
                'dashboard.stats.issues': 'Issues',
                'dashboard.recent.title': 'Recent Activity',
                'dashboard.recent.system_init': 'System initialized',
                'dashboard.recent.dashboard_loaded': 'Dashboard loaded successfully',
                'dashboard.recent.time.now': 'Now',
                'dashboard.actions.title': 'Quick Actions',
                'dashboard.actions.view_certificates': 'View Certificates',
                'dashboard.actions.view_certificates_desc': 'Manage installation certificates',
                'dashboard.actions.settings': 'Settings',
                'dashboard.actions.settings_desc': 'Configure your preferences',
                'dashboard.actions.reports': 'Reports',
                'dashboard.actions.reports_desc': 'Coming soon',
                
                // Common
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.success': 'Success',
                'common.confirm': 'Confirm',
                'common.cancel': 'Cancel',
                'common.save': 'Save',
                'common.close': 'Close',
                'common.search': 'Search',
                'common.filter': 'Filter',
                'common.export': 'Export',
                'common.import': 'Import',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                'common.view': 'View',
                'common.add': 'Add',
                'common.remove': 'Remove',
                'common.yes': 'Yes',
                'common.no': 'No',
                'common.ok': 'OK',
                
                // Search Placeholders
                'search.placeholder.global': 'Type to search...',
                'search.placeholder.client': 'Customer name...',
                'search.placeholder.plate': 'Vehicle plate...',
                'search.placeholder.certificate': 'Certificate number...',
                'search.placeholder.imei': 'Device serial...',
                
                // Messages
                'message.logout_confirm': 'Are you sure you want to logout?',
                
                // Customization
                'customize.title': 'Customize View',
                'customize.table.title': 'Table Columns',
                'customize.table.description': 'Choose which columns to display in table view (saved in cookies)',
                'customize.cards.title': 'Card Fields',
                'customize.cards.description': 'Choose which fields to display in cards (saved in cookies)',
                'customize.select_all': 'Select All',
                'customize.deselect_all': 'Deselect All',
                'customize.reset': 'Reset Defaults',
                'customize.saved': 'Customization saved in cookies!',
                'customize.confirm_reset': 'Are you sure you want to reset to default settings?',
                'customize.reset_success': 'Settings reset and cookies cleared!',
                'customize.migrated': 'Settings migrated from localStorage to cookies',
                'card.vehicle_image': 'Vehicle Image',
                
                // Advanced Search
                'certificates.search.advanced': 'Advanced Search',
                'advanced_search.title': 'Advanced Search',
                'advanced_search.description': 'Create complex search queries with multiple criteria and operators',
                'advanced_search.add_criteria': 'Add Criteria',
                'advanced_search.no_criteria': 'No search criteria added',
                'advanced_search.select_field': 'Select Field',
                'advanced_search.select_operator': 'Select Operator',
                'advanced_search.remove_criteria': 'Remove Criteria',
                'advanced_search.and': 'AND',
                'advanced_search.or': 'OR',
                
                // Field groups
                'advanced_search.dates': 'Dates',
                'advanced_search.certificate': 'Certificate',
                'advanced_search.client': 'Client',
                'advanced_search.vehicle': 'Vehicle',
                
                // Fields
                'advanced_search.field_created_date': 'Created Date',
                'advanced_search.field_updated_date': 'Updated Date',
                'advanced_search.field_certificate_id': 'Certificate ID',
                'advanced_search.field_device_id': 'Device ID',
                'advanced_search.field_imei': 'IMEI',
                'advanced_search.field_client_name': 'Client Name',
                'advanced_search.field_client_email': 'Client Email',
                'advanced_search.field_vehicle_brand': 'Vehicle Brand',
                'advanced_search.field_vehicle_model': 'Vehicle Model',
                'advanced_search.field_vehicle_year': 'Vehicle Year',
                'advanced_search.field_vehicle_plate': 'Vehicle Plate',
                'advanced_search.field_vehicle_fuel': 'Vehicle Fuel',
                'advanced_search.field_odometer': 'Odometer',
                
                // Operators (date-specific)
                'advanced_search.op_equals': 'Same Day',
                'advanced_search.op_not_equals': 'Different Day',
                // Operators (exact for numbers/text)
                'advanced_search.op_exact_equals': 'Equals',
                'advanced_search.op_exact_not_equals': 'Not Equals',
                'advanced_search.op_greater': 'Greater Than',
                'advanced_search.op_greater_equal': 'Greater Than or Equal',
                'advanced_search.op_less': 'Less Than',
                'advanced_search.op_less_equal': 'Less Than or Equal',
                'advanced_search.op_between': 'Between',
                'advanced_search.op_contains': 'Contains',
                'advanced_search.op_not_contains': 'Does Not Contain',
                'advanced_search.op_starts_with': 'Starts With',
                'advanced_search.op_ends_with': 'Ends With',
                
                // Inputs
                'advanced_search.from': 'From',
                'advanced_search.to': 'To',
                'advanced_search.enter_number': 'Enter number',
                'advanced_search.enter_text': 'Enter text',
                
                // Quick filters
                'advanced_search.quick_filters': 'Quick Filters',
                'advanced_search.today': 'Today',
                'advanced_search.this_week': 'This Week',
                'advanced_search.this_month': 'This Month',
                'advanced_search.this_year': 'This Year',
                'advanced_search.last_30_days': 'Last 30 Days',
                'advanced_search.last_90_days': 'Last 90 Days',
                'advanced_search.new_cars_2024': 'New Cars 2024+',
                'advanced_search.high_mileage': 'High Mileage',
                
                // Preview
                'advanced_search.preview': 'Search Preview',
                'advanced_search.matching_certificates': 'Matching Certificates',
                
                // Actions
                'advanced_search.clear': 'Clear All',
                'advanced_search.save': 'Save Search',
                'advanced_search.apply': 'Apply Search',
                'advanced_search.search_applied': 'Search applied',
                'advanced_search.certificates_found': 'certificates found',
                'advanced_search.enter_search_name': 'Enter search name',
                'advanced_search.search_saved': 'Search saved',
                'advanced_search.query_note': 'ℹ️ This query is for reference only. Filtering is applied client-side on already loaded data.',
                
                // Vehicle Page
                'meta.vehicle.title': 'Vehicle Details - Service Hub Portal',
                'vehicle.page_title': 'Vehicle Details',
                'vehicle.page_subtitle': 'Complete vehicle information and history',
                'vehicle.open_details': 'Open vehicle details',
                'vehicle.certificate_number': 'Certificate #',
                'vehicle.basic_info': 'Basic Information',
                'vehicle.technical_details': 'Technical Details',
                'vehicle.device_info': 'Device Information',
                'vehicle.brand': 'Brand',
                'vehicle.model': 'Model',
                'vehicle.year': 'Year',
                'vehicle.plate': 'License Plate',
                'vehicle.fuel_type': 'Fuel Type',
                'vehicle.transmission': 'Transmission',
                'vehicle.odometer': 'Odometer',
                'vehicle.color': 'Color',
                'vehicle.device_id': 'Device ID',
                'vehicle.imei': 'IMEI',
                'vehicle.serial': 'Serial',
                'vehicle.installation_date': 'Installation Date',
                
                // Table Actions
                'table.actions': 'Actions',
                
                // Vehicle Analytics
                'vehicle.analytics.title': 'Vehicle Analytics',
                'vehicle.analytics.subtitle': 'Comprehensive performance and usage reports',
                'vehicle.analytics.period': 'Period',
                'vehicle.analytics.refresh': 'Refresh',
                'vehicle.analytics.battery_title': 'Battery Voltage',
                'vehicle.analytics.battery_subtitle': 'Daily average voltage (V)',
                'vehicle.analytics.distance_time_title': 'Distance & Time',
                'vehicle.analytics.distance_time_subtitle': 'Daily distance (km) and time (hours)',
                'vehicle.analytics.speed_title': 'Speed Analysis',
                'vehicle.analytics.speed_subtitle': 'Maximum daily speed (km/h)',
                'vehicle.analytics.activity_title': 'Activity Overview',
                'vehicle.analytics.activity_subtitle': 'Daily trips and events',
                'vehicle.analytics.health_title': 'System Health & Diagnostics',
                'vehicle.analytics.health_subtitle': 'OBD errors, crashes, and system positions',
                'vehicle.analytics.total_distance': 'Total Distance',
                'vehicle.analytics.total_trips': 'Total Trips',
                'vehicle.analytics.driving_time': 'Driving Time',
                'vehicle.analytics.average_speed': 'Average Speed',
                'vehicle.analytics.average_battery': 'Average Battery',
                'vehicle.analytics.fuel_consumed': 'Fuel Consumed',
                'vehicle.analytics.fuel_title': 'Fuel Consumption',
                'vehicle.analytics.fuel_subtitle': 'Daily fuel consumption patterns (L)',
                'vehicle.analytics.system_health_title': 'System Health & Diagnostics',
                'vehicle.analytics.engine_temp_title': 'Engine Temperature',
                'vehicle.analytics.rpm_engine_load_title': 'RPM & Engine Load',
                'vehicle.analytics.advanced_obd_title': 'Advanced OBD Parameters',
                'ai_report.title': 'AI Analysis Report',
                'ai_report.subtitle': 'Intelligent vehicle performance insights',
                'ai_report.vehicle_health': 'Vehicle Health',
                'ai_report.vehicle_health_subtitle': 'Overall condition',
                'ai_report.spike_analysis': 'Spike Analysis',
                'ai_report.spike_analysis_subtitle': 'OBD insights',
                'ai_report.maintenance': 'Maintenance',
                'ai_report.maintenance_subtitle': 'Service recommendations',
                'ai_report.performance': 'Performance',
                'ai_report.performance_subtitle': 'Driving patterns',
                'ai_report.potential_issues': 'Potential Issues',
                'ai_report.potential_issues_subtitle': 'Warning signs',
                'ai_report.opportunities': 'Opportunities',
                'ai_report.opportunities_subtitle': 'Business potential',
                'vehicle.tab_vehicle': 'Vehicle',
                'vehicle.tab_client': 'Client',
                'vehicle.tab_analytics': 'Analytics',
                'vehicle.back_to_certificates': 'Back to Certificates',
            }
        };
    }

    /**
     * Get translation for a key
     */
    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                          this.translations['en'][key] || 
                          key;
        
        // Replace parameters in translation
        let result = translation;
        Object.keys(params).forEach(param => {
            result = result.replace(`{${param}}`, params[param]);
        });
        
        return result;
    }

    /**
     * Change language and update entire interface
     */
    changeLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not supported`);
            return;
        }

        console.log('Changing language to:', lang);
        this.currentLanguage = lang;
        this.saveLanguage(lang);
        document.documentElement.lang = lang;
        
        // Update page title and meta tags
        this.updatePageMeta();
        
        // Update all translatable elements
        this.updateAllTranslations();
        
        // Force update any dynamically added bilingual elements
        this.forceUpdateBilingualElements();
        
        // Update language buttons if they exist
        this.updateLanguageButtons();
        
        // Update OBD parameters if they exist (for vehicle page)
        this.updateOBDParameters();
        
        // Update critical alerts if they exist (for vehicle page)
        this.updateCriticalAlerts();
        
        // Update summary stats if they exist (for vehicle page)
        this.updateSummaryStats();
    }

    /**
     * Update page title and meta tags based on current page
     */
    updatePageMeta() {
        const path = window.location.pathname;
        let titleKey = 'meta.dashboard.title';
        
        if (path.includes('certificates')) {
            titleKey = 'meta.certificates.title';
        } else if (path.includes('settings')) {
            titleKey = 'meta.settings.title';
        }
        
        document.title = this.t(titleKey);
        
        // Update meta description if exists
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', this.t('meta.description'));
        }
    }

    /**
     * Update all elements with data-i18n attributes
     */
    updateAllTranslations() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Update elements with data-i18n-title attribute (tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // Update elements with data-en and data-it attributes (new multilanguage system)
        const bilingualElements = document.querySelectorAll('[data-en][data-it]');
        
        bilingualElements.forEach(element => {
            const enText = element.getAttribute('data-en');
            const itText = element.getAttribute('data-it');
            const translation = this.currentLanguage === 'it' ? itText : enText;
            
            // Handle different element types
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    /**
     * Force update specific bilingual elements (useful for dynamically added content)
     */
    forceUpdateBilingualElements(container = document) {
        const bilingualElements = container.querySelectorAll('[data-en][data-it]');
        
        bilingualElements.forEach(element => {
            const enText = element.getAttribute('data-en');
            const itText = element.getAttribute('data-it');
            const translation = this.currentLanguage === 'it' ? itText : enText;
            
            // Handle different element types
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        return bilingualElements.length;
    }

    /**
     * Update language buttons state
     */
    updateLanguageButtons() {
        const langIT = document.getElementById('lang-it');
        const langEN = document.getElementById('lang-en');
        
        if (langIT && langEN) {
            // Check if we're on the settings page (different styling)
            const path = window.location.pathname;
            const isSettingsPage = path.includes('settings') || path.includes('setting_restored');
            
            if (isSettingsPage) {
                // Settings page buttons - align with theme buttons styling exactly
                const base = 'btn-theme px-4 py-2 rounded-lg transition-colors';
                const inactive = `${base} btn-theme-inactive`;
                const active = `${base} btn-theme-active`;

                // Reset both buttons to inactive
                langEN.className = inactive;
                langIT.className = inactive;

                // Set active button based on current language
                if (this.currentLanguage === 'en') {
                    langEN.className = active;
                } else if (this.currentLanguage === 'it') {
                    langIT.className = active;
                }
            } else {
                // Header buttons - original styling
                langEN.className = 'w-10 h-10 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center';
                langIT.className = 'w-10 h-10 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center';
                
                // Set active button based on current language
                if (this.currentLanguage === 'en') {
                    langEN.className = 'w-10 h-10 rounded-full text-sm font-medium bg-primary text-white transition-all duration-300 flex items-center justify-center';
                } else if (this.currentLanguage === 'it') {
                    langIT.className = 'w-10 h-10 rounded-full text-sm font-medium bg-primary text-white transition-all duration-300 flex items-center justify-center';
                }
            }
            
            console.log('Language buttons updated. Current language:', this.currentLanguage, 'Page:', window.location.pathname);
        }
    }
    
    /**
     * Update OBD parameters display when language changes
     */
    updateOBDParameters() {
        // Check if we're on the vehicle page and OBD parameters exist
        const obdContent = document.getElementById('obdParametersContent');
        if (obdContent && window.lastOBDData) {
            // Re-generate OBD parameters HTML with new language
            const newHTML = window.generateOBDParametersHTML(window.lastOBDData);
            if (newHTML) {
                obdContent.innerHTML = newHTML;
            }
        }
    }

    updateCriticalAlerts() {
        // Check if we're on the vehicle page and critical alerts exist
        const criticalAlertsContent = document.getElementById('criticalAlertsContent');
        if (criticalAlertsContent && window.lastCriticalAlertsData) {
            // Re-generate critical alerts HTML with new language
            const newHTML = window.generateCriticalAlertsHTML(window.lastCriticalAlertsData);
            if (newHTML) {
                criticalAlertsContent.innerHTML = newHTML;
            }
        }
    }

    /**
     * Update summary stats when language changes
     */
    updateSummaryStats() {
        // Check if we're on the vehicle page and summary stats exist
        if (typeof window.updateSummaryStats === 'function') {
            window.updateSummaryStats();
        }
    }

    /**
     * Initialize i18n system
     */
    init() {
        console.log('🌐 I18nManager initializing with language:', this.currentLanguage);
        
        // Apply current language immediately
        document.documentElement.lang = this.currentLanguage;
        
        // Wait for DOM to be ready, then update UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('🌐 DOM loaded, updating i18n...');
                this.updatePageMeta();
                this.updateAllTranslations();
                this.updateLanguageButtons();
                this.setupLanguageButtons();
                console.log('🌐 I18n initialization complete');
            });
        } else {
            console.log('🌐 DOM already ready, updating i18n immediately...');
            this.updatePageMeta();
            this.updateAllTranslations();
            this.updateLanguageButtons();
            this.setupLanguageButtons();
            console.log('🌐 I18n initialization complete');
        }
    }

    /**
     * Setup language button event listeners
     */
    setupLanguageButtons() {
        const langIT = document.getElementById('lang-it');
        const langEN = document.getElementById('lang-en');
        
        if (langIT) {
            langIT.addEventListener('click', () => this.changeLanguage('it'));
        }
        
        if (langEN) {
            langEN.addEventListener('click', () => this.changeLanguage('en'));
        }
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Create global i18n manager instance
window.i18n = new I18nManager();

// Expose t function globally for easy access
window.t = (key, params) => window.i18n.t(key, params);

// Expose changeLanguage function globally
window.changeLanguage = (lang) => window.i18n.changeLanguage(lang);

// Expose forceUpdateBilingualElements function globally
window.forceUpdateBilingualElements = (container) => window.i18n.forceUpdateBilingualElements(container); 