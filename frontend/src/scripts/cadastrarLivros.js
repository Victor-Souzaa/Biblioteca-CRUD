// Seleciona os elementos do DOM
const menuButton = document.querySelector('.menu-hamburguer');
const navLinks = document.querySelector('.nav-links');
const form = document.getElementById('cadastro-livro-form');

// Menu de Hambúrguer - Abrir/Fechar
menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Função para enviar os dados do formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const formData = new FormData(form);
    const quantidadeExemplares = parseInt(formData.get('quantidade_exemplares')) || 1; // Garantir que o valor seja um número

    const data = {
        nome: formData.get('titulo'),
        isbn: formData.get('isbn'),
        autor: formData.get('autor'),
        editora: formData.get('editora'),
        assunto: formData.get('assunto'),
        edicao: formData.get('edicao'),
        quantidade_exemplares: quantidadeExemplares
    };

    try {
        // Envia a requisição POST para a API
        const response = await fetch('http://localhost:3000/livros', { // Backend está na porta 3000
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Verifica se a requisição foi bem-sucedida
        if (response.ok) {
            alert('Livro cadastrado com sucesso!');
            form.reset(); // Limpa o formulário
        } else {
            // Caso o erro seja retornado pela API
            const errorData = await response.json();
            console.error('Erro ao cadastrar o livro:', errorData.error || errorData.message);
            alert('Erro ao cadastrar o livro: ' + (errorData.error || errorData.message));
        }
    } catch (error) {
        // Caso o erro seja no JavaScript ou na requisição
        console.error('Erro ao enviar a requisição:', error);
        alert('Ocorreu um erro ao cadastrar o livro JS');
    }
});
