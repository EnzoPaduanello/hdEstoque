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

    const form = document.getElementById('edicaoForm');
    const idProduto = getUrlParametro('id');

    // 1. Carrega dados iniciais
    await carregarLocaisParaMemoria();
    const produto = await buscarDadosProduto(idProduto);
    await carregarDadosProduto(produto);
    
    // 2. CARREGA O ESTOQUE JÁ EXISTENTE (NOVA FUNÇÃO)
    await carregarEstoqueExistente(idProduto);

    // 3. Configura botão de adicionar (Cards NOVOS)
    const btnAdicionar = document.getElementById('adicionar-local-button');
    if(btnAdicionar){
        btnAdicionar.addEventListener('click', function() {
            // Passamos null no ID para indicar que é novo
            desenharCard(null, null, 0); 
        });
    }

    // 4. Submit do Formulário
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Pega dados básicos
        const nome = document.getElementById('nomeInput').value.trim().toUpperCase();
        const material = document.getElementById('materialSelect').value;
        const cor = document.getElementById('corSelect').value;
        const categoria = document.getElementById('categoriaSelect').value;
        const colecao = document.getElementById('colecaoSelect').value;
        const preco = document.getElementById('precoInput').valueAsNumber;
        const gasto = document.getElementById('gastoMaterialInput').valueAsNumber;

        // --- LÓGICA DE SEPARAÇÃO DE ESTOQUE ---
        const novosEstoques = [];
        const estoquesEditados = [];

        // Varre todos os cards na tela
        document.querySelectorAll('.card-local').forEach(card => {
            const idRelacao = card.dataset.idRelacao; // Pega o ID salvo no HTML (se existir)
            const inputQtd = card.querySelector('.input-estoque');
            const quantidade = inputQtd.valueAsNumber;

            if (idRelacao && idRelacao !== "novo") {
                // É um card EXISTENTE que foi carregado do banco (vamos atualizar a qtd)
                estoquesEditados.push({
                    id_relacao: idRelacao,
                    quantidade: quantidade
                });
            } else {
                // É um card NOVO (tem select)
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
            novosEstoques,     // Envia array de novos
            estoquesEditados   // Envia array de edições
        };

        try{
            const response = await fetch(`/api/produto/${idProduto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoData)
            });

            if (!response.ok) throw new Error('Erro ao salvar');
            
            alert('Produto e estoques atualizados!');
            location.reload(); // Recarrega para limpar os "novos" e virarem "existentes"
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar.');
        }
    })
});

async function buscarDadosProduto(idProduto) {
    try{
        const response = await fetch(`/api/produto/${idProduto}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar produto');
        }
        const produto = await response.json(); // Resposta do servidor
        
        return produto;
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Falha ao conectar com o servidor.');
    }
};

async function carregarDadosProduto(produto) {
    document.getElementById('nomeInput').value = produto.nome;
    document.getElementById('precoInput').value = produto.preco;
    document.getElementById('gastoMaterialInput').value = produto.gastoMaterialMetro;

    criarOpcoesMaterial(produto.idMaterial);
    criarOpcoesCor(produto.idCor);
    criarOpcoesCategoria(produto.idCategoria);
    criarOpcoesColecao(produto.idColecao);
};

function criarOpcoesMaterial(idMaterial) {
    // Lógica para criar opções do material
    fetch('/api/material', {
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Falha ao carregar materiais: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const materialSelect = document.getElementById('materialSelect');
        data.forEach(material => {
            const option = document.createElement('option');
            option.value = material.id;
            option.textContent = material.nome;

            if(material.id === idMaterial) {
                option.selected = true;
            }

            materialSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar materiais:', error);
        alert('Não foi possivel carregar os materiais');
    });
};

function criarOpcoesCor(idCor) {
    // Lógica para criar opções do cor
    fetch('/api/cor', {
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Falha ao carregar cores: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const corSelect = document.getElementById('corSelect');
        data.forEach(cor => {
            const option = document.createElement('option');
            option.value = cor.id;
            option.textContent = cor.nome;

            if(cor.id === idCor) {
                option.selected = true;
            }

            corSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar cores:', error);
        alert('Não foi possivel carregar os cores');
    });
};

function criarOpcoesCategoria(idCategoria) {
    // Lógica para criar opções do categoria
    fetch('/api/categoria', {
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Falha ao carregar categorias: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const categoriaSelect = document.getElementById('categoriaSelect');
        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nome;

            if(categoria.id === idCategoria) {
                option.selected = true;
            }

            categoriaSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar categorias:', error);
        alert('Não foi possivel carregar os categorias');
    });
};

function criarOpcoesColecao(idColecao) {
    // Lógica para criar opções de coleção
    fetch('/api/colecao', {
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Falha ao carregar colecaos: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const colecaoSelect = document.getElementById('colecaoSelect');
        data.forEach(colecao => {
            const option = document.createElement('option');
            option.value = colecao.id;
            option.textContent = colecao.nome;

            if(colecao.id === idColecao) {
                option.selected = true;
            }

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

// Função que busca os locais na API e guarda na variável
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
            // Chama a função de desenho passando os dados do banco
            // item.local.nome vem do include no Controller
            desenharCard(item.id, item.local.nome, item.metrosEmEstoque);
        });
    } catch (error) {
        console.error("Erro ao carregar estoque", error);
    }
}

// Função que cria o Card na tela
function desenharCard(idRelacaoBanco, nomeLocalExistente, quantidade) {
    const container = document.getElementById('locais-container');
    const idUnico = Date.now() + Math.random().toString(16).slice(2); // ID único pro HTML
    
    const card = document.createElement('div');
    card.className = 'card-local';
    card.id = `card-${idUnico}`;
    
    // Se tiver idRelacaoBanco, guardamos no dataset para saber depois
    if (idRelacaoBanco) {
        card.dataset.idRelacao = idRelacaoBanco;
    } else {
        card.dataset.idRelacao = "novo";
    }

    let htmlConteudoLocal = '';
    let htmlBotaoDelete = '';

    // --- CENÁRIO 1: RELAÇÃO JÁ EXISTE (Vem do Banco) ---
    if (idRelacaoBanco) {
        // Apenas Texto (sem Select)
        htmlConteudoLocal = `
            <div class="campo-linha" style="flex-grow: 4; justify-content: center;">
                <label class="label" style="font-size: 14px; margin-bottom: 2px; color: #666;">Local Cadastrado:</label>
                <span style="font-size: 18px; font-weight: bold; color: #02203a; padding-left: 5px;">
                    ${nomeLocalExistente}
                </span>
            </div>
        `;
        
        // Botão que DELETA DO BANCO
        htmlBotaoDelete = `
            <button type="button" class="btn-remover-linha" 
                onclick="deletarRelacaoBanco('${idRelacaoBanco}', '${idUnico}')" 
                title="Excluir do Banco de Dados">
                X
            </button>
        `;

    } 
    // --- CENÁRIO 2: NOVO CARD (Criado pelo botão) ---
    else {
        // Select normal
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

        // Botão que APENAS REMOVE DO HTML
        htmlBotaoDelete = `
            <button type="button" class="btn-remover-linha" 
                onclick="removerCardVisual('${idUnico}')" 
                title="Remover da lista">
                X
            </button>
        `;
    }

    // Monta o HTML Final
    card.innerHTML = `
        ${htmlConteudoLocal}

        <div class="campo-linha" style="flex-grow: 1;">
            <label class="label" style="font-size: 14px; margin-bottom: 5px;">Metros:</label>
            <input type="number" class="input-estoque input" step="0.01" min="0" placeholder="0" value="${quantidade}" required>
        </div>

        ${htmlBotaoDelete}
    `;

    container.appendChild(card);

    // Se for novo, ativa o Select2
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

// Função para remover visualmente (usada no botão X dos itens novos)
window.removerCardVisual = function(idCardHtml) {
    const card = document.getElementById(`card-${idCardHtml}`);
    if (card) card.remove();
}