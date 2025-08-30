import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;
  
  async executeSeed(){

    let registros: Array<CreatePokemonDto>;


    try {
      const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=5`);


      data.results.forEach(({name, url})=>{

        const segments = url.split('/'); //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '1', '' ]
        const no : number = +segments[ segments.length -2]; //* Quiero la penultima posición.

        registros.push({name,no});
      
      });
      
      return registros;
      
    } catch (error) {
      console.log(error);
      return;
    }

  }
}
