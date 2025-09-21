import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { isMongoId, isUUID } from 'class-validator';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';

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

  findAll(paginationDto: PaginationDTO) {

    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
      //TODO: RELACIONES.
    });
  }

  async findOne(term: string) {
    
    let producto: Product | null;
    
    //*Evaluamos si el termino es un uuid

    if( isUUID(term)){

      producto = await this.productRepository.findOneBy({ id: term });

    }else{
      /**
       * ?      Con query builders podemos elaborar sentencias SQL mas completas, como en este caso:
       * *      SELECT * FROM product WHERE slug = xxxx OR title = XXXX limit 1
       */
      const queryBuilder = this.productRepository.createQueryBuilder();
      producto = await queryBuilder
        .where('UPPER(title) = :title OR slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
    }

    if( !producto )
    throw new NotFoundException(`No se encontro producto con el termino: ${ term }`);

    return producto;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    //* Busca un producto por el ID y adicionalmente carga todas las propiedades que esten en este updateProductDto
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if ( !product ) throw new NotFoundException(`Product ID: ${id} , not found.`);

    try {

        await this.productRepository.save( product );
        return product;
      
    } catch (error) {
      this.handleDBExceptionsLogger(error);
    }

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
