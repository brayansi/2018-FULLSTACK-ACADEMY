const express = require('express')
const app = express.Router()


const init = connection => {
    app.get('/', async (req, res) => {
        const [row, fields] = await connection.execute('select * from users') //select all users
        res.render('home')
    })

    app.get('/login', (req, res) => {
        res.render('login', { error: false })
    })
    app.get('/new-account', (req, res) => {
        res.render('new-account', { error: false })
    })

    //Login
    app.post('/login', async (req, res) => {
        const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email]) //select all users
        if (rows.length === 0) {
            res.render('login', { error: true })
        } else {
            if (rows[0].passwd === req.body.passwd){
                console.log('logado')
            }else{
                res.render('login', { error: true })
            }
        }
    })
    //Create new users
    app.post('/new-account', async (req, res) => {
        const [row, fields] = await connection.execute('select * from users where email = ?', [req.body.email]) //select all users
        if (row.length === 0) {

            const { name, email, passwd } = req.body
            rows
            await connection.execute('insert into users (name, email, passwd, role) values (?,?,?,?)', [
                req.body.name,
                email,
                passwd,
                'users'
            ])
            res.redirect('/')
        } else {
            res.render('new-account', { error: true })
        }
    })
    return app
}


module.exports = init