const express = require('express'); 
const {engine} = require('express-handlebars');
const myconnection = require('express-myconnection');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const PDFDocument = require('pdfkit');
const controller = require('./controllers/controlador');
const hbs = require('hbs');
const sequeilze = require('./database/db');
const { error } = require('console');

const app = express();
app.set('port',4000);

// Configurar el bodyParser para poder obtener los datos del formulario
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(session({
  secret: 'secret', resave: true, saveUninitialized: true
}))
//importar la planilla de boostrap
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs'
}));

// Configurar el motor de plantillas Handlebars
app.set('view engine', 'hbs');

//conexion a la base de datos
app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'crudnodejs'
}, 'single'));


app.listen(app.get('port'),() => {
    console.log('Listening on port ', app.get('port'));
}); 


app.get('/', (req, res) => {
    res.render('login');
});

app.use ('/', require('./routes/rutes'));
app.use ('/', require('./routes/rutasGestionar'));

