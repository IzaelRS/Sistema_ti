// Centralized UI Utilities
export const dom = {
    show(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.classList.remove('hidden');
    },

    hide(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.classList.add('hidden');
    },

    toggle(elementId, force) {
        const el = document.getElementById(elementId);
        if (el) el.classList.toggle('hidden', force);
    },

    setText(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) el.innerText = text;
    },

    setValue(elementId, value) {
        const el = document.getElementById(elementId);
        if (el) el.value = value;
    },

    getValue(elementId) {
        const el = document.getElementById(elementId);
        return el ? el.value : null;
    },

    on(elementId, event, handler) {
        const el = document.getElementById(elementId);
        if (el) el.addEventListener(event, handler);
    }
};
