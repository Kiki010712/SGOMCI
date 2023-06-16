const bcrypt = require('bcrypt');
const path = require ('path');
const fs = require('fs');

function autenticar(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    req.getConnection((er, conn) => {
        conn.query('SELECT * from usuario where username = ?',[username], (err, result) =>{
           if(err) throw err;
           if(result.length > 0){
            bcrypt.compare(password , result[0]['password'], (err, isValid) =>{
                if (err) console.log(err);
                if (isValid){
                    req.session.user = result[0];
                    if (result[0]['rol'] == 'Cliente') res.redirect('/Cliente');
                    else if (result[0]['rol'] == 'DirectorMINED') res.redirect('/DirectorMINED');
                    else if (result[0]['rol'] == 'JefePI') res.redirect('/JefePI');
                    else res.render('login', { 
                        error: true
                    });
                } else {
                    res.render('login', { 
                        error: true
                    });
                }
            });
            } else {
                res.render('login', { 
                    error: true
                });
            }
        } );
     });
}

function cerrarsesion(req, res){
    req.session.user = null;
    res.redirect('/');
}

//registrarse
function register(req, res){
    res.render('register')
}
//welcome
function welcome(req, res){
    res.render('index')
}


function directorMined(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT count(*) as conteo FROM solicitud' , (err, cant_solicitudes) => {
            conn.query('SELECT count(*) as conteo FROM solicitudtraslado' , (err, cant_traslado) => {
                conn.query('SELECT count(*) as conteo FROM asignarcirculo' , (err, cant_asignaciones) => {
            res.render('DirectorMINED', {
                user: req.session.user,
                cant_solicitudes: cant_solicitudes,
                cant_traslado: cant_traslado,
                cant_asignaciones: cant_asignaciones
            });
                });
            });
        });
    }); 
}

function cliente(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM quejas WHERE nombresolicitante = ? and respuesta is not null', [ req.session.user.nombre + ' ' + req.session.user.apellido ], (err, queja) => {
            res.render('Cliente', {
             user: req.session.user,
             queja: queja,
             solicitud_respondida: false
            });
        });
    });
}
function jefePI(req, res){
    res.render('JefePI', {user: req.session.user});
}

//ir a tablas jefe primera incancia
function tablajefePI(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM circulo', (err, circulos) => {
            if(err){
                res.json(err);
            }
            conn.query('SELECT * FROM carta', (err, cartas) => {
                if(err){
                    res.json(err);
                }
                res.render('tablesjefePI', {
                user: req.session.user,
                circulos: circulos,
                cartas: cartas
                });
            });
        });
    });
}

//ir a tablas director MINED
function tabladirMINED(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM asignarcirculo', (err, circulos) => {
            if(err){
                res.json(err);
            }
            conn.query('SELECT * FROM traslado', (err, traslados) => {
                if(err){
                    res.json(err);
                }   
                res.render('tablesdirMINED',  {
                user: req.session.user,
                circulos: circulos,
                traslados: traslados
                });
        });
        });
    });
}


//Cliente
//Solicitar circulo infantil
function solicitar(req, res){
    res.render('solicitarcirculo', {user: req.session.user})
}

function solicitar_post(req, res){
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM solicitud WHERE CIniño = ?', [data.CIniño], (err, userdata) => {
            if (userdata.length > 0) {
                res.render('solicitarcirculo', {
                    exist_error: true,
                    error: "Error: La solicitud ya existe !" });
            } else {
                    req.getConnection((err, conn) => {
                         conn.query('INSERT INTO solicitud SET ?', [data], (err, rows) => {
                            if (err) {
                                console.log(err);
                            } else { res.redirect('/Cliente'); }
                        });
                    }); 
            }
        });
    });
}

//realizar quejas
function realizarqueja(req, res){
    console.log(req.session.user);
    res.render('realizarqueja', {
       user: req.session.user 
    });
}

function realizarqueja_post(req, res){
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM quejas WHERE numeroqueja = ?', [data.numeroqueja], (err, userdata) => {
            if (userdata.length > 0) {
                res.render('realizarqueja', {
                    user: req.session.user,
                    exist_error: true,
                    error: "Error: La queja ya existe !" });
            } else {
                    req.getConnection((err, conn) => {
                         conn.query('INSERT INTO quejas SET ?', [data], (err, rows) => {
                            if (err) {
                                console.log(err);
                            } else { res.redirect('/Cliente'); }
                        });
                    }); 
            }
        });
    });
}

//solicitar entrevista
function solicitarentrevista(req, res){
    console.log(req.session.user);
    res.render('solicitarentrevista', {
       user: req.session.user 
    });
}

function solicitarentrevista_post(req, res){
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM entrevista WHERE id = ?', [data.id], (err, userdata) => {
            if (userdata.length > 0) {
                res.render('solicitarentrevista', {
                    user: req.session.user,
                    exist_error: true,
                    error: "Error: La solicitud ya existe !" });
            } else {
                    req.getConnection((err, conn) => {
                         conn.query('INSERT INTO entrevista SET ?', [data], (err, rows) => {
                            if (err) {
                                console.log(err);
                            } else { res.redirect('/Cliente'); }
                        });
                    }); 
            }
        });
    });
}




//enviar cartas
function enviar(req, res){
    console.log(req.session.user);
    res.render('cartas',{user: req.session.user})
}

function recibir(req, res) {
    let data = req.body;
    const archivoPDF = req.file;
    req.getConnection((err, conn) => {
        conn.query('INSERT into carta (nombresolicitante, poseecarta) values ( ? , true )', [ req.session.user.nombre + ' ' + req.session.user.apellido ], (err, userdata) => {
            if (err){
                console.log(err);
            } else {
                res.redirect('/Cliente');
            }
        });
    });
}

function eliminar(req, res){
    let data = req.body;
    req.getConnection((err, conn) => {
        conn.query('delete from carta where nombresolicitante = ?', [ data.nombresolicitante ], (err, userdata) => {
            if (err){
                console.log(err);
            } else {
            const filePath = path.join(__dirname, `../public/upload/cartas/carta_${data.nombresolicitante}.pdf`);
                // Borra el archivo
                fs.unlink(filePath, (err) => {
                if (err) {
                console.error(err);
                return;
                } else res.redirect('/tablajefePI');
                });
            }
        });
    });
}



//Director MINED
//Conformar equipo de trabajo
function conformarequipotrabajo(req, res){
    res.render('conformarequipotrabajo')
}





//Jefe primera infancia
//registrar circulo infantil
function registrarcirculo(req, res){
    res.render('registrarcirculo')
}

function registrarcirculo_post(req, res){
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM circulo WHERE id = ?', [data.id], (err, userdata) => {
            if (err) console.log(err);
            if (userdata.length > 0) {
                res.render('registrarcirculo', {
                    exist_error: true,
                    error: "Error: El círculo ya existe !" });
            } else {
                    req.getConnection((err, conn) => {
                         conn.query('INSERT INTO circulo SET ?', [data], (err, rows) => {
                            if (err) {
                                console.log(err);
                            } else { res.redirect('/JefePI'); }
                        });
                    }); 
            }
        });
    });
}

function funcionalidades(req, res){
    res.render('charts')
}



module.exports = {
    autenticar: autenticar,
    register: register,
    cerrarsesion: cerrarsesion,
    welcome,
    
    //roles
    directorMined : directorMined,
    cliente: cliente,
    jefePI: jefePI,

    
    funcionalidades: funcionalidades,
    
    //tablas
    tablajefePI: tablajefePI,
    tabladirMINED: tabladirMINED,
    
    //cliente
    solicitarentrevista,
    solicitarentrevista_post,
    solicitar: solicitar,
    solicitar_post: solicitar_post,
    realizarqueja,
    realizarqueja_post,
    enviar: enviar,
    recibir,
    eliminar,
    
    //director MINED
    conformarequipotrabajo,
   
    //jefe Primera Infancia
    registrarcirculo,
    registrarcirculo_post,
   
    
}



