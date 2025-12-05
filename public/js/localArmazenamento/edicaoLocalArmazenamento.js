document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('edicaoForm')

    const id = getParametroUrl('id');

    carregarDados(id);

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nome = document.getElementById('nomeInput').value.trim().toUpperCase();
        const descricao = document.getElementById('descricaoInput').value.trim();

        const localArmazenamentoData = {
            nome
        }

        if(descricao.length > 0){
            localArmazenamentoData.descricao = descricao
        }

        console.log(localArmazenamentoData)
            
        try{
            const response = await fetch(`/api/localArmazenamento/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(localArmazenamentoData)
            });

            if (!response.ok) {
                throw new Error('Erro ao editar local de armazenamento');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Local de armazenamento editado com sucesso!');
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});

async function carregarDados(id){
    try{
        const response = await fetch(`/api/localArmazenamento/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do local de armazenamento');
        }

        const localArmazenamento = await response.json();

        document.getElementById('nomeInput').value = localArmazenamento.nome;
        document.getElementById('descricaoInput').value = localArmazenamento.descricao || '';
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Falha ao carregar dados do local de armazenamento.');
    }
}

function getParametroUrl(parametro) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(parametro);
};