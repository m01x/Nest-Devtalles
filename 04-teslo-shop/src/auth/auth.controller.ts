import { Controller, Get, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

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
  @RoleProtected()
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2 (){

    return {
      ok: true,
    }
  }


  
}
