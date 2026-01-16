const API_URL = 'http://localhost:3000/api';

let products = [];
let customers = [];
let orders = [];
let users = [];
let editingProductId = null;
let editingCustomerId = null;
let editingOrderId = null;
let editingUserId = null;
let currentUserRole = null;

document.addEventListener('DOMContentLoaded', async () => {
    await checkUserRole();
    setupTabs();
    setupEvents();
    loadData();
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const tabName = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName).classList.add('active');

            if (tabName === 'products') {
                await loadProducts();
            } else if (tabName === 'customers') {
                await loadCustomers();
            } else if (tabName === 'orders') {
                await loadProducts();
                await loadCustomers();
                await loadOrders();
            } else if (tabName === 'search') {
                await loadProducts();
                await loadCustomers();
                await updateSearchSelects();
            } else if (tabName === 'users') {
                await loadUsers();
            }
        });
    });
}

function setupEvents() {
    document.getElementById('productForm').addEventListener('submit', saveProduct);
    document.getElementById('btnCancelProduct').addEventListener('click', cancelProductEdit);
    document.getElementById('customerForm').addEventListener('submit', saveCustomer);
    document.getElementById('btnCancelCustomer').addEventListener('click', cancelCustomerEdit);
    document.getElementById('orderForm').addEventListener('submit', saveOrder);
    document.getElementById('btnCancelOrder').addEventListener('click', cancelOrderEdit);
    document.getElementById('btnAddItem').addEventListener('click', addOrderItem);
    document.getElementById('searchForm').addEventListener('submit', searchOrders);
    document.getElementById('btnClearSearch').addEventListener('click', clearSearch);
    document.getElementById('btnLogout').addEventListener('click', handleLogout);
    
    const userForm = document.getElementById('userForm');
    const btnCancelUser = document.getElementById('btnCancelUser');
    if (userForm) userForm.addEventListener('submit', saveUser);
    if (btnCancelUser) btnCancelUser.addEventListener('click', cancelUserEdit);
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        products = await response.json();
        renderProducts();
        updateProductSelects();
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Error loading products!');
    }
}

function updateProductSelects() {
    const selects = document.querySelectorAll('.item-product');
    selects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = '';
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Select a product';
        select.appendChild(emptyOption);
        products.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.name} - $ ${p.value.toFixed(2)}`;
            if (p.id === selectedValue) option.selected = true;
            select.appendChild(option);
        });
    });
}

function renderProducts() {
    const list = document.getElementById('productList');
    list.innerHTML = '';
    
    if (products.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No products registered';
        list.appendChild(emptyMsg);
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = product.name;
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        if (isAdmin()) {
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn-edit';
            btnEdit.textContent = 'Edit';
            btnEdit.onclick = () => editProduct(product.id);
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete';
            btnDelete.textContent = 'Delete';
            btnDelete.onclick = () => deleteProduct(product.id);
            
            actions.appendChild(btnEdit);
            actions.appendChild(btnDelete);
        }
        
        header.appendChild(title);
        if (isAdmin()) {
            header.appendChild(actions);
        }
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const idDiv = document.createElement('div');
        idDiv.textContent = `ID: ${product.id}`;
        
        const valueDiv = document.createElement('div');
        valueDiv.className = 'item-value';
        valueDiv.textContent = `$ ${product.value.toFixed(2)}`;
        
        info.appendChild(idDiv);
        info.appendChild(valueDiv);
        
        card.appendChild(header);
        card.appendChild(info);
        
        list.appendChild(card);
    });
}

async function saveProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const value = document.getElementById('productValue').value;
    
    const data = {
        name: name,
        value: parseFloat(value)
    };
    
    try {
        let response;
        const isEditing = editingProductId;
        if (isEditing) {
            response = await fetch(`${API_URL}/products/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
            cancelProductEdit();
            await loadProducts();
            await loadOrders();
            updateProductSelects();
            alert(isEditing ? 'Product updated!' : 'Product created!');
        } else {
            alert(result.message || 'Error saving product!');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product!');
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productValue').value = product.value;
    document.getElementById('btnSaveProduct').textContent = 'Update Product';
    document.getElementById('btnCancelProduct').style.display = 'inline-block';
    document.querySelector('#products .section').scrollIntoView({ behavior: 'smooth' });
}

function cancelProductEdit() {
    editingProductId = null;
    document.getElementById('productForm').reset();
    document.getElementById('btnSaveProduct').textContent = 'Save Product';
    document.getElementById('btnCancelProduct').style.display = 'none';
}

async function deleteProduct(id) {
    if (!confirm('Do you really want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
            await loadProducts();
            await loadOrders();
            updateProductSelects();
            alert('Product deleted!');
        } else {
            alert(result.message || 'Error deleting product!');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product!');
    }
}

async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        customers = await response.json();
        renderCustomers();
        updateCustomerSelect();
    } catch (error) {
        console.error('Error loading customers:', error);
        alert('Error loading customers!');
    }
}

function renderCustomers() {
    const list = document.getElementById('customerList');
    list.innerHTML = '';
    
    if (customers.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No customers registered';
        list.appendChild(emptyMsg);
        return;
    }
    
    customers.forEach(customer => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = customer.name;
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        if (isAdmin()) {
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn-edit';
            btnEdit.textContent = 'Edit';
            btnEdit.onclick = () => editCustomer(customer.id);
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete';
            btnDelete.textContent = 'Delete';
            btnDelete.onclick = () => deleteCustomer(customer.id);
            
            actions.appendChild(btnEdit);
            actions.appendChild(btnDelete);
        }
        
        header.appendChild(title);
        if (isAdmin()) {
            header.appendChild(actions);
        }
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const idDiv = document.createElement('div');
        idDiv.textContent = `ID: ${customer.id}`;
        
        const emailDiv = document.createElement('div');
        emailDiv.textContent = `E-mail: ${customer.email}`;
        
        info.appendChild(idDiv);
        info.appendChild(emailDiv);
        
        card.appendChild(header);
        card.appendChild(info);
        
        list.appendChild(card);
    });
}

function updateCustomerSelect() {
    const select = document.getElementById('orderCustomer');
    select.innerHTML = '<option value="">Select a customer</option>';
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} (${customer.email})`;
        select.appendChild(option);
    });
}

async function saveCustomer(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    
    const data = {
        name: name,
        email: email
    };
    
    try {
        let response;
        const isEditing = editingCustomerId;
        if (isEditing) {
            response = await fetch(`${API_URL}/customers/${editingCustomerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
            cancelCustomerEdit();
            await loadCustomers();
            await loadOrders();
            updateCustomerSelect();
            alert(isEditing ? 'Customer updated!' : 'Customer created!');
        } else {
            alert(result.message || 'Error saving customer!');
        }
    } catch (error) {
        console.error('Error saving customer:', error);
        alert('Error saving customer!');
    }
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    
    editingCustomerId = id;
    document.getElementById('customerId').value = id;
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('btnSaveCustomer').textContent = 'Update Customer';
    document.getElementById('btnCancelCustomer').style.display = 'inline-block';
    
    document.querySelector('[data-tab="customers"]').click();
    setTimeout(() => {
        document.querySelector('#customers .section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function cancelCustomerEdit() {
    editingCustomerId = null;
    document.getElementById('customerForm').reset();
    document.getElementById('btnSaveCustomer').textContent = 'Save Customer';
    document.getElementById('btnCancelCustomer').style.display = 'none';
}

async function deleteCustomer(id) {
    if (!confirm('Do you really want to delete this customer?')) return;
    
    try {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
            await loadCustomers();
            await loadOrders();
            updateCustomerSelect();
            alert('Customer deleted!');
        } else {
            alert(result.message || 'Error deleting customer!');
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer!');
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        orders = await response.json();
        renderOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        alert('Error loading orders!');
    }
}

function renderOrders() {
    const list = document.getElementById('orderList');
    list.innerHTML = '';
    
    if (orders.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No orders registered';
        list.appendChild(emptyMsg);
        return;
    }
    
    orders.forEach(order => {
        const details = calculateOrderDetails(order);
        const customer = customers.find(c => c.id === order.customerId);
        
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = `Order #${order.id}`;
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        if (isAdmin()) {
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn-edit';
            btnEdit.textContent = 'Edit';
            btnEdit.onclick = () => editOrder(order.id);
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete';
            btnDelete.textContent = 'Delete';
            btnDelete.onclick = () => deleteOrder(order.id);
            
            actions.appendChild(btnEdit);
            actions.appendChild(btnDelete);
        }
        
        header.appendChild(title);
        if (isAdmin()) {
            header.appendChild(actions);
        }
        
        const customerDiv = document.createElement('div');
        customerDiv.className = 'item-info';
        customerDiv.style.marginBottom = '10px';
        customerDiv.textContent = `Customer: ${customer ? customer.name : `ID ${order.customerId}`}`;
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'order-details';
        
        const h4 = document.createElement('h4');
        h4.textContent = 'Items:';
        detailsDiv.appendChild(h4);
        
        details.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-product-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${item.name} (x${item.quantity})`;
            
            const valueSpan = document.createElement('span');
            valueSpan.textContent = `$ ${item.subtotal.toFixed(2)}`;
            
            itemDiv.appendChild(nameSpan);
            itemDiv.appendChild(valueSpan);
            
            detailsDiv.appendChild(itemDiv);
        });
        
        const totalDiv = document.createElement('div');
        totalDiv.className = 'order-total';
        totalDiv.textContent = `Total: $ ${details.total.toFixed(2)}`;
        
        detailsDiv.appendChild(totalDiv);
        
        card.appendChild(header);
        card.appendChild(customerDiv);
        card.appendChild(detailsDiv);
        
        list.appendChild(card);
    });
}

function calculateOrderDetails(order) {
    const items = order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const quantity = item.quantity || 1;
        return {
            name: product ? product.name : `Product #${item.productId}`,
            quantity: quantity,
            unitValue: product ? product.value : 0,
            subtotal: product ? product.value * quantity : 0
        };
    });
    
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    return { items, total };
}

function addOrderItem() {
    const container = document.getElementById('orderItems');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    
    const productField = document.createElement('div');
    productField.className = 'order-item-field';
    
    const productLabel = document.createElement('label');
    productLabel.textContent = 'Product:';
    productField.appendChild(productLabel);
    
    const productSelect = document.createElement('select');
    productSelect.className = 'item-product';
    productSelect.required = true;
    
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Select a product';
    productSelect.appendChild(emptyOption);
    
    products.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.name} - $ ${p.value.toFixed(2)}`;
        productSelect.appendChild(option);
    });
    
    productField.appendChild(productSelect);
    
    const quantityField = document.createElement('div');
    quantityField.className = 'order-item-field';
    quantityField.style.maxWidth = '120px';
    
    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    quantityField.appendChild(quantityLabel);
    
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.className = 'item-quantity';
    quantityInput.value = '1';
    quantityInput.min = '1';
    quantityInput.required = true;
    quantityField.appendChild(quantityInput);
    
    const btnRemove = document.createElement('button');
    btnRemove.type = 'button';
    btnRemove.className = 'btn-remove';
    btnRemove.textContent = 'Remove';
    btnRemove.onclick = function() { removeOrderItem(this); };
    
    itemDiv.appendChild(productField);
    itemDiv.appendChild(quantityField);
    itemDiv.appendChild(btnRemove);
    
    container.appendChild(itemDiv);
}

function removeOrderItem(btn) {
    btn.parentElement.remove();
}

async function saveOrder(e) {
    e.preventDefault();
    
    const customerId = document.getElementById('orderCustomer').value;
    
    if (!customerId) {
        alert('Select a customer!');
        return;
    }
    
    const itemsContainer = document.getElementById('orderItems');
    const itemsElements = itemsContainer.querySelectorAll('.order-item');
    
    if (itemsElements.length === 0) {
        alert('Add at least one item to the order!');
        return;
    }
    
    const items = [];
    itemsElements.forEach(item => {
        const productId = item.querySelector('.item-product').value;
        const quantity = parseInt(item.querySelector('.item-quantity').value);
        
        if (productId && quantity > 0) {
            items.push({ productId: productId, quantity: quantity });
        }
    });
    
    if (items.length === 0) {
        alert('Select at least one valid product!');
        return;
    }
    
    const data = { customerId, items };
    
    try {
        let response;
        const isEditing = editingOrderId;
        
        if (isEditing) {
            response = await fetch(`${API_URL}/orders/${editingOrderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
            cancelOrderEdit();
            await loadData();
            alert(isEditing ? 'Order updated!' : 'Order created!');
        } else {
            alert(result.message || result.error || 'Error saving order!');
        }
    } catch (error) {
        console.error('Error saving order:', error);
        alert('Error saving order!');
    }
}

function editOrder(id) {
    const order = orders.find(p => p.id === id);
    if (!order) return;
    
    editingOrderId = id;
    document.getElementById('orderId').value = id;
    document.getElementById('orderCustomer').value = order.customerId;
    
    const container = document.getElementById('orderItems');
    container.innerHTML = '';
    
    order.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        
        const productField = document.createElement('div');
        productField.className = 'order-item-field';
        
        const productLabel = document.createElement('label');
        productLabel.textContent = 'Product:';
        productField.appendChild(productLabel);
        
        const productSelect = document.createElement('select');
        productSelect.className = 'item-product';
        productSelect.required = true;
        
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Select a product';
        productSelect.appendChild(emptyOption);
        
        products.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.name} - $ ${p.value.toFixed(2)}`;
            if (p.id === item.productId) option.selected = true;
            productSelect.appendChild(option);
        });
        
        productField.appendChild(productSelect);
        
        const quantityField = document.createElement('div');
        quantityField.className = 'order-item-field';
        quantityField.style.maxWidth = '120px';
        
        const quantityLabel = document.createElement('label');
        quantityLabel.textContent = 'Quantity:';
        quantityField.appendChild(quantityLabel);
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.className = 'item-quantity';
        quantityInput.value = item.quantity || 1;
        quantityInput.min = '1';
        quantityInput.required = true;
        quantityField.appendChild(quantityInput);
        
        const btnRemove = document.createElement('button');
        btnRemove.type = 'button';
        btnRemove.className = 'btn-remove';
        btnRemove.textContent = 'Remove';
        btnRemove.onclick = function() { removeOrderItem(this); };
        
        itemDiv.appendChild(productField);
        itemDiv.appendChild(quantityField);
        itemDiv.appendChild(btnRemove);
        
        container.appendChild(itemDiv);
    });
    
    document.getElementById('btnSaveOrder').textContent = 'Update Order';
    document.getElementById('btnCancelOrder').style.display = 'inline-block';
    
    document.querySelector('[data-tab="orders"]').click();
    setTimeout(() => {
        document.querySelector('#orders .section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function cancelOrderEdit() {
    editingOrderId = null;
    document.getElementById('orderForm').reset();
    document.getElementById('orderItems').innerHTML = '';
    document.getElementById('btnSaveOrder').textContent = 'Save Order';
    document.getElementById('btnCancelOrder').style.display = 'none';
}

async function deleteOrder(id) {
    if (!confirm('Do you really want to delete this order?')) return;
    
    try {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
            await loadOrders();
            alert('Order deleted!');
        } else {
            alert(result.message || result.error || 'Error deleting order!');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order!');
    }
}

async function loadData() {
    await loadProducts();
    await loadCustomers();
    await loadOrders();
}

function updateSearchSelects() {
    const selectCustomer = document.getElementById('searchCustomer');
    const selectProduct = document.getElementById('searchProduct');
    
    selectCustomer.innerHTML = '<option value="">All customers</option>';
    customers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        selectCustomer.appendChild(option);
    });
    
    selectProduct.innerHTML = '<option value="">All products</option>';
    products.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        selectProduct.appendChild(option);
    });
}

async function searchOrders(e) {
    e.preventDefault();
    
    const customerId = document.getElementById('searchCustomer').value;
    const productId = document.getElementById('searchProduct').value;
    
    try {
        let url = `${API_URL}/orders/search?`;
        const params = [];
        
        if (customerId) {
            params.push(`customer_id=${customerId}`);
        }
        
        if (productId) {
            params.push(`product_id=${productId}`);
        }
        
        url += params.join('&');
        
        const response = await fetch(url);
        const results = await response.json();
        
        renderSearchResults(results);
    } catch (error) {
        console.error('Error searching orders:', error);
        alert('Error searching orders!');
    }
}

function renderSearchResults(results) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';
    
    if (results.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No orders found';
        container.appendChild(emptyMsg);
        return;
    }
    
    results.forEach(order => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('h3');
        const customer = customers.find(c => c.id === order.customerId);
        title.textContent = `Order #${order.id} - ${customer ? customer.name : 'Unknown customer'}`;
        header.appendChild(title);
        
        card.appendChild(header);
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const itemsDiv = document.createElement('div');
        itemsDiv.innerHTML = '<strong>Items:</strong>';
        const itemsList = document.createElement('ul');
        itemsList.style.marginLeft = '20px';
        itemsList.style.marginTop = '5px';
        
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            const li = document.createElement('li');
            li.textContent = `${product ? product.name : 'Unknown product'} - Quantity: ${item.quantity}`;
            itemsList.appendChild(li);
        });
        
        itemsDiv.appendChild(itemsList);
        info.appendChild(itemsDiv);
        
        const total = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = 'Total:';
        total.appendChild(strong);
        total.appendChild(document.createTextNode(` $ ${order.total.toFixed(2)}`));
        info.appendChild(total);
        
        card.appendChild(info);
        container.appendChild(card);
    });
}

function clearSearch() {
    document.getElementById('searchForm').reset();
    const container = document.getElementById('searchResults');
    container.innerHTML = '<div class="empty-message">Use the filters above to search orders</div>';
}

function isAdmin() {
    return currentUserRole === 'admin';
}

function hideFormSections() {
    if (!isAdmin()) {
        document.querySelectorAll('.section').forEach(section => {
            const form = section.querySelector('form');
            if (form && form.id !== 'searchForm') {
                section.style.display = 'none';
            }
        });
    }
}

async function checkUserRole() {
    try {
        const response = await fetch(`${API_URL}/login/verify`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUserRole = data.user.role;
            
            if (currentUserRole === 'admin') {
                document.getElementById('usersTabBtn').style.display = 'flex';
            }
            
            hideFormSections();
        }
    } catch (error) {
        console.error('Error checking user role:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/login/all`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            alert('You do not have permission to view users');
            return;
        }
        
        users = await response.json();
        renderUsers();
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Error loading users!');
    }
}

function renderUsers() {
    const list = document.getElementById('userList');
    list.innerHTML = '';
    
    if (users.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No users registered';
        list.appendChild(emptyMsg);
        return;
    }
    
    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = user.username;
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        if (isAdmin()) {
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn-edit';
            btnEdit.textContent = 'Edit';
            btnEdit.onclick = () => editUser(user.username);
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete';
            btnDelete.textContent = 'Delete';
            btnDelete.onclick = () => deleteUser(user.username);
            
            actions.appendChild(btnEdit);
            actions.appendChild(btnDelete);
        }
        
        header.appendChild(title);
        if (isAdmin()) {
            header.appendChild(actions);
        }
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const emailDiv = document.createElement('div');
        emailDiv.textContent = `Email: ${user.email}`;
        
        const roleDiv = document.createElement('div');
        roleDiv.textContent = `Role: ${user.role}`;
        roleDiv.style.marginTop = '5px';
        roleDiv.style.color = user.role === 'admin' ? '#3b82f6' : '#888';
        roleDiv.style.fontWeight = user.role === 'admin' ? '600' : 'normal';
        
        info.appendChild(emailDiv);
        info.appendChild(roleDiv);
        
        card.appendChild(header);
        card.appendChild(info);
        
        list.appendChild(card);
    });
}

async function saveUser(e) {
    e.preventDefault();
    
    const username = document.getElementById('userUsername').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    const data = {
        username: username,
        email: email,
        password: password,
        role: role
    };
    
    try {
        let response;
        const isEditing = editingUserId;
        
        if (isEditing) {
            const updateData = { email, role };
            if (password) updateData.password = password;
            
            response = await fetch(`${API_URL}/login/${editingUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updateData)
            });
        } else {
            response = await fetch(`${API_URL}/login/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });
        }
        
        const result = await response.json().catch(() => ({}));
        
        if (response.ok) {
            cancelUserEdit();
            await loadUsers();
            alert(isEditing ? 'User updated!' : 'User created!');
        } else {
            alert(result.message || 'Error saving user!');
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Error saving user!');
    }
}

function editUser(username) {
    const user = users.find(u => u.username === username);
    if (!user) return;
    
    editingUserId = username;
    document.getElementById('userId').value = user.id;
    document.getElementById('userUsername').value = user.username;
    document.getElementById('userUsername').disabled = true;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = '';
    document.getElementById('userPassword').required = false;
    document.getElementById('userPassword').placeholder = 'Leave blank to keep current password';
    document.getElementById('userRole').value = user.role;
    document.getElementById('btnSaveUser').textContent = 'Update User';
    document.getElementById('btnCancelUser').style.display = 'inline-block';
    
    document.querySelector('[data-tab="users"]').click();
    setTimeout(() => {
        document.querySelector('#users .section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function cancelUserEdit() {
    editingUserId = null;
    document.getElementById('userForm').reset();
    document.getElementById('userUsername').disabled = false;
    document.getElementById('userPassword').required = true;
    document.getElementById('userPassword').placeholder = '';
    document.getElementById('btnSaveUser').textContent = 'Save User';
    document.getElementById('btnCancelUser').style.display = 'none';
}

async function deleteUser(username) {
    if (!confirm('Do you really want to delete this user?')) return;
    
    try {
        const response = await fetch(`${API_URL}/login/${username}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const result = await response.json().catch(() => ({}));
        
        if (response.ok) {
            await loadUsers();
            alert('User deleted!');
        } else {
            alert(result.message || 'Error deleting user!');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user!');
    }
}

async function handleLogout() {
    if (!confirm('Do you want to logout?')) return;
    
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Error logging out!');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        window.location.href = '/login';
    }
}
