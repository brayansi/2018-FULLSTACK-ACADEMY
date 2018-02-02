const express = require('express') //import express
const mysql = require('mysql2/promise') //import mysql2
const session = require('express-session') //import express-session
const app = express()
const boryParser = require('body-parser')

const account = require('./account')

app.use(express.static('public'))
app.use(boryParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'fullstack-academy',
    resave: true,
    saveUninitialized: true
}))
app.set('view engine', 'ejs') //suport EJS


const init = async () => {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'futibaclub'
    })

    app.use(account(connection)) //inject depedence for account

    app.listen(3000, err => {
        console.log('Fubatiba Club server is running...');
    })
}

init()

