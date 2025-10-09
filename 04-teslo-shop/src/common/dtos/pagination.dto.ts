import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDTO {

    @ApiProperty({
        default: 10, description:'how many rows do you need'
    })
    @IsOptional()
    @IsPositive() // Claro, no aparece @IsNumeric o algo asi , porque al especificar qeu sea positivo, va implicito ese decorador.
    @Type( ()=> Number ) //enableImplicitConversions: True
    limit?: number;

    @ApiProperty({
        default: 0, description:'how many rows do you want to skip'
    })
    @IsOptional()
    @Type( ()=> Number ) //enableImplicitConversions: True
    @Min(0)
    offset?: number

}