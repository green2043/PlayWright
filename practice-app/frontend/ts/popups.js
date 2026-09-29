import { showToast } from './common.js';
const nativeDialogResult = document.getElementById('nativeDialogResult');
document.getElementById('alertBtn')?.addEventListener('click', () => {
    alert('This is a native alert!');
    if (nativeDialogResult)
        nativeDialogResult.textContent = 'Alert was dismissed';
});
document.getElementById('confirmBtn')?.addEventListener('click', () => {
    const result = confirm('Do you confirm this action?');
    if (nativeDialogResult)
        nativeDialogResult.textContent = `Confirm result: ${result}`;
});
document.getElementById('promptBtn')?.addEventListener('click', () => {
    const result = prompt('Please enter your name:', 'Guest');
    if (nativeDialogResult)
        nativeDialogResult.textContent = `Prompt result: ${result}`;
});
// Custom modal
const customModalOverlay = document.getElementById('customModalOverlay');
document.getElementById('openModalBtn')?.addEventListener('click', () => { if (customModalOverlay)
    customModalOverlay.hidden = false; });
document.getElementById('closeCustomModalBtn')?.addEventListener('click', () => { if (customModalOverlay)
    customModalOverlay.hidden = true; });
// Native <dialog>
const nativeDialog = document.getElementById('nativeDialog');
document.getElementById('openNativeDialogBtn')?.addEventListener('click', () => nativeDialog?.showModal());
document.getElementById('closeNativeDialogBtn')?.addEventListener('click', () => nativeDialog?.close());
// Nested modals
const parentModalOverlay = document.getElementById('parentModalOverlay');
const childModalOverlay = document.getElementById('childModalOverlay');
document.getElementById('openParentModalBtn')?.addEventListener('click', () => { if (parentModalOverlay)
    parentModalOverlay.hidden = false; });
document.getElementById('closeParentModalBtn')?.addEventListener('click', () => { if (parentModalOverlay)
    parentModalOverlay.hidden = true; });
document.getElementById('openChildModalBtn')?.addEventListener('click', () => { if (childModalOverlay)
    childModalOverlay.hidden = false; });
document.getElementById('closeChildModalBtn')?.addEventListener('click', () => { if (childModalOverlay)
    childModalOverlay.hidden = true; });
// Toasts
document.getElementById('toastInfoBtn')?.addEventListener('click', () => showToast('This is an info toast', 'info'));
document.getElementById('toastSuccessBtn')?.addEventListener('click', () => showToast('Success! Action completed.', 'success'));
document.getElementById('toastErrorBtn')?.addEventListener('click', () => showToast('Error! Something went wrong.', 'error'));
// Custom context menu
const contextMenuTarget = document.getElementById('contextMenuTarget');
const customContextMenu = document.getElementById('customContextMenu');
contextMenuTarget?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!customContextMenu)
        return;
    customContextMenu.hidden = false;
    customContextMenu.style.left = `${e.pageX}px`;
    customContextMenu.style.top = `${e.pageY}px`;
});
document.addEventListener('click', () => { if (customContextMenu)
    customContextMenu.hidden = true; });
//# sourceMappingURL=popups.js.map