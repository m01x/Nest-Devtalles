import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

/**
 * ! Todas las estrategias son providers, como los Services.
 * Se pueden inyectar con el decorador @Injectable
 */
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy){

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ){
        /**
         * *JwtStrategy hereda de PassportStrategy , por lo que debemos llamar al constructor del padre con super()
         */
        super({
            secretOrKey: configService.get('JWT_SECRET') as string,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }
    async validate( payload: JwtPayload ): Promise<User>{

        const { email } = payload;
        const user = await this.userRepository.findOneBy({ email });

        if(!user)
            throw new UnauthorizedException('token not valid');

        if(!user.isActive)
            throw new UnauthorizedException('User is inactive, please talk with an SysAdmin');

        return user;
    }
}