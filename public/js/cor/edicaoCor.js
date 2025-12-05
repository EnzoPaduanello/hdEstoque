document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('edicaoForm')

    const id = getParametroUrl('id');

    carregarDados(id);

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nome = document.getElementById('nomeInput').value.trim().toUpperCase();
        const descricao = document.getElementById('descricaoInput').value.trim();

        const corData = {
            nome
        }

        if(descricao.length > 0){
            corData.descricao = descricao
        }

        console.log(corData)
            
        try{
            const response = await fetch(`/api/cor/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(corData)
            });

            if (!response.ok) {
                throw new Error('Erro ao editar cor');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Cor editada com sucesso!');
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});

async function carregarDados(id){
    try{
        const response = await fetch(`/api/cor/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do cor');
        }

        const cor = await response.json();

        document.getElementById('nomeInput').value = cor.nome;
        document.getElementById('descricaoInput').value = cor.descricao || '';
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Falha ao carregar dados do cor.');
    }
}

function getParametroUrl(parametro) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(parametro);
};