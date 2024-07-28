// modal.js
export function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
}

export function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
}
