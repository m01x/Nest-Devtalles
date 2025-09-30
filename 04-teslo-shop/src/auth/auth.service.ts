import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {

  constructor(
    //Inyectaremos el repositorio para TypeORM.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10)
      }); //Esto lo prepara, no hace el "commit"
      await this.userRepository.save( user );
      
      const { password : hidePass, ...restUserData} = user;

      return restUserData;
      //TODO retornar el JWT de acceso.

    } catch (error) {
      this.handleErrors(error)
    }

  }

  private handleErrors( error: any): never {

    if ( error.code === '23505') throw new BadRequestException( error.detail );

    console.log(error);

    throw new InternalServerErrorException('Please check server errors⚠️');
  }
}
