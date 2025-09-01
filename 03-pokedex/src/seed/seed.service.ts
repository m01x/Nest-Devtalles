import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){}
  
  
  async executeSeed(){

    //! Wipe de la BD antes de insertar el seed
    await this.pokemonModel.deleteMany({}); //! Esto equivale a delete * from table.

    let registros: Array<CreatePokemonDto> = [];


    try {
      const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);


      data.results.forEach(async({name, url})=>{

        const segments = url.split('/'); //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '1', '' ]
        const no : number = +segments[ segments.length -2]; //* Quiero la penultima posición.
        registros.push({name,no});
      
      });

      const pokemonesInsertados:Pokemon[] = await this.pokemonModel.insertMany( registros )
      return `🌱 Seed ejecutada!: ${ pokemonesInsertados.length} insersiones.`;
      
    } catch (error) {
      console.log(error);
      return;
    }

  }
}
