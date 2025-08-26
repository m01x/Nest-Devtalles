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
      
      if (error.code === 11000){
        throw new BadRequestException(`Pokemon already exist in DB. ${ JSON.stringify( error.keyValue ) }` );
      }

      console.log(error); //El error no es duplicidad de registros, lanzamos otro error.
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);

    }


  }

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

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
