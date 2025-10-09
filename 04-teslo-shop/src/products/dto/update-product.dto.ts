/* 
*Importacion por defecto. La debemos cambiar por la de Swagger para que tome las @ApiProperty() , definidas en CreateProductDto
import { PartialType } from '@nestjs/mapped-types'; */
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
