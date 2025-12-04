document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('cadastroForm')

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
            const response = await fetch('/api/material', {
                method: 'POST',
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