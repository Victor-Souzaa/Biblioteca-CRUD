// Seleciona os elementos
const menuButton = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

// Funcionalidade do menu de hambúrguer
menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fecha o menu ao clicar fora dele
window.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuButton.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Atualiza o título da aba com o nome do usuário
function atualizarTitulo(nomeUsuario) {
    document.title = `Biblioteca - ${nomeUsuario}`;
}

// Função para carregar os dados de livros, multas e empréstimos
async function carregarDadosBibliotecario() {
    try {
        // Faz a requisição para obter os dados
        const response = await fetch('http://localhost:3000/dados-bibliotecario');
        const dados = await response.json();

        // Atualiza os elementos na página com os dados recebidos
        document.getElementById('livros-disponiveis').textContent = dados.livros;
        document.getElementById('total-multas').textContent = dados.multas; // Exibe as multas como estão
        document.getElementById('total-emprestimos').textContent = dados.emprestimos;
    } catch (erro) {
        console.error('Erro ao carregar dados do bibliotecário:', erro);
        alert('Erro ao carregar os dados. Tente novamente mais tarde.');
    }
}


// Chama as funções quando a página carregar
window.onload = function() {
    carregarDadosBibliotecario();  // Carrega os dados do bibliotecário
};
