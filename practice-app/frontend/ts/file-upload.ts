import { showToast } from './common.js';

async function uploadFiles(formData: FormData, endpoint: string): Promise<any> {
  const res = await fetch(endpoint, { method: 'POST', body: formData });
  return res.json();
}

document.getElementById('singleUploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('singleFileInput') as HTMLInputElement;
  const result = document.getElementById('singleUploadResult');
  if (!input.files || input.files.length === 0) {
    if (result) result.textContent = 'Please choose a file first.';
    return;
  }
  const formData = new FormData();
  formData.append('file', input.files[0]);
  try {
    const data = await uploadFiles(formData, '/api/files/upload');
    if (result) result.textContent = `Uploaded: ${data.originalName} (${data.size} bytes)`;
    showToast('File uploaded successfully', 'success');
  } catch {
    if (result) result.textContent = 'Upload failed.';
    showToast('Upload failed', 'error');
  }
});

document.getElementById('multiUploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('multiFileInput') as HTMLInputElement;
  const result = document.getElementById('multiUploadResult');
  if (!input.files || input.files.length === 0) {
    if (result) result.textContent = 'Please choose files first.';
    return;
  }
  const formData = new FormData();
  Array.from(input.files).forEach(f => formData.append('files', f));
  try {
    const data = await uploadFiles(formData, '/api/files/upload-multiple');
    if (result) result.textContent = `Uploaded ${data.files.length} file(s).`;
    showToast('Files uploaded successfully', 'success');
  } catch {
    if (result) result.textContent = 'Upload failed.';
    showToast('Upload failed', 'error');
  }
});

// Drag and drop zone
const dropZone = document.getElementById('dropZone');
const dropZoneInput = document.getElementById('dropZoneInput') as HTMLInputElement | null;
const dropZoneResult = document.getElementById('dropZoneResult');

dropZone?.addEventListener('click', () => dropZoneInput?.click());
dropZone?.addEventListener('dragover', (e) => e.preventDefault());
dropZone?.addEventListener('drop', async (e) => {
  e.preventDefault();
  const files = (e as DragEvent).dataTransfer?.files;
  if (!files || files.length === 0) return;
  const formData = new FormData();
  formData.append('file', files[0]);
  try {
    const data = await uploadFiles(formData, '/api/files/upload');
    if (dropZoneResult) dropZoneResult.textContent = `Dropped & uploaded: ${data.originalName}`;
    showToast('File uploaded via drag-drop', 'success');
  } catch {
    if (dropZoneResult) dropZoneResult.textContent = 'Upload failed.';
  }
});

dropZoneInput?.addEventListener('change', async () => {
  if (!dropZoneInput.files || dropZoneInput.files.length === 0) return;
  const formData = new FormData();
  formData.append('file', dropZoneInput.files[0]);
  try {
    const data = await uploadFiles(formData, '/api/files/upload');
    if (dropZoneResult) dropZoneResult.textContent = `Uploaded: ${data.originalName}`;
  } catch {
    if (dropZoneResult) dropZoneResult.textContent = 'Upload failed.';
  }
});
