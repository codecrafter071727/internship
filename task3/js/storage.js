// Storage helpers for lead data and session tracking

export const saveLead = (data) => {
    const leads = getLeads();
    leads.push({ ...data, date: new Date().toLocaleString() });
    localStorage.setItem('leads', JSON.stringify(leads));
};

export const getLeads = () => {
    const data = localStorage.getItem('leads');
    return data ? JSON.parse(data) : [];
};

export const markFormAsShown = () => {
    sessionStorage.setItem('form_shown', 'true');
};

export const wasFormShown = () => {
    return sessionStorage.getItem('form_shown') === 'true';
};
