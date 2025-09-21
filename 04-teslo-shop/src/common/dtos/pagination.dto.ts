import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDTO {

    @IsOptional()
    @IsPositive() // Claro, no aparece @IsNumeric o algo asi , porque al especificar qeu sea positivo, va implicito ese decorador.
    @Type( ()=> Number ) //enableImplicitConversions: True
    limit?: number;

    @IsOptional()
    @Type( ()=> Number ) //enableImplicitConversions: True
    @Min(0)
    offset?: number

}