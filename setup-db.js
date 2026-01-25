const mysql = require('mysql2/promise');
const fs = require('fs/promises');

async function setupDatabase() {
    let connection;
    try {
        console.log('Configurando banco de dados...\n');
        console.log('Tentando conectar ao MariaDB/MySQL...');

        // Conectar sem especificar database para criar o banco
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            multipleStatements: true
        });

        console.log('✓ Conectado ao MariaDB');

        // Ler e executar o script SQL
        const sql = await fs.readFile('./database/setup.sql', 'utf-8');
        await connection.query(sql);

        console.log('✓ Banco de dados "sistema_produtos" criado');
        console.log('✓ Tabelas criadas com sucesso');
        console.log('✓ Categorias iniciais inseridas');
        console.log('✓ Produto de exemplo inserido\n');
        console.log('Setup concluído! Execute "npm start" para iniciar a aplicação.');

        await connection.end();
    } catch (err) {
        console.error('Erro durante o setup:');
        console.error('Mensagem:', err.message);
        console.error('Código:', err.code);
        console.error('\nVerifique se:');
        console.error('1. O XAMPP está rodando');
        console.error('2. O módulo MySQL está iniciado');
        console.error('3. A porta 3306 está disponível');
        
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

setupDatabase();
