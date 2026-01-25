# Sistema de Gestão de Produtos com MariaDB

Sistema simples para gerenciar produtos com categorias e preços, desenvolvido com Node.js, Express e MariaDB.

## Funcionalidades
- ✅ Adicionar produtos com nome, categoria e preço
- ✅ Visualizar todos os produtos cadastrados
- ✅ Eliminar produtos
- ✅ Gerenciar categorias personalizadas
- ✅ Banco de dados MariaDB/MySQL
- ✅ Interface visual moderna e responsiva

## Pré-requisitos
- Node.js instalado
- XAMPP com MariaDB/MySQL rodando (porta 3306)
- Usuário: `root`, Senha: (vazia - padrão XAMPP)

## Guia para executar

### 1. Clonar o repositório
```bash
git clone git@github.com:Hudson512/Bloco-de-notas-com-Nodejs.git
cd Bloco-de-notas-com-Nodejs
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar o XAMPP
- Abra o XAMPP Control Panel
- Inicie o módulo MySQL/MariaDB

### 4. Configurar banco de dados
```bash
node setup-db.js
```
Este comando irá:
- Criar o banco de dados `sistema_produtos`
- Criar as tabelas necessárias
- Inserir categorias iniciais
- Inserir um produto de exemplo

### 5. Iniciar a aplicação
```bash
npm start
```

### 6. Acessar no navegador
```
http://localhost:3000
```

## Estrutura do Banco de Dados

### Tabela: categorias
- `id` - INT (AUTO_INCREMENT, PRIMARY KEY)
- `nome` - VARCHAR(100) (UNIQUE)
- `criado_em` - TIMESTAMP

### Tabela: produtos
- `id` - INT (AUTO_INCREMENT, PRIMARY KEY)
- `nome` - VARCHAR(255)
- `categoria_id` - INT (FOREIGN KEY -> categorias.id)
- `preco` - DECIMAL(10, 2)
- `criado_em` - TIMESTAMP

## Tecnologias Utilizadas
- Node.js
- Express
- MariaDB/MySQL
- mysql2 (driver)
- HTML5 e CSS3
- Body-Parser

## Configuração do Banco de Dados
As configurações padrão estão em `database/connection.js`:
- Host: localhost
- Usuário: root
- Senha: (vazia)
- Porta: 3306
- Database: sistema_produtos

Para alterar, edite o arquivo `database/connection.js`.

## Como Acessar o Banco de Dados via Terminal

### 1. Abrir o Terminal MySQL/MariaDB

#### Opção A - Via XAMPP:
```powershell
cd C:\xampp\mysql\bin
.\mysql.exe -u root -p
```
Quando pedir a senha, apenas pressione **Enter** (senha vazia no XAMPP padrão)

#### Opção B - Direto (se estiver no PATH):
```powershell
mysql -u root -p
```

### 2. Selecionar o Banco de Dados
```sql
USE sistema_produtos;
```

### 3. Visualizar Todas as Tabelas
```sql
SHOW TABLES;
```

### 4. Consultar os Dados

#### Ver todas as categorias:
```sql
SELECT * FROM categorias;
```

#### Ver todos os produtos:
```sql
SELECT * FROM produtos;
```

#### Ver produtos com nome das categorias:
```sql
SELECT p.id, p.nome, c.nome as categoria, p.preco, p.criado_em 
FROM produtos p 
INNER JOIN categorias c ON p.categoria_id = c.id;
```

#### Contar produtos por categoria:
```sql
SELECT c.nome, COUNT(p.id) as total_produtos 
FROM categorias c 
LEFT JOIN produtos p ON c.id = p.categoria_id 
GROUP BY c.id, c.nome;
```

### 5. Ver Estrutura das Tabelas
```sql
DESCRIBE categorias;
DESCRIBE produtos;
```

### 6. Outros Comandos Úteis

#### Listar todos os bancos de dados:
```sql
SHOW DATABASES;
```

#### Sair do MySQL:
```sql
EXIT;
```
ou
```sql
QUIT;
```

### Exemplo de Sessão Completa no Terminal

```powershell
# No PowerShell
PS C:\> cd C:\xampp\mysql\bin
PS C:\xampp\mysql\bin> .\mysql.exe -u root

# No MySQL
mysql> USE sistema_produtos;
Database changed

mysql> SELECT * FROM categorias;
+----+-------------+---------------------+
| id | nome        | criado_em           |
+----+-------------+---------------------+
|  1 | Eletrônicos | 2026-01-25 10:30:00 |
|  2 | Roupas      | 2026-01-25 10:30:00 |
|  3 | Alimentos   | 2026-01-25 10:30:00 |
+----+-------------+---------------------+

mysql> SELECT * FROM produtos;
+----+-----------+--------------+----------+---------------------+
| id | nome      | categoria_id | preco    | criado_em           |
+----+-----------+--------------+----------+---------------------+
|  1 | PC GAMER  |            1 | 18330.00 | 2026-01-25 10:31:00 |
+----+-----------+--------------+----------+---------------------+

mysql> EXIT;
Bye
```

## Manipular Dados via Terminal SQL

### 1. Adicionar Categorias

#### Adicionar uma nova categoria:
```sql
INSERT INTO categorias (nome) VALUES ('Brinquedos');
```

#### Adicionar várias categorias de uma vez:
```sql
INSERT INTO categorias (nome) VALUES 
('Informática'),
('Móveis'),
('Esportes');
```

#### Verificar se foi adicionada:
```sql
SELECT * FROM categorias;
```

### 2. Adicionar Produtos

#### Primeiro, encontre o ID da categoria:
```sql
SELECT id, nome FROM categorias;
```

#### Adicionar um produto (substitua categoria_id pelo ID correto):
```sql
INSERT INTO produtos (nome, categoria_id, preco) 
VALUES ('Mouse Gamer', 1, 150.00);
```

#### Adicionar vários produtos de uma vez:
```sql
INSERT INTO produtos (nome, categoria_id, preco) VALUES 
('Teclado Mecânico', 1, 350.00),
('Camisa Polo', 2, 89.90),
('Arroz 5kg', 3, 25.50);
```

#### Verificar produtos adicionados:
```sql
SELECT * FROM produtos;
```

### 3. Consultas com Relacionamento

#### Ver produtos de uma categoria específica:
```sql
SELECT p.nome, p.preco 
FROM produtos p 
INNER JOIN categorias c ON p.categoria_id = c.id 
WHERE c.nome = 'Eletrônicos';
```

#### Ver todas as categorias e seus produtos:
```sql
SELECT c.nome as Categoria, p.nome as Produto, p.preco 
FROM categorias c 
LEFT JOIN produtos p ON c.id = p.categoria_id 
ORDER BY c.nome, p.nome;
```

#### Buscar produtos mais caros que um valor:
```sql
SELECT p.nome, c.nome as categoria, p.preco 
FROM produtos p 
INNER JOIN categorias c ON p.categoria_id = c.id 
WHERE p.preco > 100 
ORDER BY p.preco DESC;
```

#### Ver total de produtos e valor por categoria:
```sql
SELECT 
    c.nome as Categoria,
    COUNT(p.id) as Total_Produtos,
    COALESCE(SUM(p.preco), 0) as Valor_Total
FROM categorias c 
LEFT JOIN produtos p ON c.id = p.categoria_id 
GROUP BY c.id, c.nome 
ORDER BY Total_Produtos DESC;
```

### 4. Atualizar Dados

#### Atualizar o preço de um produto:
```sql
UPDATE produtos 
SET preco = 180.00 
WHERE nome = 'Mouse Gamer';
```

#### Atualizar nome de uma categoria:
```sql
UPDATE categorias 
SET nome = 'Eletrônicos e Informática' 
WHERE nome = 'Eletrônicos';
```

### 5. Excluir Dados

#### Excluir um produto específico:
```sql
DELETE FROM produtos 
WHERE id = 1;
```

#### Excluir produtos de uma categoria:
```sql
DELETE FROM produtos 
WHERE categoria_id = (SELECT id FROM categorias WHERE nome = 'Alimentos');
```

#### Excluir uma categoria (só funciona se não tiver produtos):
```sql
DELETE FROM categorias 
WHERE nome = 'Brinquedos';
```

### Exemplo Completo: Adicionar Categoria e Produtos

```sql
-- 1. Adicionar nova categoria
INSERT INTO categorias (nome) VALUES ('Tecnologia');

-- 2. Ver o ID da categoria criada
SELECT id, nome FROM categorias WHERE nome = 'Tecnologia';
-- Suponha que retornou id = 6

-- 3. Adicionar produtos nesta categoria
INSERT INTO produtos (nome, categoria_id, preco) VALUES 
('Smartphone Samsung', 6, 1299.00),
('Tablet iPad', 6, 2500.00),
('Smartwatch', 6, 899.00);

-- 4. Ver os produtos da categoria Tecnologia
SELECT p.id, p.nome, p.preco 
FROM produtos p 
INNER JOIN categorias c ON p.categoria_id = c.id 
WHERE c.nome = 'Tecnologia';

-- 5. Ver resumo da categoria
SELECT 
    c.nome as Categoria,
    COUNT(p.id) as Total_Produtos,
    MIN(p.preco) as Preco_Minimo,
    MAX(p.preco) as Preco_Maximo,
    AVG(p.preco) as Preco_Medio
FROM categorias c 
LEFT JOIN produtos p ON c.id = p.categoria_id 
WHERE c.nome = 'Tecnologia'
GROUP BY c.id, c.nome;
```
