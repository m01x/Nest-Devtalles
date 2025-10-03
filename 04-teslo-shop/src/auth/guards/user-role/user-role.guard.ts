import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    //* Reflector te ayuda a ver informacion de metadata de la funcion que viene a decorar,
    //*  asi como tambien info. de otros decoradores, tal como el guard, o el mismisimo metadata donde queremos extraer los roles.
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    
    const validRoles: string[] = this.reflector.get(META_ROLES , context.getHandler());

    if ( !validRoles ) return true; //Si no existen roles validos, se esta autenticando desde otro lado.
    if ( validRoles.length === 0 ) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    //una pequeñita validacion
    if( !user )
      throw new BadRequestException('[UserRoleGuard]: User not found.');

    for (const role of user.roles) {
      
      if ( validRoles.includes( role ) ){
        return true;
      }
    }

    throw new ForbiddenException(`[user-role.guard]: User ${ user.fullName } need a valid role:[${ validRoles }]`);
  }
}
