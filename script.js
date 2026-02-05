// ================================
// Command Legacy Form Handling
// ================================

// Configuration
const CONFIG = {
    // Google Sheets webhook URLs (YOU NEED TO ADD THESE)
    UPDATES_SHEET_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_FOR_UPDATES',
    BETA_SHEET_URL: 'https://hooks.airtable.com/workflows/v1/genericWebhook/appzKSF49Zzmppf2w/wflUGXhArOF7GgtoA/wtrhct2WYHSp3lH2L',
    
    // Email endpoint for beta form
    BETA_EMAIL_ENDPOINT: 'https://formsubmit.co/betausers@commandlegacy.io',
};

// ================================
// Email Updates Form Handler
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const updatesForm = document.getElementById('updates-form');
    
    if (updatesForm) {
        updatesForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email-updates');
            const email = emailInput.value.trim();
            const confirmationDiv = document.getElementById('updates-confirmation');
            const submitButton = updatesForm.querySelector('button[type="submit"]');
            
            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            try {
                // Submit to Google Sheets
                const response = await fetch(CONFIG.UPDATES_SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        timestamp: new Date().toISOString(),
                        type: 'updates'
                    })
                });
                
                // Show confirmation
                emailInput.value = '';
                updatesForm.style.display = 'none';
                confirmationDiv.classList.remove('hidden');
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error subscribing. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = 'Subscribe';
            }
        });
    }
});

// ================================
// Beta Signup Form Handler
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const betaForm = document.getElementById('beta-form');
    
    if (betaForm) {
        betaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                personal_email: document.getElementById('personal-email').value.trim(),
                work_email: document.getElementById('work-email').value.trim(),
                department: document.getElementById('department').value.trim(),
                jurisdiction: document.getElementById('jurisdiction').value.trim(),
                rank: document.getElementById('rank').value.trim(),
                years: document.getElementById('years').value.trim(),
                timestamp: new Date().toISOString()
            };
            
            const confirmationDiv = document.getElementById('beta-confirmation');
            const errorDiv = document.getElementById('beta-error');
            const submitButton = betaForm.querySelector('button[type="submit"]');
            
            // Hide any previous messages
            confirmationDiv.classList.add('hidden');
            errorDiv.classList.add('hidden');
            
            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            try {
                // Submit to both Google Sheets and Email
                const promises = [
                    // Google Sheets
                    fetch(CONFIG.BETA_SHEET_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    }),
                    
                    // Email via FormSubmit
                    fetch(CONFIG.BETA_EMAIL_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            ...formData,
                            _subject: 'New Beta Access Request - Command Legacy',
                            _template: 'table',
                            _captcha: 'false'
                        })
                    })
                ];
                
                await Promise.all(promises);
                
                // Show confirmation and hide form
                betaForm.style.display = 'none';
                confirmationDiv.classList.remove('hidden');
                
            } catch (error) {
                console.error('Error submitting form:', error);
                errorDiv.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Application';
            }
        });
    }
});

// ================================
// Smooth Scrolling for Anchor Links
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ================================
// Form Validation Enhancement
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.style.borderColor = 'var(--color-error)';
                } else {
                    this.style.borderColor = 'var(--color-border)';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'var(--color-error)' && this.value.trim() !== '') {
                    this.style.borderColor = 'var(--color-border)';
                }
            });
        });
    });
});
