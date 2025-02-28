const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('./routes')
const { errors } = require('celebrate')

const app = express()
const path = require('path')

require('dotenv').config()

app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors())
app.use(express.json())
app.use(routes)
app.use(errors())
app.listen(4064)