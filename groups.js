const express = require('express')
const app = express.Router()


const init = connection => {
    app.use((req, res, next) => {
        if (!req.session.user) {
            res.redirect('/');
        } else {
            next()
        }
    })
    app.get('/', async (req, res) => {
        const [groups, fields] = await connection.execute('select groups.*, groups_user.role from groups left join groups_user on groups.id = groups_user.groups_id and groups_user.users_id = ?', [
            req.session.user.id
        ])
        res.render('groups', {
            groups
        })
    })

    app.post('/', async (req, res) => {
        const [insertedId, insertedFields] = await connection.execute('insert into groups (name) values (?)', [
            req.body.name
        ])
        await connection.execute('insert into groups_user (users_id, groups_id, role) values (?, ?, ?)', [
            req.session.user.id,
            insertedId.insertId,
            'owner'
        ])

        res.redirect('/groups')
    })
    app.get('/:id/pendings/:op', async (req, res) => {
        if (req.params.op === 'YES') {
            await connection.execute('update groups_user set role = "user" where id = ? limit 1', [
                req.params.id,
            ])
            res.redirect('/groups')
        } else {
            await connection.execute('delete from groups_user where id = ? limit 1', [
                req.params.id,
            ])
            res.redirect('/groups')
        }
    })

    app.get('/:id', async (req, res) => {
        const [pendings] = await connection.execute('select groups_user.*, users.name from groups_user inner join users on groups_user.users_id = users.id and groups_user.groups_id = ? and groups_user.role like "pending"', [
            req.params.id
        ])
        res.render('group', {
            pendings
        })
    })
    app.get('/:id/join', async (req, res) => {
        const [rows, fields] = await connection.execute('select * from  groups_user where users_id = ? and groups_id = ?', [
            req.session.user.id,
            req.params.id
        ])
        if (rows.length > 0) {
            res.redirect('/groups')
        } else {
            await connection.execute('insert into groups_user (users_id, groups_id, role) values (?, ?, ?)', [
                req.session.user.id,
                req.params.id,
                'pending'
            ])
            res.redirect('/groups')
        }
    })

    app.get('/delete/:id', async (req, res) => {
        await connection.execute('delete from groups where id = ? limit 1', [
            req.params.id
        ])
        res.redirect('/groups')
    })

    return app
}

module.exports = init