"use strict";
const sortableData = [
    { name: 'Wireless Mouse', category: 'Electronics', price: 19.99 },
    { name: 'Novel Book', category: 'Books', price: 9.49 },
    { name: 'T-Shirt', category: 'Clothing', price: 15.0 },
    { name: 'Building Blocks', category: 'Toys', price: 25.5 },
    { name: 'Desk Lamp', category: 'Home', price: 22.0 }
];
let sortState = { key: 'name', asc: true };
function renderSortableTable() {
    const tbody = document.getElementById('sortableTableBody');
    if (!tbody)
        return;
    const sorted = [...sortableData].sort((a, b) => {
        const dir = sortState.asc ? 1 : -1;
        return a[sortState.key] > b[sortState.key] ? dir : a[sortState.key] < b[sortState.key] ? -dir : 0;
    });
    tbody.innerHTML = sorted.map(r => `<tr><td>${r.name}</td><td>${r.category}</td><td>$${r.price.toFixed(2)}</td></tr>`).join('');
}
document.querySelectorAll('#sortableTable th[data-key]').forEach(th => {
    th.addEventListener('click', () => {
        const key = th.dataset.key;
        sortState = sortState.key === key ? { key, asc: !sortState.asc } : { key, asc: true };
        renderSortableTable();
    });
});
renderSortableTable();
// Paginated table
const allItems = Array.from({ length: 47 }, (_, i) => `Item ${i + 1}`);
const pageSize = 10;
let currentPage = 1;
function renderPaginatedTable() {
    const tbody = document.getElementById('paginatedTableBody');
    const indicator = document.getElementById('pageIndicator');
    if (!tbody || !indicator)
        return;
    const totalPages = Math.ceil(allItems.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const pageItems = allItems.slice(start, start + pageSize);
    tbody.innerHTML = pageItems.map((item, i) => `<tr><td>${start + i + 1}</td><td>${item}</td></tr>`).join('');
    indicator.textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
}
document.getElementById('prevPageBtn')?.addEventListener('click', () => { if (currentPage > 1) {
    currentPage--;
    renderPaginatedTable();
} });
document.getElementById('nextPageBtn')?.addEventListener('click', () => {
    const totalPages = Math.ceil(allItems.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderPaginatedTable();
    }
});
renderPaginatedTable();
// Expandable rows
document.querySelectorAll('.expand-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const row = targetId ? document.getElementById(targetId) : null;
        if (row) {
            row.hidden = !row.hidden;
            btn.textContent = row.hidden ? '+' : '-';
        }
    });
});
// Inline editable rows
document.querySelectorAll('.edit-row-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        if (!row)
            return;
        const cells = row.querySelectorAll('.editable-cell');
        const isEditing = btn.textContent === 'Save';
        cells.forEach(cell => cell.setAttribute('contenteditable', String(!isEditing)));
        btn.textContent = isEditing ? 'Edit' : 'Save';
    });
});
// Row selection with select-all
const selectAll = document.getElementById('selectAll');
const rowCheckboxes = document.querySelectorAll('.row-checkbox');
const selectionCount = document.getElementById('selectionCount');
function updateSelectionCount() {
    const checked = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
    if (selectionCount)
        selectionCount.textContent = `${checked} selected`;
}
selectAll?.addEventListener('change', () => {
    rowCheckboxes.forEach(cb => (cb.checked = selectAll.checked));
    updateSelectionCount();
});
rowCheckboxes.forEach(cb => cb.addEventListener('change', updateSelectionCount));
//# sourceMappingURL=tables.js.map