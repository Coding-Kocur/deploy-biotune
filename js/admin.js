// Admin Panel Logic
let productsData = window.productsData || [];
let productChanges = {};

document.addEventListener('DOMContentLoaded', () => {
    loadProductsTable();
});

function loadProductsTable() {
    const tableBody = document.getElementById('products-table');

    if (!productsData || productsData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Brak produktów do wyświetlenia</td></tr>';
        return;
    }

    tableBody.innerHTML = productsData.map((product, index) => `
        <tr class="hover:bg-black/5 dark:hover:bg-white/5">
            <td class="font-mono text-sm">${product.id}</td>
            <td class="font-semibold">${product.name}</td>
            <td>${product.dosage}</td>
            <td>
                <input type="number" 
                       value="${product.price}" 
                       step="0.01"
                       class="admin-input w-24"
                       onchange="updateProduct('${product.id}', 'price', parseFloat(this.value))">
            </td>
            <td>
                <input type="number" 
                       value="${product.stock}" 
                       class="admin-input w-20"
                       onchange="updateProduct('${product.id}', 'stock', parseInt(this.value))">
            </td>
            <td>
                <button onclick="deleteProduct('${product.id}')" 
                        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm">
                    🗑️ Usuń
                </button>
            </td>
        </tr>
    `).join('');
}

function updateProduct(productId, field, value) {
    if (!productChanges[productId]) {
        productChanges[productId] = {};
    }
    productChanges[productId][field] = value;

    // Show indicator that there are unsaved changes
    const saveBtn = document.querySelector('button[onclick="saveChanges()"]');
    if (saveBtn && !saveBtn.classList.contains('animate-pulse')) {
        saveBtn.classList.add('animate-pulse');
        saveBtn.innerHTML = '💾 Zapisz Zmiany (Niezapisane zmiany!)';
    }
}

function saveChanges() {
    // Apply all changes to productsData
    Object.keys(productChanges).forEach(productId => {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            Object.assign(product, productChanges[productId]);
        }
    });

    // Generate updated products-data.js content
    const jsContent = generateProductsDataJS();

    // Download as file
    const blob = new Blob([jsContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-data.js';
    a.click();
    URL.revokeObjectURL(url);

    // Reset changes
    productChanges = {};

    // Update button
    const saveBtn = document.querySelector('button[onclick="saveChanges()"]');
    saveBtn.classList.remove('animate-pulse');
    saveBtn.innerHTML = '✅ Zmiany Zapisane!';

    setTimeout(() => {
        saveBtn.innerHTML = '💾 Zapisz Zmiany';
    }, 3000);

    // Reload table
    loadProductsTable();
}

function deleteProduct(productId) {
    if (!confirm(`Czy na pewno chcesz usunąć produkt: ${productId}?`)) {
        return;
    }

    productsData = productsData.filter(p => p.id !== productId);
    loadProductsTable();

    // Mark as changed
    const saveBtn = document.querySelector('button[onclick="saveChanges()"]');
    saveBtn.classList.add('animate-pulse');
    saveBtn.innerHTML = '💾 Zapisz Zmiany (Niezapisane zmiany!)';
}

function addNewProduct() {
    const newProduct = {
        id: document.getElementById('new-product-id').value.trim(),
        name: document.getElementById('new-product-name').value.trim(),
        dosage: document.getElementById('new-product-dosage').value.trim(),
        price: parseFloat(document.getElementById('new-product-price').value) || 0,
        stock: parseInt(document.getElementById('new-product-stock').value) || 0,
        description: document.getElementById('new-product-description').value.trim(),
        images: [`./assets/products/${document.getElementById('new-product-id').value.trim()}-1.jpg`]
    };

    // Validation
    if (!newProduct.id || !newProduct.name) {
        alert('Wypełnij przynajmniej ID i nazwę produktu!');
        return;
    }

    // Check if ID already exists
    if (productsData.find(p => p.id === newProduct.id)) {
        alert('Produkt o tym ID już istnieje!');
        return;
    }

    productsData.push(newProduct);
    loadProductsTable();

    // Clear form
    document.getElementById('new-product-id').value = '';
    document.getElementById('new-product-name').value = '';
    document.getElementById('new-product-dosage').value = '';
    document.getElementById('new-product-price').value = '';
    document.getElementById('new-product-stock').value = '';
    document.getElementById('new-product-description').value = '';

    // Mark as changed
    const saveBtn = document.querySelector('button[onclick="saveChanges()"]');
    saveBtn.classList.add('animate-pulse');
    saveBtn.innerHTML = '💾 Zapisz Zmiany (Niezapisane zmiany!)';

    alert(`Produkt "${newProduct.name}" został dodany! Nie zapomnij zapisać zmian.`);
}

function exportData() {
    const jsContent = generateProductsDataJS();
    const blob = new Blob([jsContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-data-backup-${new Date().toISOString().split('T')[0]}.js`;
    a.click();
    URL.revokeObjectURL(url);

    alert('Dane wyeksportowane!');
}

function generateProductsDataJS() {
    return `const products = ${JSON.stringify(productsData, null, 4)};

// Export for use in other files if using modules, or just global for simple script tags
window.productsData = products;
`;
}

// Make functions globally available
window.updateProduct = updateProduct;
window.saveChanges = saveChanges;
window.deleteProduct = deleteProduct;
window.addNewProduct = addNewProduct;
window.exportData = exportData;
