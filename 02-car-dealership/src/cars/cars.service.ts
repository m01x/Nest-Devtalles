import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid'
import { Car } from './interfaces';
import { CreateCarDto, UpdteCarDto } from './dto';

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

    create( createCarDto: CreateCarDto){
        const car: Car = {...createCarDto, id: uuidv4()}
        this.cars.push(car)
        return this.cars;
    }

    update( id: string, updateCarDto: UpdteCarDto ){

        let carDB = this.findOnById(id);

        if ( updateCarDto.id && updateCarDto.id !== id) throw new BadRequestException(`Car->ID is not valid inside body`)

        this.cars = this.cars.map( car => {
            if( car.id === id){
                carDB = {...carDB, ...updateCarDto, id, }
                return carDB
            }

            return car;
        })

        return carDB //carro actualizado

    }
}
