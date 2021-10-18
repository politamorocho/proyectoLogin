import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioInterface } from './usuario.interface';
import { Model, Mongoose } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
import { isMongoId } from 'class-validator';
import { Schema } from 'mongoose';

import { UsuarioDto, ActualizarUsuarioDto } from './usuario.dto';

import { RolService } from 'src/rol/rol.service';

const bcryptjs = require('bcryptjs');

@Injectable()
export class UsuarioService {
  constructor(
    //private readonly model: Model<UsuarioInterface>
    @InjectModel('Usuario') private model: Model<UsuarioInterface>,
    private readonly rolService: RolService,
  ) {}

  //crear usuario
  async crearUsuario(usuario: UsuarioDto): Promise<UsuarioInterface | boolean> {
    //verifica si existe el correo
    const correoExiste = await this.model.findOne({
      correo: usuario.correo,
    });

    //si el correo existe, no se puede  crear el usuario
    if (correoExiste) {
      throw new BadRequestException(
        `El correo ${correoExiste.correo} ya existe`,
      );
    }

    //si el nombreUsuario existe no lo puede crear
    const nomUsExiste = await this.model.findOne({
      nombreUsuario: usuario.nombreUsuario,
    });

    if (nomUsExiste) {
      throw new BadRequestException(`El nombre de usuario ya existe`);
    }

    //preguntar si el rol es un  id valid de mongo
    if (!isMongoId(usuario.rol)) {
      throw new BadRequestException(
        `El rol  ${usuario.rol} no es valido de mongo`,
      );
    }

    //si es un mongoid valido, verifica que exista
    const rolId = await this.rolService.verificaRolId(usuario.rol);
    if (!rolId) {
      throw new BadRequestException(`El rol  ${usuario.rol} no existe`);
    }

    //pregunta si es un rol activo
    const rolActivo = await this.rolService.verificaRolActivo(usuario.rol);
    if (!rolActivo) {
      throw new BadRequestException(`El rol asignado no es un rol activo`);
    }

    //si no existe el correo y existe el rol, entonces crea el usuario
    if (!correoExiste) {
      //encriptar la clave
      const salt = bcryptjs.genSaltSync(10);
      usuario.claveUsuario = bcryptjs.hashSync(usuario.claveUsuario, salt);

      //guardar en bd
      const resultado = await new this.model(usuario).save();

      return resultado;
    } else {
      return correoExiste;
    }
  }

  //lista todos los usuarios con estado true-activo
  async listarUsuarios() {
    const query = { estado: true };
    const usuariosLista = await this.model.find(query).populate('rol', '-__v');

    return usuariosLista;
  }

  //listar todos los usuarios con estado true o false
  async listarTodos() {
    //const query = { estado: true };
    const usuariosLista = await this.model.find().populate('rol', '-_id -__v');

    return usuariosLista;
  }

  //lista la info de un usuario buscado por su MongoID
  async listarUsuarioID(
    usuarioID: string,
  ): Promise<UsuarioInterface | boolean> {
    const data = await this.model
      .findOne({ _id: usuarioID })
      .populate('rol', '-_id -__v');

    if (!data) {
      return false;
    }
    if (!data.estado) {
      return false;
    }

    return data;
  }

  //actualizar usuario por id
  async actualizarUsuario(
    usuarioActualizado: ActualizarUsuarioDto,
    id: string,
  ) {
    const existeID = await this.model.findOne({ _id: id });

    const usuActEntity = new this.model(usuarioActualizado);
    const data = usuActEntity.toObject();
    delete data._id;

    //pregunta si existe el id que llega, si no existe sale.
    if (!existeID) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }

    //pregunta el estado del usuario que llega, si es false sale.
    if (!existeID.estado) {
      throw new BadRequestException(`no es un usuario activo`);
    }

    //verifica si existe el correo, si existe no puede actualizar
    if (usuarioActualizado.correo) {
      const correoExiste = await this.model.findOne({
        correo: usuarioActualizado.correo,
      });

      if (correoExiste) {
        throw new BadRequestException(
          `el correo ${correoExiste.correo} ya existe`,
        );
      }
    }

    if (usuarioActualizado.nombreUsuario) {
      //si el nombreUsuario existe no lo puede crear
      const nomUsExiste = await this.model.findOne({
        nombreUsuario: usuarioActualizado.nombreUsuario,
      });

      if (nomUsExiste) {
        throw new BadRequestException(`El nombre de usuario ya existe`);
      }
      data.nombreUsuario = usuarioActualizado.nombreUsuario;
    }

    //verifica el id de rol que sea valido
    if (usuarioActualizado.rol) {
      if (!isMongoId(usuarioActualizado.rol)) {
        throw new BadRequestException(`el rol no es un id de mongo valido`);
      }

      //si es un mongoid valido, verifica que exista
      const rolId = await this.rolService.verificaRolId(usuarioActualizado.rol);
      if (!rolId) {
        throw new NotFoundException(`el rol no existe`);
      }

      //pregunta si es un rol activo
      const rolActivo = await this.rolService.verificaRolActivo(
        usuarioActualizado.rol,
      );
      if (!rolActivo) {
        throw new BadRequestException(`el rol no es un rol activo`);
      }

      data.rol = mongoose.Types.ObjectId(usuarioActualizado.rol);
    }

    if (usuarioActualizado.claveUsuario) {
      const salt = bcryptjs.genSaltSync(10);
      data.claveUsuario = bcryptjs.hashSync(
        usuarioActualizado.claveUsuario,
        salt,
      );
    }

    console.log('data:', data);

    const actualizado = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
    console.log('actualizaado', actualizado);

    return actualizado;
  }

  async actualizarPerfil(usuarioActualizado: ActualizarUsuarioDto, id: string) {
    const existeID = await this.model.findOne({ _id: id });

    const usuActEntity = new this.model(usuarioActualizado);
    const data = usuActEntity.toObject();
    delete data._id;

    //pregunta el estado del usuario que llega, si es false sale.
    // if (!existeID.estado) {
    //   throw new BadRequestException(`no es un usuario activo`);
    // }

    //verifica si existe el correo, si existe no puede actualizar
    if (usuarioActualizado.correo) {
      const correoExiste = await this.model.findOne({
        correo: usuarioActualizado.correo,
      });

      if (correoExiste) {
        throw new BadRequestException(
          `el correo ${correoExiste.correo} ya existe`,
        );
      }
    }

    if (usuarioActualizado.nombreUsuario) {
      //si el nombreUsuario existe no lo puede crear
      const nomUsExiste = await this.model.findOne({
        nombreUsuario: usuarioActualizado.nombreUsuario,
      });

      if (nomUsExiste) {
        throw new BadRequestException(`El nombre de usuario ya existe`);
      }
      data.nombreUsuario = usuarioActualizado.nombreUsuario;
    }

    //verifica el id de rol que sea valido
    if (usuarioActualizado.rol) {
      if (!isMongoId(usuarioActualizado.rol)) {
        throw new BadRequestException(`el rol no es un id de mongo valido`);
      }

      //si es un mongoid valido, verifica que exista
      const rolId = await this.rolService.verificaRolId(usuarioActualizado.rol);
      if (!rolId) {
        throw new NotFoundException(`el rol no existe`);
      }

      //pregunta si es un rol activo
      const rolActivo = await this.rolService.verificaRolActivo(
        usuarioActualizado.rol,
      );
      if (!rolActivo) {
        throw new BadRequestException(`el rol no es un rol activo`);
      }

      data.rol = mongoose.Types.ObjectId(usuarioActualizado.rol);
    }

    if (usuarioActualizado.claveUsuario) {
      const salt = bcryptjs.genSaltSync(10);
      data.claveUsuario = bcryptjs.hashSync(
        usuarioActualizado.claveUsuario,
        salt,
      );
    }

    console.log('data:', data);

    const actualizado = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
    console.log('actualizaado', actualizado);

    return actualizado;
  }

  //borrar usuario logico
  async borradoLogico(usuarioID: string) {
    const existeID = await this.model.findOne({ _id: usuarioID });

    if (!existeID) {
      throw new NotFoundException(`el usuario no existe`);
    }
    if (!existeID.estado) {
      throw new BadRequestException(`El usuario no esta activo`);
    }

    if (existeID && existeID.estado === true) {
      const usuarioBorrado = await this.model.findByIdAndUpdate(
        usuarioID,
        { estado: false },
        { new: true },
      );
      return usuarioBorrado;
    }
  }

  async encontrarUsuariosPorID(usuarioId: string) {
    return await this.model.findOne({
      _id: usuarioId,
    });
  }

  async encontrarUsuariosPorCorreo(correo: string) {
    return await this.model.findOne({
      correo,
    });
  }

  async validarUsuario(correo: string, claveUsuario: string) {
    //verificar que exista el correo
    const existeUsuario = await this.model.findOne({
      correo,
    });

    if (!existeUsuario) {
      return false;
    }

    //si el estado es false
    if (!existeUsuario.estado) {
      return false;
    }

    //compara la clave
    const claveValida = await bcryptjs.compareSync(
      claveUsuario,
      existeUsuario.claveUsuario,
    );

    if (!claveValida) {
      return false;
    }

    return existeUsuario;
  }

  async listaUsuarioPorRol(termino: string) {
    const rol = await this.rolService.verificaSiExisteRol(termino);
    console.log(rol, 'el rol es ');
    if (!rol) {
      return false;
    }

    const usuarios = await this.model
      .find({
        estado: true,
        $and: [{ rol: rol._id }],
      })
      .populate('rol', 'nombreRol');

    console.log(usuarios, 'usuarios son');
    return usuarios;
  }
}
