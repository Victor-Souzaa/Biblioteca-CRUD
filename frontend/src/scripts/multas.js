document.addEventListener('DOMContentLoaded', function () {
    const tabelaMultas = document.getElementById('tabela-multas').getElementsByTagName('tbody')[0];
    const gerarMultasBtn = document.getElementById('gerar-multas-btn');

    // Função para carregar as multas
    function carregarMultas() {
        fetch('http://localhost:3000/api/multas')
            .then(response => response.json())
            .then(multas => {
                tabelaMultas.innerHTML = ''; // Limpar tabela antes de adicionar novas linhas
                multas.forEach(multa => {
                    // Cálculo da multa baseado nas informações retornadas da API
                    const diasTolerancia = 15; // Considerando tolerância de 15 dias
                    const diferencaDias = multa.dataDevolucao !== 'Não devolvido' ?
                        Math.ceil((new Date() - new Date(multa.dataDevolucao)) / (1000 * 60 * 60 * 24)) :
                        0;
                    const diasAtraso = diferencaDias > diasTolerancia ? diferencaDias - diasTolerancia : 0;
                    const valorMulta = multa.valor || (diasAtraso > 0 ? 20 + (diasAtraso * 1) : 0); // Se valor estiver vazio, calcula

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
    }

    // Chama a função para carregar as multas ao iniciar a página
    carregarMultas();

    // Evento para gerar as multas
    gerarMultasBtn.addEventListener('click', function () {
        fetch('http://localhost:3000/api/multas/gerar', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensagem) {
                alert(data.mensagem);
                carregarMultas();  // Recarregar as multas após gerar
            }
        })
        .catch(error => console.error('Erro ao gerar as multas:', error));
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
});
