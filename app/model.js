// Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var contactoSchema = new Schema({
    name:String,
    facebookID:String,
    accessToken:String,
    lista:[{
    nombre: String,
    apellido: String,
    email: String,
    fecha: String,
    image: String,
    image_id: String,
    created_at: Date}]
});

// the schema is useless so far
// we need to create a model using it
var Contacto= mongoose.model('Contactos', contactoSchema);

// make this available to our users in our Node applications
module.exports = Contacto;