import { Injectable, NotFoundException } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid'
import { Car } from './interfaces';

@Injectable()
export class CarsService {

    private cars: Car[] = [
        {
            id:uuidv4(),
            brand:'Toyota',
            model:'Corolla'
        },
        {
            id:uuidv4(),
            brand:'Honda',
            model:'Civic'
        },
        {
            id:uuidv4(),
            brand:'Jeep',
            model:'OwnJeep'
        },

    ];  


    findAll(){
        return this.cars;
    }

    findOnById( id:string ){
        //Valido si existe en BD
        //Preparo la respuesta, y la envio.
        const car = this.cars.find(car => car.id === id);

        if ( !car ) throw new NotFoundException(`Car with id ${id} not found.`);
        
        return car;
    }
}
