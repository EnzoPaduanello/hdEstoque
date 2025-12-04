document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('cadastroForm')

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
            const response = await fetch('/api/categoria', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoriaData)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar categoria');
            }

            const result = await response.json(); // Resposta do servidor
            
            console.log('Sucesso:', result);
            alert('Categoria cadastrada com sucesso!');
            
            form.reset();
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar com o servidor.');
        }
    })
});