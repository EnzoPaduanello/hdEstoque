document.addEventListener('DOMContentLoaded', async function() {
    try{
        const response = await fetch('/api/colecao', {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Erro ao buscar colecoes');
        }

        const listaColecoes = await response.json();

        criarLista(listaColecoes);

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Falha ao conectar com o servidor.');
    }

    const cadastrarButtom = document.getElementById('cadastrar-button');

    cadastrarButtom.addEventListener('click', function(event) {
        event.preventDefault();

        window.location.assign('/colecao/cadastro')
    });
});

function criarLista(colecoes){
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    colecoes.forEach(colecao => {
        const aElement = document.createElement('a');
        aElement.href = '/colecao/edicao?id=' + colecao.id;

        const ulElement = document.createElement('ul');
        ulElement.id = colecao.id;
        ulElement.className = 'dados-list';

        const lNome = document.createElement('li');
        const lDescricao = document.createElement('li');

        lNome.textContent = 'Nome: ' + colecao.nome;
        lDescricao.textContent = `Descrição: ${colecao.descricao || ''}`;

        ulElement.appendChild(lNome);
        ulElement.appendChild(lDescricao);

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}