const API_URL = 'http://localhost:3000/api';

let produtos = [];
let clientes = [];
let editandoProdutoId = null;
let editandoClienteId = null;

document.addEventListener('DOMContentLoaded', () => {
    configurarTabs();
    configurarEventos();
    carregarDados();
});

function configurarTabs() {
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

            // Atualiza dados ao trocar de aba
            if (tabName === 'produtos') {
                await carregarProdutos();
            } else if (tabName === 'clientes') {
                await carregarClientes();
            }
        });
    });
}

function configurarEventos() {
    document.getElementById('produtoForm').addEventListener('submit', salvarProduto);
    document.getElementById('btnCancelarProduto').addEventListener('click', cancelarEdicaoProduto);
    document.getElementById('clienteForm').addEventListener('submit', salvarCliente);
    document.getElementById('btnCancelarCliente').addEventListener('click', cancelarEdicaoCliente);
}

async function carregarProdutos() {
    try {
        const response = await fetch(`${API_URL}/products`);
        produtos = await response.json();
        renderizarProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos!');
    }
}

function renderizarProdutos() {
    const lista = document.getElementById('listaProdutos');
    lista.innerHTML = '';
    
    if (produtos.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'Nenhum produto cadastrado';
        lista.appendChild(emptyMsg);
        return;
    }
    
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = produto.name;
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-edit';
        btnEdit.textContent = 'Editar';
        btnEdit.onclick = () => editarProduto(produto.id);
        
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.textContent = 'Deletar';
        btnDelete.onclick = () => deletarProduto(produto.id);
        
        actions.appendChild(btnEdit);
        actions.appendChild(btnDelete);
        
        header.appendChild(title);
        header.appendChild(actions);
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const idDiv = document.createElement('div');
        idDiv.textContent = `ID: ${produto.id}`;
        
        const valueDiv = document.createElement('div');
        valueDiv.className = 'item-value';
        valueDiv.textContent = `R$ ${produto.value.toFixed(2)}`;
        
        info.appendChild(idDiv);
        info.appendChild(valueDiv);
        
        card.appendChild(header);
        card.appendChild(info);
        
        lista.appendChild(card);
    });
}

async function salvarProduto(e) {
    e.preventDefault();
    
    const nome = document.getElementById('produtoNome').value;
    const valor = document.getElementById('produtoValor').value;
    
    const dados = {
        name: nome,
        value: parseFloat(valor)
    };
    
    try {
        let response;
        const isEdicao = editandoProdutoId;
        if (isEdicao) {
            response = await fetch(`${API_URL}/products/${editandoProdutoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }
        if (response.ok) {
            cancelarEdicaoProduto();
            await carregarProdutos();
            alert(isEdicao ? 'Produto atualizado!' : 'Produto criado!');
        }
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto!');
    }
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    editandoProdutoId = id;
    document.getElementById('produtoId').value = id;
    document.getElementById('produtoNome').value = produto.name;
    document.getElementById('produtoValor').value = produto.value;
    document.getElementById('btnSalvarProduto').textContent = 'Atualizar Produto';
    document.getElementById('btnCancelarProduto').style.display = 'inline-block';
    document.querySelector('#produtos .section').scrollIntoView({ behavior: 'smooth' });
}

function cancelarEdicaoProduto() {
    editandoProdutoId = null;
    document.getElementById('produtoForm').reset();
    document.getElementById('btnSalvarProduto').textContent = 'Salvar Produto';
    document.getElementById('btnCancelarProduto').style.display = 'none';
}

async function deletarProduto(id) {
    if (!confirm('Deseja realmente deletar este produto?')) return;
    
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            await carregarProdutos();
            alert('Produto deletado!');
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar produto!');
    }
}

async function carregarClientes() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        clientes = await response.json();
        renderizarClientes();
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar clientes!');
    }
}

function renderizarClientes() {
    const lista = document.getElementById('listaClientes');
    lista.innerHTML = '';
    
    if (clientes.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'Nenhum cliente cadastrado';
        lista.appendChild(emptyMsg);
        return;
    }
    
    clientes.forEach(cliente => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = cliente.name;
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-edit';
        btnEdit.textContent = 'Editar';
        btnEdit.onclick = () => editarCliente(cliente.id);
        
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.textContent = 'Deletar';
        btnDelete.onclick = () => deletarCliente(cliente.id);
        
        actions.appendChild(btnEdit);
        actions.appendChild(btnDelete);
        
        header.appendChild(title);
        header.appendChild(actions);
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const idDiv = document.createElement('div');
        idDiv.textContent = `ID: ${cliente.id}`;
        
        const emailDiv = document.createElement('div');
        emailDiv.textContent = `E-mail: ${cliente.email}`;
        
        info.appendChild(idDiv);
        info.appendChild(emailDiv);
        
        card.appendChild(header);
        card.appendChild(info);
        
        lista.appendChild(card);
    });
}

async function salvarCliente(e) {
    e.preventDefault();
    
    const nome = document.getElementById('clienteNome').value;
    const email = document.getElementById('clienteEmail').value;
    
    const dados = {
        name: nome,
        email: email
    };
    
    try {
        let response;
        const isEdicao = editandoClienteId;
        if (isEdicao) {
            response = await fetch(`${API_URL}/customers/${editandoClienteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            response = await fetch(`${API_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }
        if (response.ok) {
            cancelarEdicaoCliente();
            await carregarClientes();
            alert(isEdicao ? 'Cliente atualizado!' : 'Cliente criado!');
        }
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        alert('Erro ao salvar cliente!');
    }
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;
    
    editandoClienteId = id;
    document.getElementById('clienteId').value = id;
    document.getElementById('clienteNome').value = cliente.name;
    document.getElementById('clienteEmail').value = cliente.email;
    document.getElementById('btnSalvarCliente').textContent = 'Atualizar Cliente';
    document.getElementById('btnCancelarCliente').style.display = 'inline-block';
    
    document.querySelector('[data-tab="clientes"]').click();
    setTimeout(() => {
        document.querySelector('#clientes .section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function cancelarEdicaoCliente() {
    editandoClienteId = null;
    document.getElementById('clienteForm').reset();
    document.getElementById('btnSalvarCliente').textContent = 'Salvar Cliente';
    document.getElementById('btnCancelarCliente').style.display = 'none';
}

async function deletarCliente(id) {
    if (!confirm('Deseja realmente deletar este cliente?')) return;
    
    try {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            await carregarClientes();
            alert('Cliente deletado!');
        }
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        alert('Erro ao deletar cliente!');
    }
}

async function carregarDados() {
    await carregarProdutos();
    await carregarClientes();
}
