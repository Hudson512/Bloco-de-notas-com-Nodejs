const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const data = await fs.readFile('./database/notas.txt', 'utf-8');
        const notas = data.split('\n');

        let html = `
        <html lang="pt">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            text-decoration: none;
            font-family:Arial, Helvetica, sans-serif;
        }
        body{
            height: 100vh;
            width: 100%;
        }
        h2{
            text-align: left;
        }
        header{
            width: 100%;
            height: 10vh;
            background-color: #fffffff9;
            display: flex;
            flex-wrap: nowrap;
            align-content: space-around;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 2%;
        }
        .body-1{
            background: #57595a;
            height: 90vh;
            border-top: solid #7a7a7a39 5px;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: space-evenly;
            padding: 2%;
            overflow: auto;
        }
        .body-2{
            background: #57595a;
            height: 90vh;
            border-top: solid #7a7a7a39 5px;
            display: none;
            padding: 2%;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        .adicionar{
            font-size: large;
            color: #65641d;
            font-weight: bold;
            transition: font-size 0.2s;
        }
        .eliminar{
            border-left: solid red 5px;
            padding: 2px;
            color: red;
            text-align: left;
            width: 40%;
        }
        .adicionar:hover {
            font-size: x-large;
            color: #d4d37e;
            font-weight: bold;
        }
        .btn{
            background-color: cornflowerblue;
            padding: 2%;
            border: none;
            cursor: pointer;
        }
        .nota{
            display: flex;
            flex-direction: column;
            width: 30%;
            height: 15%;
            background: #DBDA7D;
            border: solid black 1px;
            padding: 1%;
            flex-wrap: nowrap;
            align-items: stretch;
            margin-bottom: 1%;
        }
        </style>
        <title>Pag inicial - Bloco de notas</title>
        </head>
        <body>
        <div class="app">
        <header>
            <h1>Bloco de notas</h1>
            <a class="adicionar" id="ad" href="#" onclick="adicionarNovaNota()">Adicionar nova nota</a>
        </header>
        <main class="body-1" id="main-1">
        `;
        notas.forEach((nota, index) => {
            if (nota.trim() !== '') {
                html += `
                    <div class="nota">
                    ${nota}
                    <a class="eliminar" href="/apagar-nota/${index}">Eliminar nota</a>
                    </div>
                `;
            }
        });
        html += `
        </main>
        <main class="body-2" id="main-2">
            <form action="/salvar-nota" method="post">
                <textarea name="nota" rows="4" cols="50"></textarea><br>
                <input class="btn" type="submit" value="Salvar Nota">
              </form>
        </main>
        </div>
        <script type="text/javascript">
        var ad = document.getElementById('ad');
        var main1 = document.getElementById('main-1');
        var main2 = document.getElementById('main-2');
        function adicionarNovaNota(){
            main1.style.display = 'none';
            main2.style.display = 'flex';
            ad.innerHTML = 'Ver notas';
            ad.setAttribute("onClick", "verNovaNota()");
        }
        function verNovaNota(){
            main1.style.display = 'flex';
            main2.style.display = 'none';
            ad.innerHTML = 'Adicionar nova nota';
            ad.setAttribute("onClick", "adicionarNovaNota()");
        }
        </script>
        </body>
        </html>
        `;
        res.send(html);

    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao ler as notas.');
    }
});


app.post('/salvar-nota', async (req, res) => {
    try {
        // Adiciona a nova nota ao arquivo de notas
        await fs.appendFile('./database/notas.txt', `${req.body.nota}\n`);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar a nota.');
    }
});

app.get('/apagar-nota/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const notas = (await fs.readFile('./database/notas.txt', 'utf-8')).split('\n');

        if (id >= 0 && id < notas.length) {
            notas.splice(id, 1); // Remove a nota na posição especificada
            await fs.writeFile('./database/notas.txt', notas.join('\n'));
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao apagar a nota.');
    }
});


app.listen(port, () => {
    console.log(`App de bloco de notas rodando em http://localhost:${port}`);
});
