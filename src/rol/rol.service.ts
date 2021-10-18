import {
  Injectable,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { upperCase } from 'upper-case';

import { UsuarioService } from 'src/usuario/usuario.service';

import { RolDto, ActualizarRolDto } from './rol.dto';
import { RolInterface } from './rol.interface';

@Injectable()
export class RolService {
  constructor(
    //private readonly usuarioService:UsuarioService,
    @InjectModel('Rol') private model: Model<RolInterface>,
  ) {}

  async crearRol(rol: RolDto) {
    const nombre = upperCase(rol.nombreRol);
    //const est = rol.estado;
    //const estado = upperCase(rol.estado);

    const nombreRolExiste = await this.model.findOne({ nombreRol: nombre });

    //si existe no se crea
    if (nombreRolExiste) {
      throw new BadRequestException(
        `El rol ${nombreRolExiste.nombreRol} ya existe`,
      );
    }

    //si no es un estado valido no se crea
    // if (est < 0 || est > 1) {
    //   console.log(est, 'estado que pasa');
    //   throw new BadRequestException(`El estado  ${est} no es un estado valido`);
    // }

    const data = {
      nombreRol: nombre,
      descripcionRol: rol.descripcionRol,
      estado: rol.estado,
    };

    const resultado = await new this.model(data).save();
    return resultado;
  }

  async listarTodos() {
    const listaRol = await this.model.find();

    return listaRol;
  }

  async listarRolesActivos() {
    const query = { estado: 1 };
    const listaRol = await this.model.find(query);

    return listaRol;
  }

  async mostrarRol(id: string) {
    const existeRol = await this.model.findOne({ _id: id });

    if (!existeRol) {
      throw new BadRequestException(`El estado con el id ${id} no existe`);
    }

    return existeRol;
  }

  async actualizarRol(rolActual: ActualizarRolDto, id: string) {
    const existeID = await this.model.findOne({ _id: id });

    // const existeID = this.encontrarUsuariosPorID(rolActual._id);

    if (!existeID) {
      throw new NotFoundException(
        `no se puede actualizar el rol id: ${id} porque no existe`,
      );
    }

    if (existeID.estado == 0) {
      throw new BadRequestException(
        `no se puede actualizar el rol  ${existeID.nombreRol} porque es inactivo`,
      );
    }

    if (rolActual.nombreRol != undefined) {
      rolActual.nombreRol = upperCase(rolActual.nombreRol);
    }

    const actualizado = this.model.findByIdAndUpdate(id, rolActual, {
      new: true,
    });

    return actualizado;
  }

  async borradoLogico(rolId: string) {
    const existeID = await this.model.findOne({ _id: rolId });

    if (!existeID) {
      throw new NotFoundException(
        `no se puede eliminar  ${rolId} porque no existe`,
      );
    }
    if (existeID.estado == 0) {
      throw new BadRequestException(
        `no se puede eliminar  ${existeID.nombreRol} porque no existe`,
      );
    }

    const rolBorrado = await this.model.findByIdAndUpdate(
      rolId,
      { estado: 0 },
      { new: true },
    );
    return rolBorrado;
  }

  async verificaSiExisteRol(nombre: string) {
    const rolBuscar = upperCase(nombre);
    const rolExiste = await this.model.findOne({ nombreRol: rolBuscar });

    if (!rolExiste) {
      return false;
    }

    if (rolExiste.estado == 0) {
      return false;
    }

    return rolExiste;
  }

  async verificaRolId(id: string) {
    const rolExiste = await this.model.findById({ _id: id });

    if (!rolExiste) {
      return false;
    }
    return true;
  }

  async verificaRolActivo(id: string) {
    const rolExiste = await this.model.findById({ _id: id });

    if (rolExiste.estado == 0) {
      return false;
    }

    return true;
  }

  async verificaRolActivo2(id: string) {
    const rolExiste = await this.model.findById({ _id: id });

    if (rolExiste.estado == 0) {
      return false;
    }

    return rolExiste;
  }

  // async tipoRol(id:string){
  //     const esAdmin= this.usuarioService.tipoRol(id);
  //     if(!esAdmin){
  //         return  false
  //     }
  //     return true
  // }
}
