const path = require('path');
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
app.set('view engine', 'pug')
app.set('views', './src/views')

app.use(express.static(path.join(__dirname, 'src/public')));


const homeRouter = require('./src/router/home.router')

app.use('/', homeRouter)

app.listen(port, () => {
    console.log(`App is listening port ${port}`)
})