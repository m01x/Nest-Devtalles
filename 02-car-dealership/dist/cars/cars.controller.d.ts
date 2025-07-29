import { CarsService } from './cars.service';
export declare class CarsController {
    private readonly carsService;
    constructor(carsService: CarsService);
    getAllCars(): {
        id: number;
        brand: string;
        model: string;
    }[];
    getCarById(id: string): {
        id: number;
        brand: string;
        model: string;
    } | undefined;
}
