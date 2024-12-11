window.onload = function () {
    // Buscar os empréstimos que podem ser renovados ou já foram renovados
    fetch('http://localhost:3000/api/emprestimo/renovacoes')
        .then(response => response.json())
        .then(data => {
            const renovacoesTbody = document.getElementById('renovacoesTbody');
            renovacoesTbody.innerHTML = ''; // Limpa a lista antes de adicionar os novos dados

            // Adiciona as renovacoes na tabela
            data.renovacoes.forEach(renovacao => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${renovacao.usuario_nome}</td>
                    <td>${renovacao.titulo_livro}</td>
                    <td>${new Date(renovacao.data_pegou).toLocaleDateString('pt-BR')}</td>
                    <td>${renovacao.data_renovacao ? new Date(renovacao.data_renovacao).toLocaleDateString('pt-BR') : 'Nunca'}</td>
                    <td>
                        <button class="btn-renovar" onclick="renovarEmprestimo(${renovacao.id})">Renovar</button>
                    </td>
                `;
                renovacoesTbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
};

function renovarEmprestimo(emprestimoId) {
    // Envia a requisição de renovação do empréstimo
    fetch('http://localhost:3000/api/emprestimo/renovar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emprestimoId })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensagem);
        if (data.mensagem === 'Empréstimo renovado com sucesso!') {
            window.location.reload(); // Atualiza a página para refletir a renovação
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}
