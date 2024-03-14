const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
let sql;

const app = express();
const port = 3000;
app.use(cors());

const db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE, (err) => {
    if(err) return console.error(err.message)
});

sql = `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    task TEXT,
    isCompleted BOOLEAN DEFAULT 0
);
`

db.run(sql);

app.use(express.json());

app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

app.post('/tasks', (req, res) => {
    const { task, isCompleted } = req.body;
    if (!task) {
        res.status(400).send('Task cannot be empty');
        return;
    }

    db.run('INSERT INTO tasks (task, isCompleted) VALUES (?, ?)', [task, isCompleted], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).send('Task added successfully');
        }
    });
});


app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { isCompleted } = req.body;

    db.run('UPDATE tasks SET isCompleted = ? WHERE id = ?', [isCompleted, id], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Task updated successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

