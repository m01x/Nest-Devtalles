import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);

    }


  }

  //TODO:Hacer las paginaciones y hay que cargar la bd con mas registros
  
  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon:Pokemon | null = null;

    if (!isNaN(+term)){ //Si al transformar este id, es un numero.
      pokemon = await this.pokemonModel.findOne( { no: term } );
    }

    //Verificacion por si es mongo id
    if ( !pokemon && isValidObjectId(term) ){ //Esta propiedad viene de Mongoose, para verificar si un string es de tipo mongoId
      pokemon = await this.pokemonModel.findById( term );

    }

    // Name
    if ( !pokemon ){
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim()})
    }



    if ( !pokemon ) throw new NotFoundException(`Pokemon with id, name or no. "${ term } not found."`)


    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {

      const pokemon = await this.findOne( term ); //Buscamos el pokemon a editar, el term viene en la url.

      /**
       * El updatePokemonDto es el body de la solicitud... se formatea con el dto
       * y es en cuestion el objeto que va a modificar la BD
       */

      if (!updatePokemonDto) throw new BadRequestException('No data provided to update');
      if ( updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase(); //se normaliza el nombre que llega a minuscula

      await pokemon.updateOne( updatePokemonDto, { new: true } );

      return {...pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {

      this.handleExceptions(error);
    }

    
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id); //Buscamos el pkm
    // await pokemon.deleteOne(); //pum, lo entregamos al delete...

    // const result = await this.pokemonModel.findByIdAndDelete( id );

    //! CUIDADO CON this.pokemonModel.deleteMany() porque equivale a un DELETE * FROM pokemon
    const { deletedCount } = await this.pokemonModel.deleteOne( { _id: id } );

    if( deletedCount === 0 ){
      throw new BadRequestException(`Pokemon with id "${ id }" not found`)
    }
    return;
  }

  /**
   * * ***************************
   * ?🐈🌺🌈Custom Functions ****
   * * ***************************
   * @param error
   */

  private handleExceptions( error: any){
    if (error.code === 11000){
        throw new BadRequestException(`ERROR: El ID. ${ JSON.stringify( error.keyValue ) } ya se encuentra en uso` );
      }

      console.log(error); //El error no es duplicidad de registros, lanzamos otro error.
      throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`);
  }

  
}
