document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('cadastroForm')

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
            const response = await fetch('/api/colecao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(colecaoData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar colecao');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Colecao cadastrada com sucesso!');
            
            form.reset();
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});