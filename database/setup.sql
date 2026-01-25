-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS sistema_produtos;

USE sistema_produtos;

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria_id INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Inserir categorias iniciais
INSERT INTO categorias (nome) VALUES 
('Eletrônicos'),
('Roupas'),
('Alimentos'),
('Livros'),
('Outros')
ON DUPLICATE KEY UPDATE nome=nome;

-- Inserir produto de exemplo
INSERT INTO produtos (nome, categoria_id, preco) 
SELECT 'PC GAMER', id, 18330.00 
FROM categorias 
WHERE nome = 'Eletrônicos'
LIMIT 1;
