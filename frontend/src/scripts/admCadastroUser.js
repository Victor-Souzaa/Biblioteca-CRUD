// Menu de Hambúrguer - Abrir/Fechar
const menuButton = document.querySelector('.menu-hamburguer');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Verifica se é necessário exibir o campo de matrícula
document.getElementById('tipoUsuario').addEventListener('change', function() {
    const tipoUsuario = this.value;
    const matriculaField = document.getElementById('matricula');
    const matriculaLabel = document.getElementById('matriculaLabel');
    const display = ['Aluno', 'Professor', 'Bibliotecario'].includes(tipoUsuario) ? 'block' : 'none';
    matriculaField.style.display = display;
    matriculaLabel.style.display = display;
});

// Função para cadastrar o usuário
async function cadastrarUsuario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const dadosUsuario = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        tipo_usuario: document.getElementById('tipoUsuario').value,
        matricula: document.getElementById('matricula').value || null
    };

    try {
        // Faz a requisição POST para a API
        const response = await fetch('http://localhost:3000/usuarios/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.mensagem); // Mostra mensagem de sucesso
            window.location.href = '../pages/admCadastroUser.html'; // Redireciona para a página desejada
        } else {
            alert(`Erro: ${resultado.mensagem}`);
        }
    } catch (erro) {
        console.error('Erro ao cadastrar o usuário:', erro);
        alert('Ocorreu um erro ao cadastrar o usuário. Tente novamente.');
    }
}
