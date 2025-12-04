document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('cadastroForm')

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
            const response = await fetch('/api/localArmazenamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(localArmazenamentoData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar local de armazenamento');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Local de armazenamento cadastrado com sucesso!');
            
            form.reset();
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});