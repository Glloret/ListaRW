const express = require('express');
const mongoose =require('mongoose');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();

const Producto = require("./models/producto");

const PORT =process.env.PORT || 3000;


// HTTP server
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Socket server
const io =socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
    Producto.find().sort({comprado: 1, fecha: -1}).exec(function(err, resultado){
        io.emit('lista', resultado);
        // console.log(resultado);
    });

    socket.on('addProduct', (msg) => {
        // io.emit('dadores',msg);
        //  console.log(msg);
        Producto.findOne({"nombre": msg.nombre}).exec( function(err,res) {
            if (res == null) {
                // console.log('Hacer algo');
                const producto = new Producto(msg);
                // console.log(producto);
                producto.save().then ( function () {    
                Producto.find().sort({comprado: 1, fecha: -1}).exec(function(err, resultado){
                    io.emit('lista', resultado);
                    // console.log(resultado);
                });
            });
            }

        });


 
    });

    socket.on('updateProduct', (producto) => {
        let filtro={};
        filtro['nombre']= producto.nombre;     
        Producto.findOneAndUpdate(filtro, { comprado: producto.comprado, fecha: Date()},{ new: true}).exec( function(err,resultado){
            if (err) {
                console.log(err);
            } else {
                // console.log(resultado);
                Producto.find().sort({comprado: 1, fecha: -1}).exec(function(err, resultado){
                    io.emit('lista', resultado);
                    // console.log(resultado);
                });
                // io.emit('cambio', mensaje );
                // console.log(mensaje);
            }
        });

    
    });   
    socket.on('deleteProduct', (producto) => {
        let filtro={};
        filtro['nombre']= producto.nombre;     
        Producto.findOneAndRemove(filtro,{ new: true}).exec( function(err,resultado){
            if (err) {
                console.log(err);
            } else {
                // console.log(resultado);
                Producto.find().sort({comprado: 1, fecha: -1}).exec(function(err, resultado){
                    io.emit('lista', resultado);
                    // console.log(resultado);
                });
                // io.emit('cambio', mensaje );
                // console.log(mensaje);
            }
        });

    
    }); 





});



    
//     // socket.on('disconnect', () => console.log('Client disconnected'));
// });

app.use("/",express.static('public'));

mongoose.connect(process.env.MONGODB_URI || process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, 
    () => {
        console.log('connected to DB!');        
    }
).then(() => console.log('DB Connected!'))
.catch(err => {
console.log(Error, err.message);
});




app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");




//POST METHOD
app.post('/',async (req, res) => {
    const producto = new Producto({
        nombre: req.body.content
    });
    console.log(producto);
    producto.save();
    
    try {
        await producto.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    Producto.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });