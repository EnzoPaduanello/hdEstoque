document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('produtoNav').addEventListener('click', function(event){
        event.preventDefault();

        window.location.href = '/produto'
    });

    document.getElementById('materialNav').addEventListener('click', function(event){
        event.preventDefault();

        window.location.href = '/material'
    });

    document.getElementById('corNav').addEventListener('click', function(event){
        event.preventDefault();

        window.location.href = '/cor'
    });

    document.getElementById('categoriaNav').addEventListener('click', function(event){
        event.preventDefault();

        window.location.href = '/categoria'
    });

    document.getElementById('colecaoNav').addEventListener('click', function(event){
        event.preventDefault();

        window.location.href = '/colecao'
    });

    document.getElementById('localArmazenamentoNav').addEventListener('click', function(event){
        event.preventDefault();

        window.location.href = '/localArmazenamento'
    });
})