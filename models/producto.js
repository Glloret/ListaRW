const mongoose = require('mongoose');
const productoSchema = new mongoose.Schema({
        nombre: {
            type: String, required: true
        },
        comprado: {
            type: Boolean, default: false

        },
        fecha: {
            type: Date, default: Date.now

        }
});
module.exports = mongoose.model('Producto',productoSchema);