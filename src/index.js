const morgan = require ('morgan')
const { engine} = require('express-handlebars')
const express = require ('express')
const router = require ('./routes/index.js')
const auth = require('./routes/authentication.js')
const links = require('./routes/links')
const path = require ('path')
const { urlencoded } = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const MySqlStore = require('express-mysql-session')
const passport = require('passport')

const { database } = require ('./keys.js') 

//initializations
const app = express() //se ejecuta express y se guarda en una constante app
require('./lib/passport')


//settings
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars.js')
}))
app.set('view engine', '.hbs')

//middlewares
app.use(session({
    secret:'arielsession',
    resave:false,
    saveUninitialized: false,
    store: new MySqlStore(database)

}))
app.use(flash())
app.use(morgan('dev'))
app.use(urlencoded({extended:false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())


//global variables
app.use((req,res,next)=>{
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user
    next()
})

//public
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use(router)
app.use(auth)
app.use(links)




//starting server
app.listen(app.get('port'), ()=>console.log('escuchando en puerto:', app.get('port')))