const express = require ('express');
const controladorGestionar = require('../controllers/controladorGestionar');
const expressv = require('express-validator')
const { loginValidatorUsuario } = require("../middlewares/validationAuth");
const { validationResultsExpress } = require('../middlewares/validationResultsExpress');


const router = express.Router();

//rutas del crud gestionar quejas
router.get('/quejas', controladorGestionar.indexqueja);
router.post('/quejas', controladorGestionar.guardarrespuesta)
router.get('/realizarqueja', controladorGestionar.realizarqueja);
router.post('/quejas/delete', controladorGestionar.destroyqueja);
router.get('/quejas/edit/:id',controladorGestionar.editqueja);
router.post('/quejas/edit/:id', controladorGestionar.updatequeja);

//rutas del crud gestionar trabajadores
router.get('/trabajadores', controladorGestionar.indextrabajador);
router.post('/trabajadores', controladorGestionar.agregarequipotrabajador);
router.get('/createtrabajador', controladorGestionar.createtrabajador);
router.post('/createtrabajador', controladorGestionar.storetrabajador);
router.post('/trabajadores/delete', controladorGestionar.destroytrabajador);
router.get('/trabajadores/edit/:id',controladorGestionar.edittrabajador);
router.post('/trabajadores/edit/:id', controladorGestionar.updatetrabajador);

//Rutas del crud getionar usuario
router.get('/tasks', controladorGestionar.index);
router.get('/create', controladorGestionar.create);
router.post('/create', controladorGestionar.store);
router.post('/register',loginValidatorUsuario, validationResultsExpress, controladorGestionar.store);
router.post('/tasks/delete', controladorGestionar.destroy);
router.get('/tasks/edit/:id',controladorGestionar.edit);
router.post('/tasks/edit/:id', controladorGestionar.update);

//rutas del crud gestionar solicitudes
router.get('/solicitudes', controladorGestionar.indexsolicitud);
router.post('/solicitudes', controladorGestionar.asignarcirculo_post);
router.get('/createsolicitud', controladorGestionar.createsolicitud);
router.post('/createsolicitud', controladorGestionar.storesolicitud);
router.post('/solicitudes/delete', controladorGestionar.destroysolicitud);
router.get('/solicitudes/edit/:id',controladorGestionar.editsolicitud);
router.post('/solicitudes/edit/:id', controladorGestionar.updatesolicitud);

//Rutas del crud getionar niños
router.get('/ninos', controladorGestionar.indexnino);
router.get('/createnino', controladorGestionar.createnino);
router.post('/createnino', controladorGestionar.storenino);
router.post('/ninos/delete', controladorGestionar.destroynino);
router.get('/ninos/edit/:id',controladorGestionar.editnino);
router.post('/ninos/edit/:id', controladorGestionar.updatenino);



module.exports = router