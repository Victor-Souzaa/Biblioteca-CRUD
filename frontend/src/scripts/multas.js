document.addEventListener('DOMContentLoaded', function () {
    const tabelaMultas = document.getElementById('tabela-multas').getElementsByTagName('tbody')[0];

    // Carregar as multas do backend
    fetch('http://localhost:3000/api/multas')
        .then(response => response.json())
        .then(multas => {
            multas.forEach(multa => {
                // Calcular o valor da multa com base nos dados do backend
                const diasTolerancia = multa.renovado ? 30 : 15;
                const diferencaDias = Math.ceil((new Date(multa.dataDevolucao) - new Date(multa.dataEmprestimo)) / (1000 * 60 * 60 * 24));
                const diasAtraso = diferencaDias > diasTolerancia ? diferencaDias - diasTolerancia : 0;
                const valorMulta = 20 + diasAtraso * 1; // R$ 20,00 fixo + R$ 1,00 por dia de atraso

                // Criar a linha da tabela
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${multa.usuario}</td>
                    <td>${multa.dataEmprestimo}</td>
                    <td>${multa.dataDevolucao}</td>
                    <td>R$${valorMulta.toFixed(2)}</td>
                    <td>${multa.status}</td>
                    <td><button onclick="pagarMulta(${multa.id})">Pagar</button></td>
                `;
                tabelaMultas.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar as multas:', error));
});

// Função para pagar a multa
function pagarMulta(id) {
    fetch(`http://localhost:3000/api/multa/pagar/${id}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem) {
            alert(data.mensagem);
            // Remover a linha da multa paga (opcional)
            const row = document.querySelector(`#multa-${id}`);
            if (row) {
                row.remove();
            }
        }
    })
    .catch(error => console.error('Erro ao pagar multa:', error));
}
