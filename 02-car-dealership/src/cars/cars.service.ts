import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsService {

    private cars = [
        {
            id:1,
            brand:'Toyota',
            model:'Corolla'
        },
        {
            id:2,
            brand:'Honda',
            model:'Civic'
        },
        {
            id:3,
            brand:'Jeep',
            model:'OwnJeep'
        },

    ];  

    findAll(){
        return this.cars;
    }

    findOnById( id:number ){
        return this.cars.find(car => car.id === id);
    }
}
