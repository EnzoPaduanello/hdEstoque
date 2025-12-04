document.addEventListener('DOMContentLoaded', async function() {
    try{
        const response = await fetch('/api/cor', {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Erro ao buscar cores');
        }

        const listaCores = await response.json();

        criarLista(listaCores);

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Falha ao conectar com o servidor.');
    }

    const cadastrarButtom = document.getElementById('cadastrar-button');

    cadastrarButtom.addEventListener('click', function(event) {
        event.preventDefault();

        window.location.assign('/cor/cadastro')
    });
});

function criarLista(cores){
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    cores.forEach(cor => {
        const aElement = document.createElement('a');
        aElement.href = '/cor/edicao?id=' + cor.id;

        const ulElement = document.createElement('ul');
        ulElement.id = cor.id;
        ulElement.className = 'dados-list';

        const lNome = document.createElement('li');
        const lDescricao = document.createElement('li');

        lNome.textContent = 'Nome: ' + cor.nome;
        lDescricao.textContent = `Descrição: ${cor.descricao || ''}`;

        ulElement.appendChild(lNome);
        ulElement.appendChild(lDescricao);

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}