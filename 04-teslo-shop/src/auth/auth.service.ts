import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    //Inyectaremos el repositorio para TypeORM.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
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

  async login( loginUserDto: LoginUserDto){

    try {

      const {password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
         where: { email },
         select: {email: true, password: true}
      
        });

        if (!user)
          throw new UnauthorizedException('Credentials are not valid (user not found)');

        if( !bcrypt.compareSync( password, user.password) ) //Esto comparara la contraseña que le ingresamos por POST, comparara el hash con la que tenemos almacenada.
          throw new UnauthorizedException('Credentials are not valid (wrong password)')

          
      return user;
      
    } catch (error) {
      console.log(error)
    }

  }


  private getJwtToken( payload: JwtPayload ){
    //Para generar el jwt, debemos proveer un servicio que ya tenemos... lo inyectaremos en el constructor
  }
  


  /**
   * !Error handling
   */

  private handleErrors( error: any): never {

    if ( error.code === '23505') throw new BadRequestException( error.detail );

    console.log(error);

    throw new InternalServerErrorException('Please check server errors⚠️');
  }
}
