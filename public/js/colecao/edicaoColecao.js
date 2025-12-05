document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('edicaoForm')

    const id = getParametroUrl('id');

    carregarDados(id);

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nome = document.getElementById('nomeInput').value.trim().toUpperCase();
        const descricao = document.getElementById('descricaoInput').value.trim();

        const colecaoData = {
            nome
        }

        if(descricao.length > 0){
            colecaoData.descricao = descricao
        }

        console.log(colecaoData)
            
        try{
            const response = await fetch(`/api/colecao/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(colecaoData)
            });

            if (!response.ok) {
                throw new Error('Erro ao editar coleção');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Coleção editada com sucesso!');
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});

async function carregarDados(id){
    try{
        const response = await fetch(`/api/colecao/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados da coleção');
        }

        const colecao = await response.json();

        document.getElementById('nomeInput').value = colecao.nome;
        document.getElementById('descricaoInput').value = colecao.descricao || '';
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Falha ao carregar dados da coleção.');
    }
}

function getParametroUrl(parametro) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(parametro);
};