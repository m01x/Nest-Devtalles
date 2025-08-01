import { Car } from './interfaces';
export declare class CarsService {
    private cars;
    findAll(): Car[];
    findOnById(id: string): Car;
}
