import { Schema } from 'mongoose';

export const RolSchema = new Schema({

    nombreRol: {
        type: String,
       required: [true, 'se debe asignar un nombre al rol']
    },

    descripcionRol: {
        type: String
    },

    estado: {
        type: String,
       required:true
    }
    // usuario:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Usuario',
        
    // }
})

RolSchema.methods.toJSON= function(){
    const {__v, _id, ...data}= this.toObject();
    return data;
}