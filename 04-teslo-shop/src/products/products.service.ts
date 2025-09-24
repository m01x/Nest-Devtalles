import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { isMongoId, isUUID } from 'class-validator';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';

import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  //Para trabajar con la tabla productos, es necesario tratarlo como Repository, que utilice lo definido en el DTO.
  //También es posible trabajar el objeto a insertar como new Product() , pero el profe recomienda utilizarlo como repositorio y no instancia.
  // InjectRepository viene de @nestjs/typeorm y Repository viene de typeorm. Lo trabajaremos en el constructor.

  constructor(

    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
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

      const { images = [], ...productDetails} = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
      images: images.map( image => this.productImageRepository.create({ url: image }))
      }); 
      await this.productRepository.save( product )

      return {...product, images};
      
    } catch (error) {
      this.handleDBExceptionsLogger(error)
    }
  }

  async findAll(paginationDto: PaginationDTO) {

    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map( (product) => ({
      ...product,
      images: product.images?.map(img => img.url)
    }))
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
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      producto = await queryBuilder
        .where('UPPER(title) = :title OR slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }

    if( !producto )
    throw new NotFoundException(`No se encontro producto con el termino: ${ term }`);

    return producto;
  }

  async findOnePlain( term: string ){
    const { images = [] , ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map( image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...restToUpdate } = updateProductDto

    //* Busca un producto por el ID y adicionalmente carga todas las propiedades que esten en este updateProductDto
      const product = await this.productRepository.preload({ id: id,...restToUpdate }); 

    if ( !product ) throw new NotFoundException(`Product ID: ${id} , not found.`);

    //Create Query Runner .
    const queryRunner = this.dataSource.createQueryRunner(); //Con esto haremos varios pasos... Definiremos una serie de procedimientos.
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {

      if( images ){

        await queryRunner.manager.delete(ProductImage, { product: { id: id } });

        product.images = images.map(
          image => this.productImageRepository.create({ url: image})
        )
      } else {

      }

        await queryRunner.manager.save( product );
        //await this.productRepository.save( product ); Outdated, mejoramos la actualizacion con el uso de Query Runner

        //* Consolidamos los cambios
        await queryRunner.commitTransaction();
        await queryRunner.release();

        return this.findOnePlain(id);
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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
