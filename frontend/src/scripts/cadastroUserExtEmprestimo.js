// Menu de Hambúrguer - Abrir/Fechar
const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');

menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Enviar o formulário de cadastro
document.getElementById('formUsuarioExterno').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio do formulário para fazer a validação

    // Obtendo os dados do formulário
    const nomeCompleto = document.getElementById('nomeCompleto').value;
    const cpf = document.getElementById('cpf').value;
    const endereco = document.getElementById('endereco').value;
    const cep = document.getElementById('cep').value;
    const dataNascimento = document.getElementById('dataNascimento').value;

    const usuarioExterno = {
        nomeCompleto,
        cpf,
        endereco,
        cep,
        dataNascimento
    };

    try {
        const response = await fetch('http://localhost:3000/api/usuario-externo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioExterno)
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            // Limpar o formulário após o envio
            document.getElementById('formUsuarioExterno').reset();
        } else {
            const data = await response.json();
            alert(`Erro ao cadastrar: ${data.message}`);
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
});
