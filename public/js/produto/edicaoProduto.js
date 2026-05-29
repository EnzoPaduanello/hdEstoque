let locaisDisponiveis = [];

document.addEventListener('DOMContentLoaded', async function() {
    $(document).ready(function () {
        $('#materialSelect').select2({
            placeholder: "Selecione um material",
            allowClear: true,
            width: 'resolve'
        });

        $('#corSelect').select2({
            placeholder: "Selecione um cor",
            allowClear: true,
            width: 'resolve'
        })

        $('#categoriaSelect').select2({
            placeholder: "Selecione uma categoria",
            allowClear: true,
            width: 'resolve'
        });

        $('#colecaoSelect').select2({
            placeholder: "Selecione um coleção",
            allowClear: true,
            width: 'resolve'
        });
    });

    // --- INÍCIO DA LÓGICA DE PREÇO ---
    const radioCalculado = document.getElementById('radioCalculado');
    const radioPersonalizado = document.getElementById('radioPersonalizado');
    const calculoContainer = document.getElementById('calculo-container');
    const precoInput = document.getElementById('precoInput');
    
    const custoMaterialCalculo = document.getElementById('custoMaterialCalculo');
    const tempoProducaoCalculo = document.getElementById('tempoProducaoCalculo');
    const valorHoraCalculo = document.getElementById('valorHoraCalculo');
    const dicaPreco = document.getElementById('dicaPreco');

    function calcularPrecoSugestao() {
        if (radioPersonalizado && radioPersonalizado.checked) return;

        const custoMat = parseFloat(custoMaterialCalculo?.value) || 0;
        const tempo = parseFloat(tempoProducaoCalculo?.value) || 0;
        const valorHora = parseFloat(valorHoraCalculo?.value) || 0;

        const custoMaoDeObra = (tempo / 60) * valorHora;
        const custoBase = custoMat + custoMaoDeObra;
        const precoSugerido = custoBase * 2; 

        if (precoInput) precoInput.value = precoSugerido.toFixed(2);
        
        if (dicaPreco) {
            if (custoBase > 0) {
                dicaPreco.textContent = `Custo Base da Peça: R$ ${custoBase.toFixed(2)}`;
            } else {
                dicaPreco.textContent = '';
            }
        }
    }

    if (custoMaterialCalculo && tempoProducaoCalculo && valorHoraCalculo) {
        [custoMaterialCalculo, tempoProducaoCalculo, valorHoraCalculo].forEach(input => {
            input.addEventListener('input', calcularPrecoSugestao);
        });
    }

    if (radioCalculado) {
        radioCalculado.addEventListener('change', () => {
            if (calculoContainer) calculoContainer.style.display = 'flex';
            if (precoInput) {
                precoInput.readOnly = true;
                precoInput.style.backgroundColor = '#F4F6F4';
            }
            calcularPrecoSugestao();
        });
    }

    if (radioPersonalizado) {
        radioPersonalizado.addEventListener('change', () => {
            if (calculoContainer) calculoContainer.style.display = 'none';
            if (precoInput) {
                precoInput.readOnly = false;
                precoInput.style.backgroundColor = '#FFFFFF';
                precoInput.focus();
            }
            if (dicaPreco) dicaPreco.textContent = 'Modo manual ativo. Digite o preço desejado.';
        });
    }
    // --- FIM DA LÓGICA DE PREÇO ---

    const form = document.getElementById('edicaoForm');
    const idProduto = getUrlParametro('id');

    // 1. Carrega dados iniciais
    await carregarLocaisParaMemoria();
    const produto = await buscarDadosProduto(idProduto);
    await carregarDadosProduto(produto);
    
    // 2. CARREGA O ESTOQUE JÁ EXISTENTE 
    await carregarEstoqueExistente(idProduto);

    // 3. Configura botão de adicionar (Cards NOVOS)
    const btnAdicionar = document.getElementById('adicionar-local-button');
    if(btnAdicionar){
        btnAdicionar.addEventListener('click', function() {
            desenharCard(null, null, 0); 
        });
    }

    // 4. Submit do Formulário
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nome = document.getElementById('nomeInput').value.trim().toUpperCase();
        const material = document.getElementById('materialSelect').value;
        const cor = document.getElementById('corSelect').value;
        const categoria = document.getElementById('categoriaSelect').value;
        const colecao = document.getElementById('colecaoSelect').value;
        const preco = document.getElementById('precoInput').valueAsNumber;
        const gasto = document.getElementById('gastoMaterialInput').valueAsNumber;

        const novosEstoques = [];
        const estoquesEditados = [];

        document.querySelectorAll('.card-local').forEach(card => {
            const idRelacao = card.dataset.idRelacao; 
            const inputQtd = card.querySelector('.input-estoque');
            const quantidade = inputQtd.valueAsNumber;

            if (idRelacao && idRelacao !== "novo") {
                estoquesEditados.push({
                    id_relacao: idRelacao,
                    quantidade: quantidade
                });
            } else {
                const selectLocal = card.querySelector('.select-local');
                if (selectLocal && selectLocal.value) {
                    novosEstoques.push({
                        id_local: selectLocal.value,
                        quantidade: quantidade
                    });
                }
            }
        });

        const produtoData = {
            nome,
            idMaterial: material,
            idCor: cor,
            idCategoria: categoria,
            idColecao: colecao,
            preco,
            gastoMaterialMetro: gasto,
            novosEstoques,     
            estoquesEditados   
        };

        try{
            const response = await fetch(`/api/produto/${idProduto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoData)
            });

            if (!response.ok) throw new Error('Erro ao salvar');
            
            alert('Produto e estoques atualizados!');
            location.reload(); 
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar.');
        }
    })

    document.getElementById('delete-button').addEventListener('click', async function() {
        if(!confirm("Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.")) return;
        try {
            const response = await fetch(`/api/produto/${idProduto}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Produto deletado com sucesso.');
                window.location.assign('/produto');
            } else {
                alert('Erro ao deletar o produto.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão ao tentar deletar o produto.');
        }
    });
});

async function buscarDadosProduto(idProduto) {
    try{
        const response = await fetch(`/api/produto/${idProduto}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Erro ao buscar produto');
        return await response.json(); 
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Falha ao conectar com o servidor.');
    }
};

async function carregarDadosProduto(produto) {
    document.getElementById('nomeInput').value = produto.nome;
    
    // --- NOVO: Ativar modo manual para não perder o preço do banco ---
    const radioPersonalizado = document.getElementById('radioPersonalizado');
    if (radioPersonalizado) {
        radioPersonalizado.checked = true;
        radioPersonalizado.dispatchEvent(new Event('change'));
    }
    
    document.getElementById('precoInput').value = produto.preco;
    document.getElementById('gastoMaterialInput').value = produto.gastoMaterialMetro;

    criarOpcoesMaterial(produto.idMaterial);
    criarOpcoesCor(produto.idCor);
    criarOpcoesCategoria(produto.idCategoria);
    criarOpcoesColecao(produto.idColecao);
};

function criarOpcoesMaterial(idMaterial) {
    fetch('/api/material', {})
    .then(response => {
        if(!response.ok) throw new Error('Falha ao carregar materiais: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const materialSelect = document.getElementById('materialSelect');
        data.forEach(material => {
            const option = document.createElement('option');
            option.value = material.id;
            option.textContent = material.nome;
            if(material.id === idMaterial) option.selected = true;
            materialSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar materiais:', error);
        alert('Não foi possivel carregar os materiais');
    });
};

function criarOpcoesCor(idCor) {
    fetch('/api/cor', {})
    .then(response => {
        if(!response.ok) throw new Error('Falha ao carregar cores: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const corSelect = document.getElementById('corSelect');
        data.forEach(cor => {
            const option = document.createElement('option');
            option.value = cor.id;
            option.textContent = cor.nome;
            if(cor.id === idCor) option.selected = true;
            corSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar cores:', error);
        alert('Não foi possivel carregar os cores');
    });
};

function criarOpcoesCategoria(idCategoria) {
    fetch('/api/categoria', {})
    .then(response => {
        if(!response.ok) throw new Error('Falha ao carregar categorias: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const categoriaSelect = document.getElementById('categoriaSelect');
        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nome;
            if(categoria.id === idCategoria) option.selected = true;
            categoriaSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar categorias:', error);
        alert('Não foi possivel carregar os categorias');
    });
};

function criarOpcoesColecao(idColecao) {
    fetch('/api/colecao', {})
    .then(response => {
        if(!response.ok) throw new Error('Falha ao carregar colecaos: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const colecaoSelect = document.getElementById('colecaoSelect');
        data.forEach(colecao => {
            const option = document.createElement('option');
            option.value = colecao.id;
            option.textContent = colecao.nome;
            if(colecao.id === idColecao) option.selected = true;
            colecaoSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar coleções:', error);
        alert('Não foi possivel carregar os coleções');
    });
};

function getUrlParametro(parametroNome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametroNome);
}

async function carregarLocaisParaMemoria() {
    try {
        const response = await fetch('/api/localArmazenamento');
        if (!response.ok) throw new Error('Erro ao buscar locais');
        locaisDisponiveis = await response.json();
    } catch (error) {
        console.error('Erro ao carregar locais:', error);
        alert('Erro ao carregar lista de locais de armazenamento');
    }
}

async function carregarEstoqueExistente(idProduto) {
    try {
        const response = await fetch(`/api/estoque/produto/${idProduto}`);
        const estoqueLista = await response.json();

        estoqueLista.forEach(item => {
            desenharCard(item.id, item.local.nome, item.metrosEmEstoque);
        });
    } catch (error) {
        console.error("Erro ao carregar estoque", error);
    }
}

function desenharCard(idRelacaoBanco, nomeLocalExistente, quantidade) {
    const container = document.getElementById('locais-container');
    const idUnico = Date.now() + Math.random().toString(16).slice(2); 
    
    const card = document.createElement('div');
    card.className = 'card-local';
    card.id = `card-${idUnico}`;
    
    if (idRelacaoBanco) {
        card.dataset.idRelacao = idRelacaoBanco;
    } else {
        card.dataset.idRelacao = "novo";
    }

    let htmlConteudoLocal = '';
    let htmlBotaoDelete = '';

    if (idRelacaoBanco) {
        htmlConteudoLocal = `
            <div class="campo-linha" style="flex-grow: 4; justify-content: center;">
                <label class="label" style="font-size: 14px; margin-bottom: 2px; color: #666;">Local Cadastrado:</label>
                <span style="font-size: 18px; font-weight: bold; color: #02203a; padding-left: 5px;">
                    ${nomeLocalExistente}
                </span>
            </div>
        `;
        
        htmlBotaoDelete = `
            <button type="button" class="btn-remover-linha" 
                onclick="deletarRelacaoBanco('${idRelacaoBanco}', '${idUnico}')" 
                title="Excluir do Banco de Dados">
                X
            </button>
        `;

    } else {
        let optionsHtml = '<option></option>';
        locaisDisponiveis.forEach(local => {
            optionsHtml += `<option value="${local.id}">${local.nome}</option>`;
        });

        htmlConteudoLocal = `
            <div class="campo-linha" style="flex-grow: 4;">
                <label class="label" style="font-size: 14px; margin-bottom: 5px;">Local:</label>
                <select id="select-local-${idUnico}" class="select-local" style="width: 100%;" required>
                    ${optionsHtml}
                </select>
            </div>
        `;

        htmlBotaoDelete = `
            <button type="button" class="btn-remover-linha" 
                onclick="removerCardVisual('${idUnico}')" 
                title="Remover da lista">
                X
            </button>
        `;
    }

    card.innerHTML = `
        ${htmlConteudoLocal}

        <div class="campo-linha" style="flex-grow: 1;">
            <label class="label" style="font-size: 14px; margin-bottom: 5px;">Metros:</label>
            <input type="number" class="input-estoque input" step="0.01" min="0" placeholder="0" value="${quantidade}" required>
        </div>

        ${htmlBotaoDelete}
    `;

    container.appendChild(card);

    if (!idRelacaoBanco) {
        $(`#select-local-${idUnico}`).select2({
            placeholder: "Selecione um local",
            allowClear: true,
            width: '100%'
        });
    }
}

window.deletarRelacaoBanco = async function(idRelacao, idCardHtml) {
    if(!confirm("Tem certeza? Isso apagará este estoque do banco de dados permanentemente.")) return;

    try {
        const response = await fetch(`/api/estoque/${idRelacao}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            document.getElementById(`card-${idCardHtml}`).remove();
            alert("Estoque removido do banco.");
        } else {
            alert("Erro ao remover do banco.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}

window.removerCardVisual = function(idCardHtml) {
    const card = document.getElementById(`card-${idCardHtml}`);
    if (card) card.remove();
}