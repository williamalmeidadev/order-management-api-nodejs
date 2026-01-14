const API_URL = 'http://localhost:3000/api';

let produtos = [];
let editandoProdutoId = null;

document.addEventListener('DOMContentLoaded', () => {
    configurarEventos();
    carregarProdutos();
});

function configurarEventos() {
    document.getElementById('produtoForm').addEventListener('submit', salvarProduto);
    document.getElementById('btnCancelarProduto').addEventListener('click', cancelarEdicaoProduto);
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
