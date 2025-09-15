import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  //Para trabajar con la tabla productos, es necesario tratarlo como Repository, que utilice lo definido en el DTO.
  //También es posible trabajar el objeto a insertar como new Product() , pero el profe recomienda utilizarlo como repositorio y no instancia.
  // InjectRepository viene de @nestjs/typeorm y Repository viene de typeorm. Lo trabajaremos en el constructor.

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ){}


  async create(createProductDto: CreateProductDto) {
    
    try {

      const product = this.productRepository.create(createProductDto); 
      await this.productRepository.save( product )

      return product;
      
    } catch (error) {
      this.handleDBExceptionsLogger(error)
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDBExceptionsLogger( error : any){

    if( error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error)
    //Reemplazamos el console.log generico, por algo con mejor detalle en nuestro sl.

    throw new InternalServerErrorException('Error inesperado [fn: handleDBExceptionsLogger]: Consulte los server logs')
  }
}
