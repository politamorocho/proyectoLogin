//import mongoose from 'mongoose';
import { Schema } from 'mongoose';
// const { Schema, model } = require('mongoose');

export const UsuarioSchema = new Schema({
  cedula: {
    type: String,
    required: [false, 'la cedula es obligatoria'],
    unique: true,
  },
  nombre: {
    type: String,
    // required: false,
  },
  apellido: {
    type: String,
    // required: false,
  },
  razonSocial: {
    type: String,
    // required: [false, 'unir nombre y apellido'],
  },
  correo: {
    type: String,
    //required: [true, 'el correo es obligatorio'],
    unique: true,
  },
  nombreUsuario: {
    type: String,
    //required: [true, 'el nombre de usuario es obligatoria'],
    unique: true,
  },
  claveUsuario: {
    type: String,
    // required: [true, 'la clave es obligatoria'],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  rol: {
    type: Schema.Types.ObjectId,
    ref: 'Rol',
    //required: [true, 'debe asignarse un rol a este usuario'],
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

  fechaCreacion: {
    type: Date,
    //default: new Date().toISOString().slice(0, 10),
  },
});

UsuarioSchema.set('timestamps', true);

UsuarioSchema.methods.toJSON = function () {
  const { __v, claveUsuario, fechaCreacion, ...data } = this.toObject();
  return data;
};

// module.exports = mongoose.model('Usuario', UsuarioSchema)
