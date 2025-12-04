document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('cadastroForm')

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
            const response = await fetch('/api/cor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(corData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar cor');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Cor cadastrada com sucesso!');
            
            form.reset();
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});