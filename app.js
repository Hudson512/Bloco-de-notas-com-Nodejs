const express = require('express');
const bodyParser = require('body-parser');
const { initDatabase, getPool } = require('./database/connection');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar banco de dados
initDatabase().catch(err => {
    console.error('Falha ao inicializar banco de dados:', err);
    process.exit(1);
});

app.get('/', async (req, res) => {
    try {
        const pool = getPool();
        
        // Buscar produtos com suas categorias
        const [produtos] = await pool.query(`
            SELECT p.id, p.nome, c.nome as categoria, c.id as categoria_id, p.preco 
            FROM produtos p 
            INNER JOIN categorias c ON p.categoria_id = c.id
            ORDER BY p.criado_em DESC
        `);

        // Buscar categorias para o select
        const [categorias] = await pool.query('SELECT id, nome FROM categorias ORDER BY nome');

        // Gera o HTML das opções de categorias
        let categoriasOptions = '<option value="">Selecione uma categoria</option>';
        categorias.forEach(cat => {
            categoriasOptions += `<option value="${cat.id}">${cat.nome}</option>`;
        });

        // Gera o HTML dos produtos
        let produtosHtml = '';
        
        if (produtos.length === 0) {
            produtosHtml = '<div class="mensagem-vazio">Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar!</div>';
        } else {
            produtos.forEach(produto => {
                produtosHtml += `
                    <div class="produto-card">
                        <div class="produto-nome">${produto.nome}</div>
                        <span class="produto-categoria">${produto.categoria}</span>
                        <div class="produto-preco">Kz ${parseFloat(produto.preco).toFixed(2)}</div>
                        <div class="produto-acoes">
                            <button class="btn-editar" onclick="abrirModalEditar(${produto.id}, '${produto.nome.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', ${produto.categoria_id}, ${produto.preco})">
                                ✏️ Editar
                            </button>
                            <a class="btn-eliminar" href="/apagar-produto/${produto.id}">Eliminar</a>
                        </div>
                    </div>
                `;
            });
        }

        // Lê o template HTML
        const fs = require('fs/promises');
        let html = await fs.readFile('./views/index.html', 'utf-8');
        
        // Substitui os placeholders (usar replace global para todas as ocorrências)
        html = html.replace('{{PRODUTOS}}', produtosHtml);
        html = html.replace(/{{CATEGORIAS}}/g, categoriasOptions);
        
        res.send(html);

    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler os produtos.');
    }
});

app.post('/salvar-produto', async (req, res) => {
    try {
        const { nome, categoria, preco } = req.body;
        
        // Valida os dados
        if (!nome || !categoria || !preco) {
            return res.status(400).send('Todos os campos são obrigatórios.');
        }
        
        const pool = getPool();
        await pool.query(
            'INSERT INTO produtos (nome, categoria_id, preco) VALUES (?, ?, ?)',
            [nome, categoria, preco]
        );
        
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar o produto.');
    }
});

app.post('/editar-produto/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome, categoria, preco } = req.body;
        
        // Valida os dados
        if (!nome || !categoria || !preco) {
            return res.status(400).send('Todos os campos são obrigatórios.');
        }
        
        if (isNaN(id)) {
            return res.status(400).send('ID inválido.');
        }
        
        const pool = getPool();
        await pool.query(
            'UPDATE produtos SET nome = ?, categoria_id = ?, preco = ? WHERE id = ?',
            [nome, categoria, preco, id]
        );
        
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao editar o produto.');
    }
});

app.get('/apagar-produto/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).send('ID inválido.');
        }

        const pool = getPool();
        await pool.query('DELETE FROM produtos WHERE id = ?', [id]);

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao apagar o produto.');
    }
});

// Rotas de Categorias
app.get('/categorias', async (req, res) => {
    try {
        const pool = getPool();
        const [categorias] = await pool.query('SELECT id, nome FROM categorias ORDER BY nome');
        
        let categoriasHtml = '';
        if (categorias.length === 0) {
            categoriasHtml = '<div class="mensagem-vazio">Nenhuma categoria cadastrada.</div>';
        } else {
            categorias.forEach(cat => {
                categoriasHtml += `
                    <div class="categoria-item">
                        <span class="categoria-nome">${cat.nome}</span>
                        <a class="btn-eliminar-cat" href="/apagar-categoria/${cat.id}">Eliminar</a>
                    </div>
                `;
            });
        }

        const fs = require('fs/promises');
        let html = await fs.readFile('./views/categorias.html', 'utf-8');
        html = html.replace('{{CATEGORIAS_LISTA}}', categoriasHtml);
        
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler as categorias.');
    }
});

app.post('/salvar-categoria', async (req, res) => {
    try {
        const { categoria } = req.body;
        
        if (!categoria || categoria.trim() === '') {
            return res.status(400).send('Nome da categoria é obrigatório.');
        }
        
        const pool = getPool();
        
        // Verifica se a categoria já existe
        const [existing] = await pool.query(
            'SELECT id FROM categorias WHERE nome = ?',
            [categoria.trim()]
        );
        
        if (existing.length > 0) {
            return res.status(400).send('Esta categoria já existe.');
        }
        
        await pool.query('INSERT INTO categorias (nome) VALUES (?)', [categoria.trim()]);
        res.redirect('/categorias');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar a categoria.');
    }
});

app.get('/apagar-categoria/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).send('ID inválido.');
        }

        const pool = getPool();
        
        // Verifica se há produtos usando esta categoria
        const [produtos] = await pool.query(
            'SELECT COUNT(*) as total FROM produtos WHERE categoria_id = ?',
            [id]
        );
        
        if (produtos[0].total > 0) {
            return res.status(400).send(`Não é possível eliminar esta categoria pois existem ${produtos[0].total} produto(s) associado(s).`);
        }
        
        await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
        res.redirect('/categorias');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao apagar a categoria.');
    }
});

app.listen(port, () => {
    console.log(`Sistema de Produtos rodando em http://localhost:${port}`);
});
