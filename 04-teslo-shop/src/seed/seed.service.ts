import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    
    @InjectRepository ( User )
    private readonly userRepository: Repository<User>
  ) {}
  
  async runSeed(){
    await this.deleteTables();
    const adminUser = await this.insertUsers()
    await this.insertDefaultProducts( adminUser );
    return `Seed Ejecuted`
  }

  //SEED
  private async deleteTables(){

    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    /**
     * !💣QUERY PELIGROSA💀
     * ? como ella??
     */
    await queryBuilder.delete().where({}).execute();

  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach( ({password, ...user}) => {


      users.push( this.userRepository.create( {
        ...user,
        password: bcrypt.hashSync( password, 10)
      } ) );
    });

    const dbUsers = await this.userRepository.save( users ); //acá ya va con uuid...

    return dbUsers[0];


  }

  private async insertDefaultProducts( user : User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];

    products.forEach( product => {
      insertPromises.push( this.productService.create( product, user ) );
    });

    await Promise.all( insertPromises );

    return true
  }
}
