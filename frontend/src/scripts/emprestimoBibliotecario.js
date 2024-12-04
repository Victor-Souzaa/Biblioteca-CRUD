window.onload = function () {
    fetch('http://localhost:3000/api/emprestimo/reservas')
        .then(response => response.json())
        .then(data => {
            const reservasTbody = document.getElementById('reservasTbody');
            reservasTbody.innerHTML = '';

            data.reservas.forEach(reserva => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${reserva.usuario_nome}</td>
                    <td>${reserva.exemplar_titulo}</td>
                    <td>${new Date(reserva.data_solicitacao).toLocaleDateString('pt-BR')}</td>
                    <td>${reserva.status_reserva}</td>
                    <td><button class="btn-confirm" onclick="confirmarEmprestimo(${reserva.id_reserva})">Confirmar</button></td>
                `;
                reservasTbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro:', error));
};

function confirmarEmprestimo(idReserva) {
    const idBibliotecario = 1; // Troque pelo ID do bibliotecário autenticado
    fetch('http://localhost:3000/api/emprestimo/confirmar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idReserva, idBibliotecario })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensagem);
        window.location.reload(); // Atualiza a lista após confirmação
    })
    .catch(error => console.error('Erro:', error));
}
