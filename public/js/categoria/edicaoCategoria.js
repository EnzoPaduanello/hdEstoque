document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('edicaoForm')

    const id = getParametroUrl('id');

    carregarDados(id);

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nome = document.getElementById('nomeInput').value.trim().toUpperCase();
        const descricao = document.getElementById('descricaoInput').value.trim();

        const categoriaData = {
            nome
        }

        if(descricao.length > 0){
            categoriaData.descricao = descricao
        }

        console.log(categoriaData)
            
        try{
            const response = await fetch(`/api/categoria/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoriaData)
            });

            if (!response.ok) {
                throw new Error('Erro ao editar categoria');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Categoria editada com sucesso!');
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});

async function carregarDados(id){
    try{
        const response = await fetch(`/api/categoria/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados da categoria');
        }

        const categoria = await response.json();

        document.getElementById('nomeInput').value = categoria.nome;
        document.getElementById('descricaoInput').value = categoria.descricao || '';
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Falha ao carregar dados da categoria.');
    }
}

function getParametroUrl(parametro) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(parametro);
};