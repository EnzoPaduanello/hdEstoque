document.addEventListener('DOMContentLoaded', async function() {
    try{
        const response = await fetch('/api/produto', {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        const listaProdutos = await response.json();

        criarLista(listaProdutos);

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Falha ao conectar com o servidor.');
    }

    const cadastrarButtom = document.getElementById('cadastrar-button');

    cadastrarButtom.addEventListener('click', function(event) {
        event.preventDefault();

        window.location.assign('/produto/cadastro')
    });
});

function criarLista(produtos){
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    produtos.forEach(produto => {
        const aElement = document.createElement('a');
        aElement.href = '/produto/edicao?id=' + produto.id;

        const ulElement = document.createElement('ul');
        ulElement.id = produto.id;
        ulElement.className = 'dados-list';

        const lNome = document.createElement('li');
        const lMaterial = document.createElement('li');
        const lCor = document.createElement('li');
        const lCategoria = document.createElement('li');
        const lColecao = document.createElement('li');
        const lPreco = document.createElement('li');
        const lDisponivelFazer = document.createElement('li');

        let emEstoque = 0;

        console.log(produto);

        produto.produtoLocalArmazenamentos.forEach(localArmazenamento => {
            emEstoque = emEstoque + localArmazenamento.metrosEmEstoque;
        });

        const disponivelFazer = Math.floor(emEstoque / produto.gastoMaterialMetro);

        lNome.textContent = 'Nome: ' + produto.nome;
        lMaterial.textContent = `Material: ${produto.material.nome || ''}`;
        lCor.textContent = `Cor: ${produto.cor.nome || ''}`;
        lCategoria.textContent = `Categoria: ${produto.categoria.nome || ''}`;
        lColecao.textContent = `Coleção: ${produto.colecao.nome || ''}`;
        lPreco.textContent = `Preço: R$ ${produto.preco || ''}`;
        lDisponivelFazer.textContent = `Disponível para fazer: ${disponivelFazer}`;


        ulElement.appendChild(lNome);
        ulElement.appendChild(lMaterial);
        ulElement.appendChild(lCor);
        ulElement.appendChild(lCategoria);
        ulElement.appendChild(lColecao);
        ulElement.appendChild(lPreco);
        ulElement.appendChild(lDisponivelFazer);

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}