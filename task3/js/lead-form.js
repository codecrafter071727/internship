import { saveLead, markFormAsShown } from './storage.js';

const modal = document.getElementById('lead-modal');
const form = document.getElementById('lead-form');

export const setupForm = () => {
    // Close modal logic
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.onclick = () => modal.classList.remove('active');
    });

    form.onsubmit = (e) => {
        e.preventDefault();
        
        if (validate()) {
            const data = Object.fromEntries(new FormData(form));
            saveLead(data);
            
            // Show success
            form.style.display = 'none';
            document.getElementById('success-message').classList.remove('hidden');
            
            setTimeout(() => modal.classList.remove('active'), 3000);
        }
    };
};

export const openModal = () => {
    modal.classList.add('active');
    markFormAsShown();
};

function validate() {
    let isValid = true;
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        const error = document.getElementById(`${input.id}-error`);
        if (!input.value.trim()) {
            error.textContent = 'This field is required';
            isValid = false;
        } else {
            error.textContent = '';
        }
    });

    return isValid;
}
