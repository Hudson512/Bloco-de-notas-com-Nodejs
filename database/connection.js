const mysql = require('mysql2/promise');

// Configuração de conexão com MariaDB (XAMPP padrão)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_produtos',
    port: 3306
};

// Pool de conexões
let pool;

async function initDatabase() {
    try {
        // Criar pool de conexões
        pool = mysql.createPool(dbConfig);
        
        // Testar conexão
        const connection = await pool.getConnection();
        console.log('✓ Conectado ao MariaDB com sucesso!');
        connection.release();
        
        return pool;
    } catch (err) {
        console.error('Erro ao conectar ao MariaDB:', err.message);
        throw err;
    }
}

function getPool() {
    if (!pool) {
        throw new Error('Pool de conexões não inicializado. Chame initDatabase() primeiro.');
    }
    return pool;
}

module.exports = {
    initDatabase,
    getPool
};
