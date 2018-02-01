const express = require('express')
const app = express.Router()


const init = connection => {
    app.get('/', async (req, res) => {
        const [row, fields] = await connection.execute('select * from users') //select all users
        console.log(row)

        res.render('home')

    })

    app.get('/new-account', (req, res) => {
        res.render('new-account')
    })

    app.post('/new-account', async (req, res) => {
        const [row, fields] = await connection.execute('select * from users whare email = ?', [req.body.email]) //select all users
        if(row.length === 0){
            //insert
        } else {
            res.render('new-account', {
                error : 'Error User '
            })
        }
    })


    return app
}


module.exports = init