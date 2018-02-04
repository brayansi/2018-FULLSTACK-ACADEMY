const express = require('express')
const app = express.Router()


const init = connection => {
    app.get('/', async (req, res) => {
        res.render('home')
    })

    app.get('/login', (req, res) => {
        res.render('login', { error: false })
    })

    app.get('/logout', (req, res) => {
        req.session.destroy(err => {
            res.redirect('/');
        })
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
                const user = {
                    id: rows[0].id,
                    name: rows[0].name,
                    role: rows[0].role
                }
                req.session.user = user;
                res.redirect('/')
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
            
            const [inserted, insertFields] = await connection.execute('insert into users (name, email, passwd, role) values (?,?,?,?)', [
                name,
                email,
                passwd,
                'user'
            ])

            const user = {
                id: inserted.insertId,
                name: name,
                role: 'user'
            }
            req.session.user = user;
            res.redirect('/')
        } else {
            res.render('new-account', { error: true })
        }
    })
    return app
}


module.exports = init