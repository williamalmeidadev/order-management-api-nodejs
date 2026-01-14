const API_URL = 'http://localhost:3000/api';

let produtos = [];
let clientes = [];
let pedidos = [];
let editandoProdutoId = null;
let editandoClienteId = null;
let editandoPedidoId = null;

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
            } else if (tabName === 'pedidos') {
                await carregarProdutos();
                await carregarClientes();
                await carregarPedidos();
            } else if (tabName === 'pesquisa') {
                await carregarProdutos();
                await carregarClientes();
                await atualizarSelectsPesquisa();
            }
        });
    });
}

function configurarEventos() {
    document.getElementById('produtoForm').addEventListener('submit', salvarProduto);
    document.getElementById('btnCancelarProduto').addEventListener('click', cancelarEdicaoProduto);
    document.getElementById('clienteForm').addEventListener('submit', salvarCliente);
    document.getElementById('btnCancelarCliente').addEventListener('click', cancelarEdicaoCliente);
    document.getElementById('pedidoForm').addEventListener('submit', salvarPedido);
    document.getElementById('btnCancelarPedido').addEventListener('click', cancelarEdicaoPedido);
    document.getElementById('btnAdicionarItem').addEventListener('click', adicionarItemPedido);
    document.getElementById('pesquisaForm').addEventListener('submit', pesquisarPedidos);
    document.getElementById('btnLimparPesquisa').addEventListener('click', limparPesquisa);
}

async function carregarProdutos() {
    try {
        const response = await fetch(`${API_URL}/products`);
        produtos = await response.json();
        renderizarProdutos();
        atualizarSelectProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos!');
    }
// Atualiza todos os selects de produtos nos itens do pedido
function atualizarSelectProdutos() {
    const selects = document.querySelectorAll('.item-produto');
    selects.forEach(select => {
        const valorSelecionado = select.value;
        select.innerHTML = '';
        const optionVazia = document.createElement('option');
        optionVazia.value = '';
        optionVazia.textContent = 'Selecione um produto';
        select.appendChild(optionVazia);
        produtos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.name} - R$ ${p.value.toFixed(2)}`;
            if (String(p.id) === valorSelecionado) option.selected = true;
            select.appendChild(option);
        });
    });
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
            await carregarPedidos();
            atualizarSelectProdutos();
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
            await carregarPedidos();
            atualizarSelectProdutos();
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
        atualizarSelectClientes();
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

function atualizarSelectClientes() {
    const select = document.getElementById('pedidoCliente');
    select.innerHTML = '<option value="">Selecione um cliente</option>';
    
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = `${cliente.name} (${cliente.email})`;
        select.appendChild(option);
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
            await carregarPedidos();
            atualizarSelectClientes();
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
            await carregarPedidos();
            atualizarSelectClientes();
            alert('Cliente deletado!');
        }
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        alert('Erro ao deletar cliente!');
    }
}

async function carregarPedidos() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        pedidos = await response.json();
        renderizarPedidos();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        alert('Erro ao carregar pedidos!');
    }
}

function renderizarPedidos() {
    const lista = document.getElementById('listaPedidos');
    lista.innerHTML = '';
    
    if (pedidos.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'Nenhum pedido cadastrado';
        lista.appendChild(emptyMsg);
        return;
    }
    
    pedidos.forEach(pedido => {
        const detalhes = calcularDetalhesPedido(pedido);
        const cliente = clientes.find(c => c.id === pedido.customerId);
        
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = `Pedido #${pedido.id}`;
        
        const actions = document.createElement('div');
        actions.className = 'item-actions';
        
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-edit';
        btnEdit.textContent = 'Editar';
        btnEdit.onclick = () => editarPedido(pedido.id);
        
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.textContent = 'Deletar';
        btnDelete.onclick = () => deletarPedido(pedido.id);
        
        actions.appendChild(btnEdit);
        actions.appendChild(btnDelete);
        
        header.appendChild(title);
        header.appendChild(actions);
        
        const clienteDiv = document.createElement('div');
        clienteDiv.className = 'item-info';
        clienteDiv.style.marginBottom = '10px';
        clienteDiv.textContent = `Cliente: ${cliente ? cliente.name : `ID ${pedido.customerId}`}`;
        
        const detalhesDiv = document.createElement('div');
        detalhesDiv.className = 'pedido-detalhes';
        
        const h4 = document.createElement('h4');
        h4.textContent = 'Itens:';
        detalhesDiv.appendChild(h4);
        
        detalhes.itens.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'pedido-produto-item';
            
            const nomeSpan = document.createElement('span');
            nomeSpan.textContent = `${item.nome} (x${item.quantidade})`;
            
            const valorSpan = document.createElement('span');
            valorSpan.textContent = `R$ ${item.subtotal.toFixed(2)}`;
            
            itemDiv.appendChild(nomeSpan);
            itemDiv.appendChild(valorSpan);
            
            detalhesDiv.appendChild(itemDiv);
        });
        
        const totalDiv = document.createElement('div');
        totalDiv.className = 'pedido-total';
        totalDiv.textContent = `Total: R$ ${detalhes.total.toFixed(2)}`;
        
        detalhesDiv.appendChild(totalDiv);
        
        card.appendChild(header);
        card.appendChild(clienteDiv);
        card.appendChild(detalhesDiv);
        
        lista.appendChild(card);
    });
}

function calcularDetalhesPedido(pedido) {
    const itens = pedido.items.map(item => {
        const produto = produtos.find(p => p.id === item.productId);
        const quantidade = item.quantity || 1;
        return {
            nome: produto ? produto.name : `Produto #${item.productId}`,
            quantidade: quantidade,
            valorUnitario: produto ? produto.value : 0,
            subtotal: produto ? produto.value * quantidade : 0
        };
    });
    
    const total = itens.reduce((sum, item) => sum + item.subtotal, 0);
    
    return { itens, total };
}

function adicionarItemPedido() {
    const container = document.getElementById('itensPedido');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'pedido-item';
    
    const produtoField = document.createElement('div');
    produtoField.className = 'pedido-item-field';
    
    const produtoLabel = document.createElement('label');
    produtoLabel.textContent = 'Produto:';
    produtoField.appendChild(produtoLabel);
    
    const produtoSelect = document.createElement('select');
    produtoSelect.className = 'item-produto';
    produtoSelect.required = true;
    
    const optionVazia = document.createElement('option');
    optionVazia.value = '';
    optionVazia.textContent = 'Selecione um produto';
    produtoSelect.appendChild(optionVazia);
    
    produtos.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.name} - R$ ${p.value.toFixed(2)}`;
        produtoSelect.appendChild(option);
    });
    
    produtoField.appendChild(produtoSelect);
    
    const quantidadeField = document.createElement('div');
    quantidadeField.className = 'pedido-item-field';
    quantidadeField.style.maxWidth = '120px';
    
    const quantidadeLabel = document.createElement('label');
    quantidadeLabel.textContent = 'Quantidade:';
    quantidadeField.appendChild(quantidadeLabel);
    
    const quantidadeInput = document.createElement('input');
    quantidadeInput.type = 'number';
    quantidadeInput.className = 'item-quantidade';
    quantidadeInput.value = '1';
    quantidadeInput.min = '1';
    quantidadeInput.required = true;
    quantidadeField.appendChild(quantidadeInput);
    
    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.className = 'btn-remove';
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = function() { removerItemPedido(this); };
    
    itemDiv.appendChild(produtoField);
    itemDiv.appendChild(quantidadeField);
    itemDiv.appendChild(btnRemover);
    
    container.appendChild(itemDiv);
}

function removerItemPedido(btn) {
    btn.parentElement.remove();
}

async function salvarPedido(e) {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('pedidoCliente').value);
    
    if (!customerId) {
        alert('Selecione um cliente!');
        return;
    }
    
    const itensContainer = document.getElementById('itensPedido');
    const itensElements = itensContainer.querySelectorAll('.pedido-item');
    
    if (itensElements.length === 0) {
        alert('Adicione pelo menos um item ao pedido!');
        return;
    }
    
    const items = [];
    itensElements.forEach(item => {
        const produtoId = parseInt(item.querySelector('.item-produto').value);
        const quantidade = parseInt(item.querySelector('.item-quantidade').value);
        
        if (produtoId && quantidade > 0) {
            items.push({ productId: produtoId, quantity: quantidade });
        }
    });
    
    if (items.length === 0) {
        alert('Selecione pelo menos um produto válido!');
        return;
    }
    
    const dados = { customerId, items };
    
    try {
        let response;
        const isEdicao = editandoPedidoId;
        
        if (isEdicao) {
            response = await fetch(`${API_URL}/orders/${editandoPedidoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }
        
        const result = await response.json();
        
        if (response.ok) {
            cancelarEdicaoPedido();
            await carregarDados();
            alert(isEdicao ? 'Pedido atualizado!' : 'Pedido criado!');
        } else {
            alert(result.error || 'Erro ao salvar pedido!');
        }
    } catch (error) {
        console.error('Erro ao salvar pedido:', error);
        alert('Erro ao salvar pedido!');
    }
}

function editarPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    editandoPedidoId = id;
    document.getElementById('pedidoId').value = id;
    document.getElementById('pedidoCliente').value = pedido.customerId;
    
    const container = document.getElementById('itensPedido');
    container.innerHTML = '';
    
    pedido.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'pedido-item';
        
        const produtoField = document.createElement('div');
        produtoField.className = 'pedido-item-field';
        
        const produtoLabel = document.createElement('label');
        produtoLabel.textContent = 'Produto:';
        produtoField.appendChild(produtoLabel);
        
        const produtoSelect = document.createElement('select');
        produtoSelect.className = 'item-produto';
        produtoSelect.required = true;
        
        const optionVazia = document.createElement('option');
        optionVazia.value = '';
        optionVazia.textContent = 'Selecione um produto';
        produtoSelect.appendChild(optionVazia);
        
        produtos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.name} - R$ ${p.value.toFixed(2)}`;
            if (p.id === item.productId) option.selected = true;
            produtoSelect.appendChild(option);
        });
        
        produtoField.appendChild(produtoSelect);
        
        const quantidadeField = document.createElement('div');
        quantidadeField.className = 'pedido-item-field';
        quantidadeField.style.maxWidth = '120px';
        
        const quantidadeLabel = document.createElement('label');
        quantidadeLabel.textContent = 'Quantidade:';
        quantidadeField.appendChild(quantidadeLabel);
        
        const quantidadeInput = document.createElement('input');
        quantidadeInput.type = 'number';
        quantidadeInput.className = 'item-quantidade';
        quantidadeInput.value = item.quantity || 1;
        quantidadeInput.min = '1';
        quantidadeInput.required = true;
        quantidadeField.appendChild(quantidadeInput);
        
        const btnRemover = document.createElement('button');
        btnRemover.type = 'button';
        btnRemover.className = 'btn-remove';
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = function() { removerItemPedido(this); };
        
        itemDiv.appendChild(produtoField);
        itemDiv.appendChild(quantidadeField);
        itemDiv.appendChild(btnRemover);
        
        container.appendChild(itemDiv);
    });
    
    document.getElementById('btnSalvarPedido').textContent = 'Atualizar Pedido';
    document.getElementById('btnCancelarPedido').style.display = 'inline-block';
    
    document.querySelector('[data-tab="pedidos"]').click();
    setTimeout(() => {
        document.querySelector('#pedidos .section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function cancelarEdicaoPedido() {
    editandoPedidoId = null;
    document.getElementById('pedidoForm').reset();
    document.getElementById('itensPedido').innerHTML = '';
    document.getElementById('btnSalvarPedido').textContent = 'Salvar Pedido';
    document.getElementById('btnCancelarPedido').style.display = 'none';
}

async function deletarPedido(id) {
    if (!confirm('Deseja realmente deletar este pedido?')) return;
    
    try {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await carregarPedidos();
            alert('Pedido deletado!');
        }
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        alert('Erro ao deletar pedido!');
    }
}

async function carregarDados() {
    await carregarProdutos();
    await carregarClientes();
    await carregarPedidos();
}

// ========== PESQUISA DE PEDIDOS ==========

function atualizarSelectsPesquisa() {
    const selectCliente = document.getElementById('pesquisaCliente');
    const selectProduto = document.getElementById('pesquisaProduto');
    
    // Atualiza select de clientes
    selectCliente.innerHTML = '<option value="">Todos os clientes</option>';
    clientes.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        selectCliente.appendChild(option);
    });
    
    // Atualiza select de produtos
    selectProduto.innerHTML = '<option value="">Todos os produtos</option>';
    produtos.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        selectProduto.appendChild(option);
    });
}

async function pesquisarPedidos(e) {
    e.preventDefault();
    
    const customerId = document.getElementById('pesquisaCliente').value;
    const productId = document.getElementById('pesquisaProduto').value;
    
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
        const resultados = await response.json();
        
        renderizarResultadosPesquisa(resultados);
    } catch (error) {
        console.error('Erro ao pesquisar pedidos:', error);
        alert('Erro ao pesquisar pedidos!');
    }
}

function renderizarResultadosPesquisa(resultados) {
    const container = document.getElementById('resultadosPesquisa');
    container.innerHTML = '';
    
    if (resultados.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'Nenhum pedido encontrado';
        container.appendChild(emptyMsg);
        return;
    }
    
    resultados.forEach(pedido => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const title = document.createElement('h3');
        const cliente = clientes.find(c => c.id === pedido.customerId);
        title.textContent = `Pedido #${pedido.id} - ${cliente ? cliente.name : 'Cliente desconhecido'}`;
        header.appendChild(title);
        
        card.appendChild(header);
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const itensDiv = document.createElement('div');
        itensDiv.innerHTML = '<strong>Itens:</strong>';
        const itensList = document.createElement('ul');
        itensList.style.marginLeft = '20px';
        itensList.style.marginTop = '5px';
        
        pedido.items.forEach(item => {
            const produto = produtos.find(p => p.id === item.productId);
            const li = document.createElement('li');
            li.textContent = `${produto ? produto.name : 'Produto desconhecido'} - Quantidade: ${item.quantity}`;
            itensList.appendChild(li);
        });
        
        itensDiv.appendChild(itensList);
        info.appendChild(itensDiv);
        
        const total = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = 'Total:';
        total.appendChild(strong);
        total.appendChild(document.createTextNode(` R$ ${pedido.total.toFixed(2)}`));
        info.appendChild(total);
        
        card.appendChild(info);
        container.appendChild(card);
    });
}

function limparPesquisa() {
    document.getElementById('pesquisaForm').reset();
    const container = document.getElementById('resultadosPesquisa');
    container.innerHTML = '<div class="empty-message">Use os filtros acima para pesquisar pedidos</div>';
}
