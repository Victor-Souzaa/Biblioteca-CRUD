// Seleciona elementos do DOM
const menuButton = document.querySelector('.menu-hamburguer');
const navLinks = document.querySelector('.nav-links');
const searchButton = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
const livrosContainer = document.querySelector('.livros');
const paginationContainer = document.querySelector('.pagination');
const suggestionsContainer = document.createElement('div'); // Div para sugestões
searchInput.parentElement.appendChild(suggestionsContainer); // Adiciona a div de sugestões após o input

// Estado de Paginação e Pesquisa
let currentPage = 1;
const livrosPorPagina = 9;
let livrosAtuais = []; // Agora, começamos com uma lista vazia, que será preenchida via API

// Simulação do nome do usuário logado
const usuarioLogado = ""; // Substitua pelo nome dinâmico do usuário logado

// Função para exibir o nome do usuário no título
function exibirNomeUsuario() {
    document.title = `Biblioteca -  ${usuarioLogado}`; // Atualiza o título da página
}

// Menu de Hambúrguer - Abrir/Fechar
menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Exibe sugestões enquanto digita
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    if (query.length > 0) {
        fetchLivrosBusca(query); // Busca os livros filtrados
    } else {
        fetchLivros(); // Carrega todos os livros novamente quando a barra de pesquisa estiver vazia
    }
});

// Função para realizar a busca por título, autor ou assunto
async function fetchLivrosBusca(query) {
    try {
        const response = await fetch(`http://localhost:3000/livros/busca?query=${query}`);
        const data = await response.json();
        livrosAtuais = data; // Atualiza a lista com os livros encontrados
        renderLivros(); // Renderiza os livros filtrados
        renderPagination(); // Atualiza a paginação
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
    }
}

// Função para buscar todos os livros
async function fetchLivros() {
    try {
        const response = await fetch('http://localhost:3000/livros');
        const data = await response.json();
        livrosAtuais = data; // Atualiza a lista com todos os livros
        renderLivros(); // Renderiza os livros
        renderPagination(); // Renderiza a paginação
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
    }
}

// Renderiza os livros
function renderLivros() {
    const start = (currentPage - 1) * livrosPorPagina;
    const end = start + livrosPorPagina;
    const livrosPaginados = livrosAtuais.slice(start, end);

    if (livrosPaginados.length === 0) {
        livrosContainer.innerHTML = `<p>Nenhum título encontrado.</p>`;
        return;
    }

    livrosContainer.innerHTML = livrosPaginados
        .map(
            (livro) => `
        <div class="livro-card">
            <h3>${livro.nome}</h3>  <!-- Nome do livro -->
            <p><strong>ISBN:</strong> ${livro.isbn}</p>  <!-- ISBN -->
            <p><strong>Autor:</strong> ${livro.autor}</p>  <!-- Autor -->
            <p><strong>Editora:</strong> ${livro.editora}</p>  <!-- Editora -->
            <p><strong>Assunto:</strong> ${livro.assunto}</p>  <!-- Assunto -->
            <p><strong>Data de Adição:</strong> ${new Date(livro.dataAdicao).toLocaleDateString()}</p>  <!-- Data de adição -->
            <p><strong>Descrição:</strong> ${livro.descricao}</p>  <!-- Descrição do livro -->
        </div>
    `
        )
        .join('');
}


// Renderiza a paginação
function renderPagination() {
    const totalPaginas = Math.ceil(livrosAtuais.length / livrosPorPagina);

    if (totalPaginas <= 1) {
        paginationContainer.innerHTML = ''; // Remove a paginação se não for necessária
        return;
    }

    paginationContainer.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="mudarPagina('anterior')">⟵</button>
        ${Array.from({ length: totalPaginas }, (_, index) =>
            `
                <button class="${currentPage === index + 1 ? 'active' : ''}" onclick="mudarPagina(${index + 1})">${index + 1}</button>
            `.trim()
        ).join('')}
        <button ${currentPage === totalPaginas ? 'disabled' : ''} onclick="mudarPagina('proxima')">⟶</button>
    `;
}

// Muda de página
function mudarPagina(direcao) {
    const totalPaginas = Math.ceil(livrosAtuais.length / livrosPorPagina);

    if (direcao === 'anterior' && currentPage > 1) {
        currentPage--;
    } else if (direcao === 'proxima' && currentPage < totalPaginas) {
        currentPage++;
    } else if (typeof direcao === 'number') {
        currentPage = direcao;
    }

    renderLivros();
    renderPagination();
}

// Inicializa a página
function inicializar() {
    fetchLivros(); // Chama a função para buscar todos os livros do backend
    exibirNomeUsuario(); // Exibe o nome do usuário no título
}


// Chama a inicialização
inicializar();
