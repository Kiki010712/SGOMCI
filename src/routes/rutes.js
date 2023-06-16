const express = require ('express');
const controlador = require('../controllers/controlador');
const expressv = require('express-validator')
const { loginValidatorUsuario } = require("../middlewares/validationAuth");
const { validationResultsExpress } = require('../middlewares/validationResultsExpress');
const multer = require('multer');

// Configuración de multer para guardar el archivo en el servidor (cartas)
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './src/public/upload/cartas');
        },
        filename: (req, file, cb) => {
            // Utilizar el valor del input con el nombre del archivo
            console.log(req.body);
            const fileName = 'carta_' + req.session.user.nombre + ' ' + req.session.user.apellido + '.pdf';
            cb(null, fileName);
        }
    })
});



const router = express.Router();

//Pantalla de bienvenida
router.get('/index', controlador.welcome);
router.post('/acceder',  controlador.autenticar);
router.get('/logout', controlador.cerrarsesion);


//registrarse
router.get('/register', controlador.register);


router.get('/funcionalidades', controlador.funcionalidades);

//ir a tabla de jefe de primera incancia
router.get('/tablajefePI', controlador.tablajefePI);
router.post('/tablajefePI', controlador.eliminar);
//ir a tabla de jefe de primera incancia
router.get('/tabladirMINED', controlador.tabladirMINED);

//Jefe primera infancia
//registrar circulo infantil
router.get('/registrarcirculo', controlador.registrarcirculo);
router.post('/registrarcirculo', controlador.registrarcirculo_post);

//Director MINED
//conformar equipo de trabajo
router.get('/conformarequipotrabajo', controlador.conformarequipotrabajo);




//Cliente
//Solicitar circulo infantil
router.get('/solicitar', controlador.solicitar);
router.post('/solicitar',  controlador.solicitar_post);
//realizar quejas
router.get('/realizarqueja', controlador.realizarqueja);
router.post('/realizarqueja', controlador.realizarqueja_post);
//Solicitar entrevista
router.get('/solicitarentrevista', controlador.solicitarentrevista);
router.post('/solicitarentrevista', controlador.solicitarentrevista_post);


//enviar cartas
router.get('/enviar', controlador.enviar);
router.post('/enviar', upload.single('archivoPDF'), controlador.recibir);





router.get('/DirectorMINED', controlador.directorMined);
router.get('/Cliente', controlador.cliente);
router.get('/JefePI', controlador.jefePI);



module.exports = router