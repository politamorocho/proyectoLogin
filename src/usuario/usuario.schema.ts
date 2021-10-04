import mongoose from 'mongoose'
const { Schema, model } = require('mongoose');

export const UsuarioSchema = new Schema({
    cedula: {
        type: String,
        required: [true, 'la cedula es obligatoria'],
        unique: true
    },
    nombre: {
        type: String,
        required: false,
    },
    apellido: {
        type: String,
        required: false,
    },
    razonSocial: {
        type: String,
        required: [false, 'unir nombre y apellido'],
    },
    correo: {
        type: String,
        required: [true, 'el correo es obligatoria'],
        unique: true
    },
    rol: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    provincia: {
        type: String,

    },
    ciudad: {
        type: String,
    },
    direccion: {
        type: String,
    },
    telefono: {
        type: String,

    },
    referenciaDomicilio: {
        type: String,

    },
    nombreUsuario: {
        type: String,
        required: [true, 'el nombre de usuario es obligatoria'],
        unique: true
    },
    claveUsuario: {
        type: String,
        required: [true, 'la clave es obligatoria'],
        unique: true
    },
    estado: {
        type: Boolean,
        default:true
    },
    fechaCreacion: {
        type: Date,
    },
})

UsuarioSchema.methods.toJSON= function(){
    const {__v, estado, claveUsuario, fechaCreacion, ...data}= this.toObject();
    return data;
}

module.exports = mongoose.model('Usuario', UsuarioSchema)