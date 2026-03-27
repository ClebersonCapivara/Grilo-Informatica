
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Tabela de preços para cálculo (RAM / CPU / GPU)
const precos = {
    ram: { '8gb': 150, '16gb': 450, '32gb': 1500, '64gb': 2500, '128gb': 5500 },
    processador: { 'i5': 630, 'i7': 2300, 'R5': 600, 'R7': 1200 },
    gpu: { 'GeForce RTX 4060 (8 GB)': 2300, 'GeForce RTX 4060 Ti (16 GB)': 3500, 'GeForce RTX 5090': 22000, 'GeForce RTX 5080': 9900, 'GeForce RTX 5070 Ti': 7000, 'RX 6600': 1500, 'RX 6600 XT': 2000, 'RX 7600': 2500, 'Radeon RX 7900 XTX': 7500, 'Radeon RX 7900 XT': 5000, 'Radeon RX 7800 XT': 3700 }
};

// Tabela de produtos do CSV (linha + nome do produto) ordenados por nome
const produtosCatalogo = {
    'CX ArcCase FullTower RGB': 899,
    'CX ArcCase MidTower': 499,
    'CX BlazeRAM 16GB Pro': 699,
    'CX BlazeRAM 32GB Ultra': 1299,
    'CX Core X5 Pro': 2499,
    'CX Core X9 Extreme': 3499,
    'CX CryoCool 240 Pro': 349,
    'CX CryoCool 360 Ultra': 499,
    'CX Flux 750W Pro': 599,
    'CX Flux 1000W Ultra': 899,
    'CX HyperDrive 1000 Pro': 999,
    'CX HyperDrive 2000 Ultra': 1799,
    'CX NexusBoard B550': 899,
    'CX NexusBoard X790 Extreme': 1499,
    'CX RayForce G7': 4999,
    'CX RayForce G9 Ultra': 7499,
    'GX Blaze 1000 Inferno': 8799,
    'GX Shadow X9 Elite': 9499,
    'GX Vortex 700 Max': 7999,
    'GX GX 1000 Ultra': 5499,
    'GX GX 9000 Titan': 12499,
    'NX AeroBook 17 Ultra': 9199,
    'NX FlexNote 600 Max': 7499,
    'NX Nexus 550 Max': 6299,
    'NX PulseBook 17 Extreme': 8899,
    'NX Zenith 700 Ultra': 10499,
    'PX ArcPad 600 RGB': 249,
    'PX Echo H90 Ultra': 899,
    'PX NovaCam 60 Ultra': 599,
    'PX Pulse K100 Max': 699,
    'PX Storm M90 Ultra': 399
};

function normalizarNome(nome) {
    return nome.toString().trim().replace(/\s+/g, ' ').toLowerCase();
}

const produtosCatalogoMap = Object.fromEntries(
    Object.entries(produtosCatalogo).map(([nome, preco]) => [normalizarNome(nome), preco])
);

function pegarPrecoPorNome(nomeProduto) {
    const nomeNormalizado = normalizarNome(nomeProduto);
    if (produtosCatalogoMap[nomeNormalizado]) {
        return produtosCatalogoMap[nomeNormalizado];
    }
    const entradaEncontrada = Object.entries(produtosCatalogoMap).find(([chave]) => {
        return chave === nomeNormalizado || chave.includes(nomeNormalizado) || nomeNormalizado.includes(chave);
    });
    return entradaEncontrada ? entradaEncontrada[1] : 0;
}

// calcular preço do produto
function calcularPreco(ram, processador, gpu) {
    return precos.ram[ram] + precos.processador[processador] + precos.gpu[gpu];
}

// mostrar carrinho no console
function mostrarCarrinhoConsole() {
    console.clear();
    console.log('%c🛒 CARRINHO DE COMPRAS 🛒', 'color: #4CAF50; font-size: 18px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50;');
    console.log(`%cTotal de produtos: ${carrinho.length}`, 'color: #2196F3; font-size: 14px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50;');
    
    if (carrinho.length > 0) {
        carrinho.forEach((produto, index) => {
            console.log(`%c📦 Produto ${index + 1}:`, 'color: #FF9800; font-weight: bold;');
            console.log(`   Nome: ${produto.nome}`);
            console.log(`   Preço: R$ ${produto.preco}`);
            if (produto.ram) console.log(`   RAM: ${produto.ram}`);
            if (produto.processador) console.log(`   Processador: ${produto.processador}`);
            if (produto.gpu) console.log(`   GPU: ${produto.gpu}`);
            console.log(`   Adicionado em: ${produto.dataAdicionado}`);
            console.log('');
        });
    }
    
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4CAF50;');
    console.table(carrinho);
}

// Obter preço final do produto (mesma lógica para carrinho e 'comprar agora')
function obterPrecoDoProduto(produto, produtoDiv) {
    if (produto.ram && produto.processador && produto.gpu) {
        return calcularPreco(produto.ram, produto.processador, produto.gpu);
    }
    const precoFixo = produtoDiv ? parseFloat(produtoDiv.dataset.preco) : null;
    if (precoFixo && !isNaN(precoFixo) && precoFixo > 0) {
        return precoFixo;
    }
    const nomeChave = produto.linha ? `${produto.linha} ${produto.nome}` : produto.nome;
    return pegarPrecoPorNome(nomeChave);
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(produto, produtoDiv) {
    produto.preco = obterPrecoDoProduto(produto, produtoDiv);
    carrinho.push(produto);
    salvarCarrinho();
    alert('Produto adicionado ao carrinho!');
    mostrarCarrinhoConsole();
}

// Event listener para os botões de comprar
document.addEventListener('DOMContentLoaded', function() {
    const botoesComprar = document.querySelectorAll('.btn-comprar');
    botoesComprar.forEach((botao) => {
        botao.addEventListener('click', function() {
            const produtoDiv = this.closest('.produto');
            const nomeProduto = produtoDiv.querySelector('h2').textContent.trim();
            
            const produto = {
                nome: nomeProduto,
                linha: produtoDiv.dataset.linha || '',
                dataAdicionado: new Date().toLocaleString()
            };
            
            // Verificar e adicionar ram se existir
            const ramSelect = produtoDiv.querySelector('.ram');
            if (ramSelect) {
                produto.ram = ramSelect.value;
            }
            
            // Verificar e adicionar processador se existir
            const processadorSelect = produtoDiv.querySelector('.processador');
            if (processadorSelect) {
                produto.processador = processadorSelect.value;
            }
            
            // Verificar e adicionar gpu se existir
            const gpuSelect = produtoDiv.querySelector('.gpu');
            if (gpuSelect) {
                produto.gpu = gpuSelect.value;
            }

            adicionarAoCarrinho(produto, produtoDiv);
            renderizarCarrinho();
        });
    });

    // Event listener para os botões "Comprar Agora"
    const botoesComprarAgora = document.querySelectorAll('.btn-comprar-agora');
    botoesComprarAgora.forEach((botao) => {
        botao.addEventListener('click', function() {
            const produtoDiv = this.closest('.produto');
            const nomeProduto = produtoDiv.querySelector('h2').textContent.trim();
            
            const produto = {
                nome: nomeProduto,
                linha: produtoDiv.dataset.linha || '',
                dataAdicionado: new Date().toLocaleString()
            };
            
            // Verificar e adicionar ram se existir
            const ramSelect = produtoDiv.querySelector('.ram');
            if (ramSelect) {
                produto.ram = ramSelect.value;
            }
            
            // Verificar e adicionar processador se existir
            const processadorSelect = produtoDiv.querySelector('.processador');
            if (processadorSelect) {
                produto.processador = processadorSelect.value;
            }
            
            // Verificar e adicionar gpu se existir
            const gpuSelect = produtoDiv.querySelector('.gpu');
            if (gpuSelect) {
                produto.gpu = gpuSelect.value;
            }

            // Definir preço (mesma lógica de produto do carrinho)
            produto.preco = obterPrecoDoProduto(produto, produtoDiv);

            // Redirecionar para a paywall com os dados do produto
            redirecionarParaPaywall(produto);
        });
    });

    renderizarCarrinho();
});

// Função para visualizar o carrinho
function visualizarCarrinho() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        console.clear();
        console.log('%c🛒 Carrinho vazio', 'color: #ff9800; font-size: 16px; font-weight: bold;');
        return;
    }
    mostrarCarrinhoConsole();
    alert('Carrinho possui ' + carrinho.length + ' produto(s). Verifique o console (F12) para ver detalhes!');
}

// Função para redirecionar para a paywall
function redirecionarParaPaywall(produto) {
    if (Array.isArray(produto)) {
        localStorage.setItem('carrinhoPaywall', JSON.stringify(produto));
        localStorage.removeItem('produtoPaywall');
    } else {
        localStorage.setItem('produtoPaywall', JSON.stringify(produto));
        localStorage.removeItem('carrinhoPaywall');
    }
    window.location.href = 'Paywall1.html';
}

function finalizarCompra() {
    if (!carrinho || carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
        return;
    }
    redirecionarParaPaywall(carrinho);
}

function realizarBusca() {
    let input = document.querySelector('.search input').value.toLowerCase();
    let produtos = document.getElementsByClassName('produto');
    if (input === '') {
        for(let i = 0; i < produtos.length; i++){
            produtos[i].style.display = 'block';
        }
    }
    else {
        for(let i = 0; i < produtos.length; i++){
            let nomeProduto = produtos[i].querySelector('h2').textContent.toLowerCase();
            if (nomeProduto.includes(input)) {
                produtos[i].style.display = 'block';
            } else {
                produtos[i].style.display = 'none';
            }
        }
    }
}
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}
function removercarrinho(index) {
    if (index > -1 && index < carrinho.length) {
        const itemRemovido = carrinho.splice(index, 1); // Remove 1 item na posição 'index'
        salvarCarrinho(); // Salva a lista atualizada sem o item
        renderizarCarrinho(); // Atualiza a visualização do carrinho
        console.log(`Removido: ${itemRemovido}`);
    } else {
        console.error("Índice inválido!");
    }
}
function renderizarCarrinho() {
  const cont = document.getElementById('carrinho-conteudo');
  cont.innerHTML = '';

  if (carrinho.length === 0) {
    cont.innerHTML = '<p>Seu carrinho está vazio.</p>';
    return;
  }

  let total = 0;
  carrinho.forEach((item, i) => {
    const preco = Number(item.preco || 0);
    total += preco;

    const itemEl = document.createElement('div');
    itemEl.className = 'item-carrinho';

    let detalhe = `
      <h3>${item.nome}</h3>
`;
    if (item.ram) detalhe += `      <p>RAM: ${item.ram}</p>\n`;
    if (item.processador) detalhe += `      <p>CPU: ${item.processador}</p>\n`;
    if (item.gpu) detalhe += `      <p>GPU: ${item.gpu}</p>\n`;

    detalhe += `      <p>Preço: R$ ${preco.toFixed(2)}</p>\n`;
    detalhe += `      <button data-index="${i}" class="remover-item">Remover</button>\n      <hr>\n`;

    itemEl.innerHTML = detalhe;
    cont.appendChild(itemEl);
  });

  const totalEl = document.createElement('div');
  totalEl.className = 'total-carrinho';
  totalEl.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
  cont.appendChild(totalEl);

  cont.querySelectorAll('.remover-item').forEach(botao => {
    botao.addEventListener('click', () => {
      const idx = Number(botao.dataset.index);
      removercarrinho(idx);
      renderizarCarrinho();
    });
  });
}
function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderizarCarrinho();
}