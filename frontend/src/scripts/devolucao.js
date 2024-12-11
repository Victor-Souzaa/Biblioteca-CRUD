// Função para enviar dados da devolução para o back-end
document.querySelector('.return-form').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const emprestimoId = document.getElementById('livro').value; // ID do empréstimo, que será enviado como parâmetro
    const exemplarId = document.getElementById('livro').value; // ID do exemplar, conforme inserido no campo
    const estadoLivro = document.getElementById('estado').value; // Estado do livro
    const multa = document.getElementById('multa').value || 0; // Valor da multa, se houver
    const usuarioId = 1; // Substituir com o ID do usuário logado
  
    try {
      // Enviando os dados via POST para a rota de devolução do back-end
      const response = await fetch('/api/devolucao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emprestimoId,
          exemplarId,
          estadoLivro,
          multa,
          usuarioId,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.mensagem);
      } else {
        alert(`Erro: ${data.mensagem}`);
      }
    } catch (error) {
      console.error('Erro ao enviar a devolução:', error);
      alert('Ocorreu um erro ao registrar a devolução.');
    }
  });
  