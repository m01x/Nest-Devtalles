import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { isMongoId, isUUID } from 'class-validator';

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

      /* 
      *Esto se va al entity, before insert.
      if(!createProductDto.slug) {
        createProductDto.slug = createProductDto.title.toLowerCase().replace(" ","_").replace("'","");
      } else {
        createProductDto.slug = createProductDto.slug.toLowerCase().replace(" ","_").replace("'","");
      } */

      const product = this.productRepository.create(createProductDto); 
      await this.productRepository.save( product )

      return product;
      
    } catch (error) {
      this.handleDBExceptionsLogger(error)
    }
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(term: string) {
    
    let producto: Product | null;
    
    //*Evaluamos si el termino es un uuid

    if( isUUID(term)){

      producto = await this.productRepository.findOneBy({ id: term });
      return producto;

    }else{

      producto = await this.productRepository.findOneBy({slug: term});
      return producto;
    }
    throw new BadRequestException('El termino de búsqueda no es ni un UUID o un slug')
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
   
    const { affected } = await this.productRepository.delete( { id: id } );

    if( affected === 0 ){
      throw new BadRequestException(`Product with id "${ id }" not found`)
    }
    return;

  }

  private handleDBExceptionsLogger( error : any){

    if( error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error)
    //Reemplazamos el console.log generico, por algo con mejor detalle en nuestro sl.

    throw new InternalServerErrorException('Error inesperado [fn: handleDBExceptionsLogger]: Consulte los server logs')
  }
}
