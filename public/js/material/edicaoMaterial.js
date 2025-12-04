document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('edicaoForm')

    const id = getParametroUrl('id');

    carregarDados(id);

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nome = document.getElementById('nomeInput').value.trim().toUpperCase();
        const descricao = document.getElementById('descricaoInput').value.trim();

        const materialData = {
            nome
        }

        if(descricao.length > 0){
            materialData.descricao = descricao
        }

        console.log(materialData)
            
        try{
            const response = await fetch(`/api/material/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(materialData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar material');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Material cadastrada com sucesso!');
            
            form.reset();
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});

async function carregarDados(id){
    try{
        const response = await fetch(`/api/material/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do material');
        }

        const material = await response.json();

        document.getElementById('nomeInput').value = material.nome;
        document.getElementById('descricaoInput').value = material.descricao || '';
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Falha ao carregar dados do material.');
    }
}

function getParametroUrl(parametro) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(parametro);
};