document.getElementById('formEmprestimo').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuarioNome = document.getElementById('usuarioNome').value.trim();
    const usuarioEmail = document.getElementById('usuarioEmail').value.trim();
    const exemplarTitulo = document.getElementById('exemplarTitulo').value.trim();

    // Validando se os campos não estão vazios
    if (!usuarioNome || !usuarioEmail || !exemplarTitulo) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verificando se o e-mail tem um formato válido
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(usuarioEmail)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Preparando os dados para envio
    const data = {
        nomeUsuario: usuarioNome,
        emailUsuario: usuarioEmail,
        nomeTitulo: exemplarTitulo
    };

    // Enviando a requisição POST para a API
    fetch('http://localhost:3000/api/emprestimo/reservar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Mensagem de sucesso ou erro
        alert(data.mensagem || 'Erro desconhecido.');
        if (data.mensagem) {
            document.getElementById('formEmprestimo').reset();  // Limpa o formulário se a reserva foi feita
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao realizar a reserva. Tente novamente.');
    });
});
