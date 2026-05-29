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

    const form = document.getElementById('cadastroForm');

    await criarOpcoes();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nome = document.getElementById('nomeInput').value.trim().toUpperCase();
        const material = document.getElementById('materialSelect').value;
        const cor = document.getElementById('corSelect').value;
        const categoria = document.getElementById('categoriaSelect').value;
        const colecao = document.getElementById('colecaoSelect').value;
        const preco = document.getElementById('precoInput').valueAsNumber;
        const gastoMaterialMetro = document.getElementById('gastoMaterialInput').valueAsNumber;

        const produtoData = {
            nome,
            idMaterial: material,
            idCor: cor,
            idCategoria: categoria,
            idColecao: colecao,
            preco,
            gastoMaterialMetro
        }

        try{
            const response = await fetch('/api/produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produtoData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar produto');
            }

            const result = await response.json(); 
            
            console.log('Sucesso:', result);
            alert('Produto cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});

async function criarOpcoes() {
    criarOpcoesMaterial();
    criarOpcoesCor();
    criarOpcoesCategoria();
    criarOpcoesColecao();
}

function criarOpcoesMaterial() {
    fetch('/api/material', {})
    .then(response => {
        if(!response.ok) throw new Error('Falha ao carregar materiais: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const materialSelect = document.getElementById('materialSelect');
        data.forEach(material => {
            let option = new Option(material.nome, material.id);
            materialSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar materiais:', error);
        alert('Não foi possivel carregar os materiais');
    });
};

function criarOpcoesCor() {
    fetch('/api/cor', {})
    .then(response => {
        if(!response.ok) throw new Error('Falha ao carregar cores: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const corSelect = document.getElementById('corSelect');
        data.forEach(cor => {
            let option = new Option(cor.nome, cor.id);
            corSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar cores:', error);
        alert('Não foi possivel carregar os cores');
    });
};

function criarOpcoesCategoria() {
    fetch('/api/categoria', {})
    .then(response => {
        if(!response.ok) throw new Error('Falha ao carregar categorias: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const categoriaSelect = document.getElementById('categoriaSelect');
        data.forEach(categoria => {
            let option = new Option(categoria.nome, categoria.id);
            categoriaSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar categorias:', error);
        alert('Não foi possivel carregar os categorias');
    });
};

function criarOpcoesColecao() {
    fetch('/api/colecao', {})
    .then(response => {
        if(!response.ok) throw new Error('Falha ao carregar colecaos: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const colecaoSelect = document.getElementById('colecaoSelect');
        data.forEach(colecao => {
            let option = new Option(colecao.nome, colecao.id);
            colecaoSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar coleções:', error);
        alert('Não foi possivel carregar os coleções');
    });
};