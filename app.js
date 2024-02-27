const fs = require('fs');
const readline = require('readline');
const notesFile = './database/notes.txt';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu(){
    console.log('\n')
    console.log('1. Ver Notas');
    console.log('2. Adicionar Nota');
    console.log('3. Sair Notas');
    rl.question('Escolha uma opção:', handleMenuChoice);
}

function handleMenuChoice(choice){
    switch (choice) {
        case '1':
            readNotes();
            break;
        case '2':
            addNote();
            break;
        case '3':
            rl.close()
        default:
            console.log('Opção inválida. Tente novamente.');
    }
}

function readNotes(){
    fs.readFile(notesFile, 'utf8', (err, data) => {
        if (err){
            console.log('Erro ao ler notas:', err);
        } else {
            console.log('\n---- Suas Notas ----\n');
            console.log(data || 'Nenhuma nota encontrada.');
            showMenu();
        }
    });
}

function addNote(){
    rl.question('Digite sua nota: ', (note) =>{
        fs.appendFile(notesFile,  `\n- ${note}`, (err)=>{
            if (err){
                console.log('Erro ao adicionar nota: ', err);
            } else {
                console.log('Nota adicionada com sucesso!');
            }
            showMenu();
        });
    });
}
showMenu();