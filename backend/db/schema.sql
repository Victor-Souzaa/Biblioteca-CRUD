-- Criação da Tabela de Usuários com tipo de usuário incluindo 'Administrador'
CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL CHECK (tipo_usuario IN ('Aluno', 'Professor', 'Bibliotecario', 'Externo', 'Administrador')),  -- 'Administrador' adicionado
    matricula VARCHAR(50) UNIQUE,  -- Para Alunos e Professores
    cpf VARCHAR(14) UNIQUE,  -- Para Usuários Externos
    endereco_completo TEXT,  -- Para Usuários Externos
    cep VARCHAR(10),  -- Para Usuários Externos
    data_nascimento DATE,  -- Para Usuários Externos
    numero_registro VARCHAR(50) UNIQUE,  -- Para Usuários Externos
    bloqueado BOOLEAN DEFAULT FALSE,  -- Nova coluna para verificar se o usuário está bloqueado
    data_bloqueio DATE  -- Nova coluna para armazenar a data de bloqueio do usuário
);

-- Criação da Tabela de Títulos
CREATE TABLE Titulo (
    id_titulo SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    autor VARCHAR(255) NOT NULL,
    editora VARCHAR(255),
    assunto VARCHAR(255),
    edicao VARCHAR(50)
);

-- Criação da Tabela de Acervo
CREATE TABLE Acervo (
    id_acervo SERIAL PRIMARY KEY,
    id_titulo INT NOT NULL,
    data_inclusao DATE NOT NULL,
    FOREIGN KEY (id_titulo) REFERENCES Titulo(id_titulo)
);

-- Criação da Tabela de Exemplares com estado restrito a 'Bom' ou 'Danificado'
CREATE TABLE Exemplares (
    id_exemplar SERIAL PRIMARY KEY,
    id_acervo INT NOT NULL,
    estado VARCHAR(50) DEFAULT 'Bom' CHECK (estado IN ('Bom', 'Danificado')),  -- Estado alterado para 'Bom' ou 'Danificado'
    status_disponibilidade BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_acervo) REFERENCES Acervo(id_acervo)
);

-- Criação da Tabela de Administradores
CREATE TABLE Administrador (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

-- Criação da Tabela de Bibliotecários
CREATE TABLE Bibliotecario (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL
);

-- Criação da Tabela de Empréstimos
CREATE TABLE Emprestimo (
    id SERIAL PRIMARY KEY,
    data_pegou DATE NOT NULL,
    data_devolveu DATE,
    id_usuario INT NOT NULL,
    id_exemplar INT NOT NULL,
    data_renovacao DATE,
    FOREIGN KEY (id_exemplar) REFERENCES Exemplares(id_exemplar),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criação da Tabela de Multas
CREATE TABLE Multa (
    id SERIAL PRIMARY KEY,
    valor DECIMAL(10, 2) NOT NULL DEFAULT 20.00,
    data DATE NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criação da Tabela de Pesquisas
CREATE TABLE Pesquisa (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    id_usuario INT NOT NULL,
    id_titulo INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_titulo) REFERENCES Titulo(id_titulo)
);

-- Criação da Tabela de Devoluções
CREATE TABLE Devolucao (
    id_devolucao SERIAL PRIMARY KEY,
    data_devolucao DATE NOT NULL,
    id_emprestimo INT NOT NULL,
    id_usuario INT NOT NULL,
    id_exemplar INT NOT NULL,
    multa_aplicada DECIMAL(10, 2) DEFAULT 0.00,
    estado_devolucao VARCHAR(50) CHECK (estado_devolucao IN ('Bom', 'Danificado')),
    observacoes TEXT,
    FOREIGN KEY (id_emprestimo) REFERENCES Emprestimo(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_exemplar) REFERENCES Exemplares(id_exemplar)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criação da Tabela de Reservas de Empréstimos
CREATE TABLE Reserva (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_exemplar INT NOT NULL,
    data_reserva DATE NOT NULL DEFAULT CURRENT_DATE,
    status_reserva VARCHAR(50) DEFAULT 'Pendente',  -- Pode ser 'Pendente', 'Confirmada' ou 'Cancelada'
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_exemplar) REFERENCES Exemplares(id_exemplar)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inserir Título
INSERT INTO Titulo (nome, isbn, autor, editora, assunto, edicao)
VALUES 
  ('Livro Exemplo', '9781234567890', 'Autor Exemplo', 'Editora Exemplo', 'Assunto Exemplo', '1ª edição');

-- Inserir Acervo com id_titulo existente
INSERT INTO Acervo (id_titulo, data_inclusao)
VALUES 
  (1, CURRENT_DATE);  -- Certifique-se de que id_titulo 1 existe na tabela Titulo

-- Inserir Exemplares com id_acervo válido
INSERT INTO Exemplares (id_acervo, estado, status_disponibilidade)
VALUES (1, 'Bom', TRUE);  -- id_acervo 1 deve existir na tabela Acervo

-- Criar Administrador
INSERT INTO Usuario (nome, email, senha, tipo_usuario) 
VALUES ('Administrador Exemplo', 'admin@exemplo.com', 'senha123', 'Administrador');

-- Criar Bibliotecário
INSERT INTO Usuario (nome, email, senha, tipo_usuario, matricula) 
VALUES ('Bibliotecário Exemplo', 'bibliotecario@exemplo.com', 'senha123', 'Bibliotecario', 'BIB123');

-- Criar Aluno
INSERT INTO Usuario (nome, email, senha, tipo_usuario, matricula) 
VALUES ('Aluno Exemplo', 'aluno@exemplo.com', 'senha123', 'Aluno', 'ALUNO123');

-- Criar Professor
INSERT INTO Usuario (nome, email, senha, tipo_usuario, matricula) 
VALUES ('Professor Exemplo', 'professor@exemplo.com', 'senha123', 'Professor', 'PROF123');

-- Inserir Empréstimo com Exemplares válidos
INSERT INTO Emprestimo (id_usuario, id_exemplar, data_pegou, data_devolveu, data_renovacao)
VALUES (1, 1, NOW(), NULL, NULL);  -- id_exemplar 1 deve existir na tabela Exemplares

-- Alterar tipo de dado ISBN na tabela Titulo
ALTER TABLE Titulo
ALTER COLUMN isbn TYPE VARCHAR(20);

INSERT INTO Titulo (nome, isbn, autor, editora, assunto, edicao) VALUES
('Clean Code: A Handbook of Agile Software Craftsmanship', '978-0132350884', 'Robert C. Martin', 'Prentice Hall', 'Programação', '1ª Edição'),
('Introduction to Algorithms', '978-0262033848', 'Thomas H. Cormen', 'MIT Press', 'Algoritmos', '3ª Edição'),
('The Pragmatic Programmer: Your Journey to Mastery', '978-0201616225', 'Andrew Hunt, David Thomas', 'Addison-Wesley', 'Programação', '20ª Edição'),
('Design Patterns: Elements of Reusable Object-Oriented Software', '978-0201633611', 'Erich Gamma', 'Addison-Wesley', 'Design Patterns', '1ª Edição'),
('Code Complete: A Practical Handbook of Software Construction', '978-0735619679', 'Steve McConnell', 'Microsoft Press', 'Programação', '2ª Edição'),
('Refactoring: Improving the Design of Existing Code', '978-0201485678', 'Martin Fowler', 'Addison-Wesley', 'Programação', '1ª Edição'),
('JavaScript: The Good Parts', '978-0596517749', 'Douglas Crockford', 'OReilly Media', 'JavaScript', '1ª Edição'),
('The Art of Computer Programming', '978-0201896832', 'Donald E. Knuth', 'Addison-Wesley', 'Algoritmos', '1ª Edição'),
('The Mythical Man-Month: Essays on Software Engineering', '978-0201835954', 'Frederick P. Brooks Jr.', 'Addison-Wesley', 'Gestão', '1ª Edição'),
('Patterns of Enterprise Application Architecture', '978-0321127427', 'Martin Fowler', 'Addison-Wesley', 'Design Patterns', '1ª Edição'),
('The Clean Coder: A Code of Conduct for Professional Programmers', '978-0137081074', 'Robert C. Martin', 'Prentice Hall', 'Programação', '1ª Edição'),
('Effective Java', '978-0134685992', 'Joshua Bloch', 'Addison-Wesley', 'Java', '3ª Edição'),
('Python Crash Course', '978-1593279289', 'Eric Matthes', 'No Starch Press', 'Python', '2ª Edição'),
('Automate the Boring Stuff with Python', '978-1593279930', 'Al Sweigart', 'No Starch Press', 'Python', '1ª Edição'),
('Java: The Complete Reference', '978-0071808553', 'Herbert Schildt', 'McGraw-Hill', 'Java', '10ª Edição'),
('Introduction to the Theory of Computation', '978-1133187791', 'Michael Sipser', 'Cengage Learning', 'Teoria da Computação', '3ª Edição'),
('The C Programming Language', '978-0131103628', 'Brian W. Kernighan', 'Prentice Hall', 'C', '2ª Edição'),
('Haskell Programming from First Principles', '978-0995787705', 'Christopher Allen', 'Independently Published', 'Haskell', '1ª Edição'),
('Programming Pearls', '978-0201657884', 'Jon Bentley', 'Addison-Wesley', 'Programação', '1ª Edição'),
('Learning Python', '978-1449355740', 'Mark Lutz', 'OReilly Media', 'Python', '5ª Edição'),
('Head First Java', '978-0596009206', 'Kathy Sierra', 'OReilly Media', 'Java', '2ª Edição'),
('The Rust Programming Language', '978-1593278282', 'Steve Klabnik', 'No Starch Press', 'Rust', '1ª Edição'),
('You Dont Know JS', '978-1491904245', 'Kyle Simpson', 'OReilly Media', 'JavaScript', '1ª Edição'),
('Java: A Beginners Guide', '978-1260463419', 'Herbert Schildt', 'McGraw-Hill', 'Java', '8ª Edição'),
('Learn JavaScript VISUALLY', '978-1933952179', 'Ivelin Demirov', 'Skillsoft', 'JavaScript', '1ª Edição'),
('Learning Java', '978-1449359363', 'OReilly Media', 'OReilly Media', 'Java', '4ª Edição'),
('Android Programming: The Big Nerd Ranch Guide', '978-0135242489', 'Bill Phillips', 'Pearson', 'Android', '4ª Edição'),
('Effective Python: 59 Specific Ways to Write Better Python', '978-0134034288', 'Brett Slatkin', 'Addison-Wesley', 'Python', '1ª Edição'),
('PHP & MySQL: Novice to Ninja', '978-0994113063', 'Tom Butler', 'SitePoint', 'PHP', '1ª Edição'),
('Beginning JavaScript', '978-1118051302', 'Jeremy McPeak', 'Wiley', 'JavaScript', '3ª Edição'),
('C++ Primer', '978-0321714115', 'Stanley B. Lippman', 'Addison-Wesley', 'C++', '5ª Edição'),
('Programming in C', '978-0130313496', 'Stephen G. Kochan', 'Sams Publishing', 'C', '4ª Edição'),
('Pro Git', '978-1484200774', 'Scott Chacon', 'Apress', 'Git', '2ª Edição'),
('Python for Data Analysis', '978-1491957661', 'Wes McKinney', 'OReilly Media', 'Data Science', '2ª Edição'),
('Test-Driven Development: By Example', '978-0321146534', 'Kent Beck', 'Addison-Wesley', 'Desenvolvimento Ágil', '1ª Edição'),
('Java 8 in Action', '978-1617291999', 'Raoul-Gabriel Urma', 'Manning Publications', 'Java', '1ª Edição'),
('Node.js Design Patterns', '978-1783287318', 'Mario Casciaro', 'Packt Publishing', 'Node.js', '2ª Edição'),
('C Programming: A Modern Approach', '978-0393979504', 'K. N. King', 'W. W. Norton & Company', 'C', '2ª Edição'),
('Django for Beginners', '978-0981467303', 'William S. Vincent', 'Self-published', 'Python', '1ª Edição'),
('Learning JavaScript Design Patterns', '978-1449331816', 'Addy Osmani', 'OReilly Media', 'JavaScript', '1ª Edição'),
('Ruby on Rails Tutorial', '978-0134077704', 'Michael Hartl', 'Addison-Wesley', 'Ruby on Rails', '4ª Edição'),
('Python Deep Learning', '978-1788621752', 'Ivan Vasilev', 'Packt Publishing', 'Deep Learning', '1ª Edição'),
('The Complete Node.js Developers Guide', '978-0134766576', 'Andrew Mead', 'Independently Published', 'Node.js', '1ª Edição'),
('JavaScript Patterns', '978-1449399113', 'Stoyan Stefanov', 'OReilly Media', 'JavaScript', '1ª Edição'),
('Hands-On Software Engineering with C++', '978-1800206590', 'Mitesh Soni', 'Packt Publishing', 'C++', '1ª Edição'),
('Effective C++: 55 Specific Ways to Improve Your Programs and Designs', '978-0321334880', 'Scott Meyers', 'Addison-Wesley', 'C++', '3ª Edição'),
('Mastering Python', '978-1788621753', 'Rick van Hattem', 'Packt Publishing', 'Python', '2ª Edição'),
('The Complete Guide to C# Programming', '978-1800206591', 'Mitesh Soni', 'Packt Publishing', 'C#', '1ª Edição'),
('The Linux Programming Interface', '978-1593272204', 'Michael Kerrisk', 'No Starch Press', 'Linux', '1ª Edição'),
('Automated Testing: A Practical Guide', '978-1492057503', 'Dr. Ali Kheir', 'Packt Publishing', 'Testes', '1ª Edição'),
('Kotlin in Action', '978-1617293292', 'Dmitry Jemerov', 'Manning Publications', 'Kotlin', '1ª Edição'),
('Learn Python the Hard Way', '978-0321942260', 'Zed Shaw', 'Addison-Wesley', 'Python', '3ª Edição');

INSERT INTO Titulo (nome, isbn, autor, editora, assunto, edicao) VALUES
('Advanced Software Engineering', '978-1234567890', 'John Doe', 'Tech Books', 'Programação', '2ª Edição'),
('Data Structures and Algorithms in C++', '978-2345678901', 'Jane Smith', 'Tech Publications', 'Algoritmos', '3ª Edição'),
('Machine Learning Basics', '978-3456789012', 'Alex Johnson', 'ML Press', 'Inteligência Artificial', '1ª Edição'),
('Understanding Operating Systems', '978-4567890123', 'Michael Brown', 'OReilly Media', 'Sistemas Operacionais', '4ª Edição'),
('JavaScript: The Definitive Guide', '978-5678901234', 'David Taylor', 'Addison-Wesley', 'JavaScript', '7ª Edição'),
('Introduction to Artificial Intelligence', '978-6789012345', 'Samuel Green', 'MIT Press', 'Inteligência Artificial', '2ª Edição'),
('Python Programming for Beginners', '978-7890123456', 'Linda White', 'No Starch Press', 'Python', '1ª Edição'),
('Advanced Python Programming', '978-8901234567', 'Charles Adams', 'Packt Publishing', 'Python', '2ª Edição'),
('Linux System Programming', '978-9012345678', 'Linda Black', 'Wiley', 'Linux', '3ª Edição'),
('Java for Web Development', '978-0123456789', 'Peter Harris', 'McGraw-Hill', 'Java', '5ª Edição'),
('Effective Data Science', '978-1239876543', 'Sophia Allen', 'OReilly Media', 'Data Science', '1ª Edição'),
('Mastering SQL', '978-2345678902', 'Daniel King', 'Addison-Wesley', 'Banco de Dados', '4ª Edição'),
('Modern Web Development with Angular', '978-3456789013', 'Chris Jordan', 'Packt Publishing', 'JavaScript', '2ª Edição'),
('Practical C Programming', '978-4567890124', 'William Scott', 'Sams Publishing', 'C', '6ª Edição'),
('The Art of Computer Programming Vol 1', '978-5678901235', 'Donald Knuth', 'Addison-Wesley', 'Algoritmos', '4ª Edição'),
('Web Security for Beginners', '978-6789012346', 'Samuel Green', 'OReilly Media', 'Segurança', '1ª Edição'),
('Design Patterns in C++', '978-7890123457', 'Mark Lee', 'Addison-Wesley', 'Design Patterns', '3ª Edição'),
('Deep Learning with TensorFlow', '978-8901234568', 'Alice Clark', 'Packt Publishing', 'Deep Learning', '2ª Edição'),
('The C++ Programming Language', '978-9012345679', 'Bjarne Stroustrup', 'Addison-Wesley', 'C++', '4ª Edição'),
('Data Science for Dummies', '978-0123456790', 'Lillian Jones', 'For Dummies', 'Data Science', '1ª Edição'),
('Introduction to Machine Learning', '978-1239876544', 'Robert Williams', 'Springer', 'Inteligência Artificial', '3ª Edição'),
('Building Web Applications with Django', '978-2345678903', 'John Adams', 'OReilly Media', 'Python', '2ª Edição'),
('The Pragmatic Programmer', '978-3456789014', 'Andrew Hunt', 'Addison-Wesley', 'Programação', '20ª Edição'),
('Algorithms: Design and Analysis', '978-4567890125', 'Markus Oliver', 'MIT Press', 'Algoritmos', '1ª Edição'),
('Python for Data Science', '978-5678901236', 'Jessica Moore', 'No Starch Press', 'Python', '3ª Edição'),
('Introduction to Computational Thinking', '978-6789012347', 'Emily Stone', 'Harvard Press', 'Computação', '2ª Edição'),
('Building RESTful APIs with Node.js', '978-7890123458', 'Benjamin Walker', 'Packt Publishing', 'Node.js', '1ª Edição'),
('Learning C# Programming', '978-8901234569', 'Sarah King', 'Microsoft Press', 'C#', '3ª Edição'),
('Hands-On Data Science with R', '978-9012345680', 'David Lee', 'OReilly Media', 'Data Science', '2ª Edição'),
('The Complete Guide to Algorithms', '978-0123456791', 'Thomas Williams', 'Springer', 'Algoritmos', '5ª Edição'),
('Software Engineering Essentials', '978-1239876545', 'Andrew Harrison', 'Tech Books', 'Engenharia de Software', '1ª Edição'),
('Big Data Analytics', '978-2345678904', 'Victor Bryant', 'Packt Publishing', 'Big Data', '4ª Edição'),
('Vue.js Up and Running', '978-3456789015', 'Ethan Phillips', 'OReilly Media', 'JavaScript', '1ª Edição'),
('Programming in Java', '978-4567890126', 'Robert Smith', 'McGraw-Hill', 'Java', '5ª Edição'),
('Clean Architecture', '978-5678901237', 'Robert Martin', 'Prentice Hall', 'Arquitetura de Software', '1ª Edição'),
('Blockchain for Beginners', '978-6789012348', 'Charles Harper', 'Packt Publishing', 'Blockchain', '2ª Edição'),
('Mastering Git', '978-7890123459', 'Jonathan Shaw', 'Apress', 'Git', '3ª Edição'),
('Data Structures with Java', '978-8901234570', 'Rachel Collins', 'Wiley', 'Java', '4ª Edição'),
('Introduction to Computer Networks', '978-9012345681', 'Paul Allen', 'Prentice Hall', 'Redes', '2ª Edição'),
('The Rust Programming Language', '978-0123456792', 'Steve Klabnik', 'No Starch Press', 'Rust', '1ª Edição'),
('React in Action', '978-1239876546', 'Mark Johnson', 'Manning Publications', 'JavaScript', '1ª Edição'),
('The JavaScript Handbook', '978-2345678905', 'Chris Miller', 'Packt Publishing', 'JavaScript', '3ª Edição'),
('C Programming Essentials', '978-3456789016', 'Brian Kernighan', 'Prentice Hall', 'C', '2ª Edição'),
('The Python Cookbook', '978-4567890127', 'David Beazley', 'OReilly Media', 'Python', '2ª Edição'),
('Linux Pocket Guide', '978-5678901238', 'Daniel J. Barrett', 'OReilly Media', 'Linux', '1ª Edição'),
('Java for Professionals', '978-6789012349', 'Kathy Sierra', 'OReilly Media', 'Java', '5ª Edição'),
('Learn PHP in 24 Hours', '978-7890123460', 'Scott Harris', 'SitePoint', 'PHP', '1ª Edição'),
('Artificial Intelligence: A Modern Approach', '978-8901234571', 'Stuart Russell', 'Pearson', 'Inteligência Artificial', '3ª Edição'),
('R Programming for Data Science', '978-9012345682', 'John Smith', 'OReilly Media', 'Data Science', '2ª Edição'),
('Building Scalable Web Apps with Flask', '978-0123456793', 'Chris Roberts', 'OReilly Media', 'Python', '1ª Edição'),
('Mathematics for Computer Science', '978-1239876547', 'Michael Clancy', 'Springer', 'Matemática', '4ª Edição'),
('SQL for Data Science', '978-2345678906', 'Michael McKinney', 'OReilly Media', 'Banco de Dados', '2ª Edição'),
('Machine Learning with Scikit-Learn', '978-3456789017', 'Manuel Alvarez', 'Packt Publishing', 'Inteligência Artificial', '1ª Edição'),
('Digital Design and Computer Architecture', '978-4567890128', 'David Harris', 'Morgan Kaufmann', 'Arquitetura de Computadores', '1ª Edição'),
('Exploring C# 9.0', '978-5678901239', 'Jason Roberts', 'Packt Publishing', 'C#', '2ª Edição'),
('Mastering Python', '978-6789012350', 'Rick van Hattem', 'Packt Publishing', 'Python', '2ª Edição'),
('Full Stack JavaScript Development', '978-7890123461', 'Azat Mardan', 'OReilly Media', 'JavaScript', '1ª Edição'),
('Practical Data Analysis', '978-8901234572', 'Thomas Smith', 'Packt Publishing', 'Data Science', '3ª Edição'),
('Android App Development with Kotlin', '978-9012345683', 'Joseph Smith', 'Packt Publishing', 'Android', '1ª Edição'),
('Learning Java with Spring', '978-0123456794', 'Craig Walls', 'Manning Publications', 'Java', '2ª Edição'),
('JavaScript Patterns', '978-1239876548', 'Stoyan Stefanov', 'OReilly Media', 'JavaScript', '1ª Edição'),
('The Complete Guide to React', '978-2345678907', 'Dave Ceddia', 'OReilly Media', 'JavaScript', '3ª Edição'),
('Data Visualization with Python', '978-3456789018', 'Kirk W. Smith', 'Packt Publishing', 'Python', '1ª Edição'),
('Understanding Algorithms', '978-4567890129', 'Bob Brown', 'MIT Press', 'Algoritmos', '2ª Edição'),
('Hands-On Machine Learning with Scikit-Learn', '978-5678901240', 'Aurélien Géron', 'OReilly Media', 'Machine Learning', '1ª Edição'),
('Learning Flask', '978-6789012351', 'Miguel Grinberg', 'OReilly Media', 'Python', '1ª Edição'),
('Network Programming with Python', '978-7890123462', 'John Goerzen', 'OReilly Media', 'Python', '3ª Edição'),
('Swift Programming for iOS Development', '978-8901234573', 'Matthew Mathias', 'OReilly Media', 'Swift', '2ª Edição'),
('Hadoop: The Definitive Guide', '978-9012345684', 'Tom White', 'OReilly Media', 'Big Data', '4ª Edição'),
('Learning R for Data Analysis', '978-0123456795', 'Robert I. Kabacoff', 'OReilly Media', 'R', '2ª Edição');








