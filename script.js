// Variables globales
let currentLoanData = {
    projectType: '',
    requestedAmount: 15000,
    guaranteeRate: 7,
    guaranteeTax: 1050,
    netAmount: 13950
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoanCalculator();
    initializeMobileMenu();
});

// Navigation entre pages
function goToPage(page) {
    window.location.href = page;
}

// Gestion du menu mobile
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
        });
        
        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }
}

// Fonction pour basculer le menu mobile
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Initialisation du calculateur de prêt
function initializeLoanCalculator() {
    const loanAmountSlider = document.getElementById('loanAmount');
    const amountValue = document.getElementById('amountValue');
    const form = document.getElementById('loanCalculatorForm');
    
    if (loanAmountSlider && amountValue) {
        // Mise à jour en temps réel du montant
        loanAmountSlider.addEventListener('input', function() {
            const amount = parseInt(this.value);
            updateLoanCalculation(amount);
        });
        
        // Initialisation avec la valeur par défaut
        updateLoanCalculation(15000);
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLoanCalculatorSubmit();
        });
    }
}

// Mise à jour des calculs de prêt
function updateLoanCalculation(amount) {
    // Calcul du taux de garantie basé sur le montant
    const guaranteeRate = amount < 20000 ? 7 : 5;
    const guaranteeTax = Math.round(amount * (guaranteeRate / 100));
    const netAmount = amount - guaranteeTax;
    
    // Mise à jour des données globales
    currentLoanData = {
        ...currentLoanData,
        requestedAmount: amount,
        guaranteeRate: guaranteeRate,
        guaranteeTax: guaranteeTax,
        netAmount: netAmount
    };
    
    // Mise à jour de l'affichage
    const amountValue = document.getElementById('amountValue');
    const requestedAmount = document.getElementById('requestedAmount');
    const guaranteeRateDisplay = document.getElementById('guaranteeRate');
    const guaranteeTaxDisplay = document.getElementById('guaranteeTax');
    const netAmountDisplay = document.getElementById('netAmount');
    
    if (amountValue) {
        amountValue.textContent = formatCurrency(amount);
    }
    
    if (requestedAmount) {
        requestedAmount.textContent = formatCurrency(amount);
    }
    
    if (guaranteeRateDisplay) {
        guaranteeRateDisplay.textContent = guaranteeRate;
    }
    
    if (guaranteeTaxDisplay) {
        guaranteeTaxDisplay.textContent = `-${formatCurrency(guaranteeTax)}`;
    }
    
    if (netAmountDisplay) {
        netAmountDisplay.textContent = formatCurrency(netAmount);
    }
}

// Formatage des montants en euros
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Soumission du formulaire de calcul
function handleLoanCalculatorSubmit() {
    const projectType = document.getElementById('projectType').value;
    
    if (!projectType) {
        alert('Bitte wählen Sie einen Projekttyp');
        return;
    }
    
    // Mise à jour des données avec le type de projet
    currentLoanData.projectType = projectType;
    
    // Sauvegarde dans le localStorage pour les pages suivantes
    localStorage.setItem('loanData', JSON.stringify(currentLoanData));
    
    // Redirection vers la page de confirmation de garantie
    goToPage('guarantee.html');
}

// Traduction des types de projets
function getProjectTypeLabel(type) {
    const types = {
        'tresorerie': 'Liquidität',
        'vehicule-neuf': 'Neues Fahrzeug',
        'vehicule-occasion': 'Gebrauchtes Fahrzeug',
        'travaux': 'Arbeiten und Hausverbesserung',
        'electromenager': 'Haushaltsgeräte',
        'mariage': 'Hochzeit',
        'voyage': 'Reise, Urlaub',
        'demenagement': 'Umzug',
        'autres': 'Andere'
    };
    return types[type] || type;
}

// Chargement des données de garantie
function loadGuaranteeData() {
    const savedData = localStorage.getItem('loanData');
    if (!savedData) {
        goToPage('index.html');
        return;
    }
    
    const loanData = JSON.parse(savedData);
    
    // Simulation d'un délai de chargement
    const loadingState = document.getElementById('loadingState');
    const guaranteeDetails = document.getElementById('guaranteeDetails');
    
    if (loadingState && guaranteeDetails) {
        loadingState.style.display = 'block';
        guaranteeDetails.style.display = 'none';
        
        setTimeout(() => {
            loadingState.style.display = 'none';
            guaranteeDetails.style.display = 'block';
            
            // Mise à jour des données affichées
            updateGuaranteeDisplay(loanData);
        }, 1500);
    } else {
        updateGuaranteeDisplay(loanData);
    }
}

// Mise à jour de l'affichage de garantie
function updateGuaranteeDisplay(loanData) {
    const projectTypeDisplay = document.getElementById('projectTypeDisplay');
    const requestedAmountDisplay = document.getElementById('requestedAmountDisplay');
    const guaranteeRateDisplay = document.getElementById('guaranteeRateDisplay');
    const guaranteeTaxDisplay = document.getElementById('guaranteeTaxDisplay');
    const netAmountDisplay = document.getElementById('netAmountDisplay');
    
    if (projectTypeDisplay) {
        projectTypeDisplay.textContent = getProjectTypeLabel(loanData.projectType);
    }
    
    if (requestedAmountDisplay) {
        requestedAmountDisplay.textContent = formatCurrency(loanData.requestedAmount);
    }
    
    if (guaranteeRateDisplay) {
        guaranteeRateDisplay.textContent = `${loanData.guaranteeRate}%`;
    }
    
    if (guaranteeTaxDisplay) {
        guaranteeTaxDisplay.textContent = `-${formatCurrency(loanData.guaranteeTax)}`;
    }
    
    if (netAmountDisplay) {
        netAmountDisplay.textContent = formatCurrency(loanData.netAmount);
    }
}

// Initialisation du formulaire de demande
function initializeApplicationForm() {
    const savedData = localStorage.getItem('loanData');
    if (!savedData) {
        goToPage('index.html');
        return;
    }
    
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('submit', handleApplicationSubmit);
    }
}

// Soumission du formulaire de demande
function handleApplicationSubmit(e) {
    e.preventDefault();
    
    // Validation basique
    const form = e.target;
    const formData = new FormData(form);
    
    // Vérification que tous les champs requis sont remplis
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim() && field.type !== 'checkbox') {
            field.style.borderColor = 'var(--destructive)';
            isValid = false;
        } else if (field.type === 'checkbox' && !field.checked) {
            field.parentElement.style.borderColor = 'var(--destructive)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--border)';
            if (field.type === 'checkbox') {
                field.parentElement.style.borderColor = 'var(--border)';
            }
        }
    });
    
    if (!isValid) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus.');
        return;
    }
    
    // Simulation de l'envoi
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-spinner" style="width: 1rem; height: 1rem; margin-right: 0.5rem;"></div>Wird bearbeitet...';
    submitBtn.disabled = true;
    
    // Collecte des données du formulaire
    const applicationData = {
        ...JSON.parse(localStorage.getItem('loanData')),
        civility: form.civility.value,
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        birthDate: form.birthDate.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        postalCode: form.postalCode.value,
        city: form.city.value,
        profession: form.profession.value,
        monthlyIncome: parseInt(form.monthlyIncome.value),
        iban: form.iban.value,
        bic: form.bic.value,
        accountHolder: form.accountHolder.value,
        bankName: form.bankName.value,
        idCard: form.idCard.files[0]?.name || '',
        selfie: form.selfie.files[0]?.name || '',
        proofOfAddress: form.proofOfAddress.files[0]?.name || '',
        acceptTerms: form.acceptTerms.checked,
        submissionDate: new Date().toISOString(),
        applicationId: 'CR-' + Date.now()
    };
    
    // Simulation d'une requête API
    setTimeout(() => {
        // Sauvegarde des données de demande
        localStorage.setItem('applicationData', JSON.stringify(applicationData));
        
        // Nettoyage des données de prêt
        localStorage.removeItem('loanData');
        
        // Redirection vers la page de succès
        goToPage('success.html');
    }, 2000);
}

// Chargement des données de succès
function loadSuccessData() {
    const savedData = localStorage.getItem('applicationData');
    if (!savedData) {
        // Si pas de données, utiliser des données par défaut pour la démonstration
        const defaultData = {
            projectType: 'vehicule-neuf',
            requestedAmount: 25000,
            guaranteeRate: 5,
            guaranteeTax: 1250,
            netAmount: 23750
        };
        updateSuccessDisplay(defaultData);
        return;
    }
    
    const applicationData = JSON.parse(savedData);
    updateSuccessDisplay(applicationData);
}

// Mise à jour de l'affichage de succès
function updateSuccessDisplay(data) {
    const projectTypeElement = document.getElementById('successProjectType');
    const requestedAmountElement = document.getElementById('successRequestedAmount');
    const guaranteeRateElement = document.getElementById('successGuaranteeRate');
    const guaranteeTaxElement = document.getElementById('successGuaranteeTax');
    const netAmountElement = document.getElementById('successNetAmount');
    
    if (projectTypeElement) {
        projectTypeElement.textContent = getProjectTypeLabel(data.projectType);
    }
    
    if (requestedAmountElement) {
        requestedAmountElement.textContent = formatCurrency(data.requestedAmount);
    }
    
    if (guaranteeRateElement) {
        guaranteeRateElement.textContent = data.guaranteeRate;
    }
    
    if (guaranteeTaxElement) {
        guaranteeTaxElement.textContent = `-${formatCurrency(data.guaranteeTax)}`;
    }
    
    if (netAmountElement) {
        netAmountElement.textContent = formatCurrency(data.netAmount);
    }
}

// Fonction pour envoyer des emails
function sendEmail(type) {
    const email = 'enricamassonef@gmail.com';
    let subject, body;
    
    if (type === 'contact') {
        subject = 'Kontaktanfrage - CreditExpress';
        body = 'Hallo,\n\nIch möchte zusätzliche Informationen über Ihre Kreditdienstleistungen erhalten.\n\nMit freundlichen Grüßen,';
    } else {
        subject = 'Support-Anfrage - CreditExpress';
        body = 'Hallo,\n\nIch benötige Hilfe bezüglich:\n\n[Beschreiben Sie Ihr Problem]\n\nMit freundlichen Grüßen,';
    }
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// Nouvelle demande (nettoyage complet)
function newApplication() {
    localStorage.removeItem('loanData');
    localStorage.removeItem('applicationData');
    goToPage('index.html');
}

// Fonction utilitaire pour debug
function logLoanData() {
    console.log('Current Loan Data:', currentLoanData);
    console.log('LocalStorage loanData:', localStorage.getItem('loanData'));
    console.log('LocalStorage applicationData:', localStorage.getItem('applicationData'));
}