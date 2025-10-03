import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

//Esto es para no escribir roles a dedito pelado, para evitar errores en la obtencion del metadata.
export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
    
    return SetMetadata(META_ROLES, args)

};
