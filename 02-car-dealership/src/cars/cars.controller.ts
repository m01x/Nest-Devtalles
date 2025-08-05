import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdteCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {

    constructor(
        private readonly carsService: CarsService
    ){}

    @Get()
    getAllCars(){
        return this.carsService.findAll();
    }

    @Get(':id')
    getCarById( @Param('id', ParseUUIDPipe) id: string ){ //Aqui usamos nuestro primer pipe para transformar id en numero
        return this.carsService.findOnById(id)
    }

    //...sigamos creando el CRUD?


    // una DTO es una clase , Data transfer Object.
    //El DTO formaliza como voy a mover la data por mi app...
    @Post()
    //@UsePipes( ValidationPipe ) <-- Lo migramos a nivel global de aplicacion
    createCar( @Body() createCarDto: CreateCarDto){
        return this.carsService.create( createCarDto );
    }

    @Patch(':id')
    updateCar( @Param('id', ParseUUIDPipe) id:string, @Body() updateCarDto: UpdteCarDto){

        return this.carsService.update(id, updateCarDto);
    }

    @Delete(':id')
    deleteCar( @Param('id', ParseUUIDPipe) id:string ){
        return {
            method: 'delete',
            id
        }
    }
}
