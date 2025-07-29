export declare class CarsService {
    private cars;
    findAll(): {
        id: number;
        brand: string;
        model: string;
    }[];
    findOnById(id: number): {
        id: number;
        brand: string;
        model: string;
    } | undefined;
}
