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

            const result = await response.json(); // Resposta do servidor
            
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
            let option = new Option(colecao.nome, colecao.id);
            colecaoSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar coleções:', error);
        alert('Não foi possivel carregar os coleções');
    });
};