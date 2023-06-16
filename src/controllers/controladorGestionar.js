const bcrypt = require('bcrypt');


//gestionar quejas
function indexqueja(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM quejas', (err, quejas) => {
            if(err){
                res.json(err);
            }
            res.render('quejas/indexqueja', {quejas});
        });
    });
    
}
function realizarqueja(req, res){
    res.render('quejas/realizarqueja');
}

function guardarrespuesta(req, res){
    const data = req.body; 
    req.getConnection((err, conn) => {
        conn.query('update quejas SET respuesta = ? where numeroqueja = ?', [data.respuesta, data.numeroqueja], (err, rows) => {
            res.redirect('/quejas');
        });
    });
}

function destroyqueja(req, res){
const id = req.body.id;
req.getConnection((err, conn) => {
    conn.query('DELETE FROM quejas WHERE numeroqueja = ?', [id], (err, rows) => {
        res.redirect('/quejas');
    });
});
}


function editqueja(req, res){
    const id = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM quejas WHERE numeroqueja = ?', [id], (err, quejas) => {
            if(err){
                res.json(err);
            }
            res.render('quejas/editqueja', {quejas});
        });
    });
}

function updatequeja(req, res){
    const id = req.params.id;
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE quejas SET ? WHERE numeroqueja = ?', [data, id], (err, rows) => {
            res.redirect('/quejas');
        });
    });
}

//gestionar trabajadores
function indextrabajador(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM trabajadores order by equipo', (err, trabajadores) => {
            if(err){
                res.json(err);
            }
            res.render('trabajadores/indextrabajador', {trabajadores});
        });
    });
    
}
function createtrabajador(req, res){
    res.render('trabajadores/createtrabajador');
}
function agregarequipotrabajador(req, res){
    const ids = req.body.ids;
    const grupo = req.body.grupo;
    const valores = [grupo, ids];
    req.getConnection((err, conn) => {
    conn.query('UPDATE trabajadores SET equipo = ? WHERE id IN (?) ', valores, (error, results, fields) => {
      if (error) {
        console.error('Error al actualizar los grupos de los usuarios: ' + error.stack);
        res.status(500).send('Error al actualizar los grupos de los usuarios');
      } else {
        res.redirect('/trabajadores');
      }
    });
});
}

function storetrabajador(req, res){
    const data = req.body; 
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO trabajadores SET ?', [data], (err, rows) => {
            res.redirect('/trabajadores');
        });
    });
}
function destroytrabajador(req, res){
const id = req.body.id;
req.getConnection((err, conn) => {
    conn.query('DELETE FROM trabajadores WHERE id = ?', [id], (err, rows) => {
        res.redirect('/trabajadores');
    });
});
}
function edittrabajador(req, res){
    const id = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM trabajadores WHERE id = ?', [id], (err, trabajadores) => {
            if(err){
                res.json(err);
            }
            res.render('trabajadores/edittrabajador', {trabajadores});
        });
    });

}
function updatetrabajador(req, res){
    const id = req.params.id;
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE trabajadores SET ? WHERE id = ?', [data, id], (err, rows) => {
            res.redirect('/trabajadores');
        });
    });
}

//gestionar usuarios
function index(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario', (err, tasks) => {
            if(err){
                res.json(err);
            }
            res.render('tasks/index', {tasks});
        });
    });
    
}
function create(req, res){
    res.render('tasks/create');
}
//Registrarse
function store(req, res){
    const data = req.body;
       
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE username = ?', [data.username], (err, userdata) => {
            if (userdata.length > 0) {
                res.render('register', {
                    exist_error: true,
                    error: "Error: El usuario ya existe !" })
            } else {
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;
                    delete data.repeatpassword;
                    req.getConnection((err, conn) => {
                         conn.query('INSERT INTO usuario SET ?', [data], (err, rows) => {
                            if (err) {
                                console.log(err);
                            } else { res.redirect('/'); }
                        });
                    });
                });
            }
        });
    });
}
function destroy(req, res){
const id = req.body.id;
req.getConnection((err, conn) => {
    conn.query('DELETE FROM usuario WHERE id = ?', [id], (err, rows) => {
        res.redirect('/tasks');
    });
});
}
function edit(req, res){
    const id = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE id = ?', [id], (err, tasks) => {
            if(err){
                res.json(err);
            }
            res.render('tasks/edit', {tasks});
        });
    });
}
function update(req, res){
    const id = req.params.id;
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE usuario SET ? WHERE id = ?', [data, id], (err, rows) => {
            res.redirect('/tasks');
        });
    });
}

//gestionar solicitudes
function indexsolicitud(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM solicitud', (err, solicitudes) => {
            if(err){
                res.json(err);
            }
            conn.query('SELECT nombrecirculo FROM circulo', (err, circulo) => {
                if(err){
                    res.json(err);
                }
                
                res.render('solicitudes/indexsolicitud', {solicitudes, circulo });
            });
            
        });
    });
}


function asignarcirculo_post(req, res){
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO asignarcirculo SET ?', [data], (err, userdata) => {
            if (err) {console.log(err);
            } else { 
                conn.query('delete from solicitud where CIniño = ?', [data.CInino], (err, rows) => {
                            if (err) {
                                console.log(err);
                    } else { res.redirect('/DirectorMINED'); }
                });
            }
        }); 
    });
}


function createsolicitud(req, res){
    res.render('solicitudes/createsolicitud');
}

function storesolicitud(req, res){
    const data = req.body; 
    req.getConnection((err, conn) => {
        conn.query('update solicitud SET aceptad = ? where id=?', [data.aceptada, data.id], (err, rows) => {
            res.redirect('/solicitudes');
        });
    });
}
function destroysolicitud(req, res){
const id = req.body.id;
req.getConnection((err, conn) => {
    conn.query('DELETE FROM solicitud WHERE id = ?', [id], (err, rows) => {
        res.redirect('/solicitudes');
    });
});
}
function editsolicitud(req, res){
    const id = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM solicitud WHERE id = ?', [id], (err, solicitudes) => {
            if(err){
                res.json(err);
            }
            res.render('solicitudes/editsolicitud', {solicitudes});
        });
    });
}
function updatesolicitud(req, res){
    const id = req.params.id;
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE solicitud SET ? WHERE id = ?', [data, id], (err, rows) => {
            res.redirect('/solicitudes');
        });
    });
}

//gestionar niños
function indexnino(req, res){
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM ninos', (err, ninos) => {
            if(err){
                res.json(err);
            }
            res.render('ninos/indexnino', {ninos});
        });
    });
}
function createnino(req, res){
    res.render('ninos/createnino');
}
function storenino(req, res){
    const data = req.body; 
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO ninos SET ?', [data], (err, rows) => {
            res.redirect('/ninos');
        });
    });
}
function destroynino(req, res){
const id = req.body.id;
req.getConnection((err, conn) => {
    conn.query('DELETE FROM ninos WHERE id = ?', [id], (err, rows) => {
        res.redirect('/ninos');
    });
});
}
function editnino(req, res){
    const id = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM ninos WHERE id = ?', [id], (err, ninos) => {
            if(err){
                res.json(err);
            }
            res.render('ninos/editnino', {ninos});
        });
    });
}
function updatenino(req, res){
    const id = req.params.id;
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE ninos SET ? WHERE id = ?', [data, id], (err, rows) => {
            res.redirect('/ninos');
        });
    });
}



module.exports = {
     //quejas
     indexqueja,
     guardarrespuesta,
     realizarqueja,
     destroyqueja,
     editqueja,
     updatequeja,
     //trabajadores
     indextrabajador,
     agregarequipotrabajador,
     createtrabajador,
     storetrabajador,
     destroytrabajador,
     edittrabajador,
     updatetrabajador,
     //usuarios
    index: index,
    create: create,
    store: store,
    destroy: destroy,
    edit: edit,
    update: update,
    //ninos
    indexnino: indexnino,
    createnino: createnino,
    storenino: storenino,
    destroynino: destroynino,
    editnino: editnino,
    updatenino: updatenino,
    //solicitudes
    indexsolicitud: indexsolicitud,
    asignarcirculo_post,
    createsolicitud: createsolicitud,
    storesolicitud: storesolicitud,
    destroysolicitud: destroysolicitud,
    editsolicitud: editsolicitud,
    updatesolicitud: updatesolicitud,
}