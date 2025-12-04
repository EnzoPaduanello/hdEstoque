document.addEventListener('DOMContentLoaded', async function() {
    try{
        const response = await fetch('/api/material', {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Erro ao buscar materiais');
        }

        const listaMateriais = await response.json();

        criarLista(listaMateriais);

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Falha ao conectar com o servidor.');
    }

    const cadastrarButtom = document.getElementById('cadastrar-button');

    cadastrarButtom.addEventListener('click', function(event) {
        event.preventDefault();

        window.location.assign('/material/cadastro')
    });
});

function criarLista(materiais){
    const divLista = document.getElementById('list-div');

    while (divLista.querySelector('a')) {
        divLista.querySelector('a').remove();
    }

    materiais.forEach(material => {
        const aElement = document.createElement('a');
        aElement.href = '/material/edicao?id=' + material.id;

        const ulElement = document.createElement('ul');
        ulElement.id = material.id;
        ulElement.className = 'dados-list';

        const lNome = document.createElement('li');
        const lDescricao = document.createElement('li');

        lNome.textContent = 'Nome: ' + material.nome;
        lDescricao.textContent = `Descrição: ${material.descricao || 'Sem descrição'}`;

        ulElement.appendChild(lNome);
        ulElement.appendChild(lDescricao);

        aElement.appendChild(ulElement)

        divLista.appendChild(aElement);
    });
}