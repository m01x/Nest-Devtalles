import { Controller, Get, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { ValidRoles } from './interfaces';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
    checkAuthStatus(
      @GetUser() user: User
    ){
      return this.authService.checkAuthStatus( user )
    }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    //@Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() RawHeaders: string[]
  ){

    return{
      ok:true,
      message:'Hola Mundo Private🔒🔑',
      user,
      userEmail,
      RawHeaders
    };
  }

  //Para fines educativos, para el uso de los guards
  //@SetMetadata('roles',['admin', 'super-user'])
  @Get('private2')
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2 (
    @GetUser() user:User
  ){

    return {
      ok: true,
      user
    }
  }

  /**
   * Version final, de una ruta protegida.
   * Esto sera realizado por un custom decorator.
   * https://cursos.devtalles.com/courses/take/nest/lessons/37024973-composicion-de-decoradores
   * 
   * Ahora, si queremos restringir una ruta, simplemente enviar el rol al Auth, ej
   * RUTA SOLO ADMINS = @Auth( ValidRoles.admin )
   * Vayan todos los autenticados = @Auth()
   * 
   * Me quito el sombrero en esta parte, si llegas a olvidarlo, REPASA LA CLASE, quedan faciles las sessions asi!
   */

  @Get('private3')
  @Auth()
  privateRoute3 (
    @GetUser() user:User
  ){

    return {
      ok: true,
      user
    }
  }


  
}
