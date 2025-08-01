import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';

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

    @Post()
    createCar( @Body() body: any){
        return body
    }

    @Patch(':id')
    updateCar( @Param('id', ParseUUIDPipe) id:string, @Body() body: any){
        return body
    }

    @Delete(':id')
    deleteCar( @Param('id', ParseUUIDPipe) id:string ){
        return {
            method: 'delete',
            id
        }
    }
}
