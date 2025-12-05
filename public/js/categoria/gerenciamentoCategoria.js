document.addEventListener('DOMContentLoaded', async function() {
    try{
        const response = await fetch('/api/categoria', {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Erro ao buscar categorias');
        }

        const listaCategorias = await response.json();

        criarLista(listaCategorias);

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Falha ao conectar com o servidor.');
    }

    const cadastrarButtom = document.getElementById('cadastrar-button');

    cadastrarButtom.addEventListener('click', function(event) {
        event.preventDefault();

        window.location.assign('/categoria/cadastro')
    });
});

function criarLista(categorias){
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    categorias.forEach(categoria => {
        const aElement = document.createElement('a');
        aElement.href = '/categoria/edicao?id=' + categoria.id;

        const ulElement = document.createElement('ul');
        ulElement.id = categoria.id;
        ulElement.className = 'dados-list';

        const lNome = document.createElement('li');
        const lDescricao = document.createElement('li');

        lNome.textContent = 'Nome: ' + categoria.nome;
        lDescricao.textContent = `Descrição: ${categoria.descricao || ''}`;

        ulElement.appendChild(lNome);
        ulElement.appendChild(lDescricao);

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}