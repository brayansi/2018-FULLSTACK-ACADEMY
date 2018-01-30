const express = require('express') //import express
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs') //suport EJS

app.get('/', (req, res)=>{
 res.render('home')
})

app.listen(3000  , err => {
    console.log('Fubatiba Club server is running...');
})