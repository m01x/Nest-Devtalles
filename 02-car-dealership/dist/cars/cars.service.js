"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let CarsService = class CarsService {
    cars = [
        {
            id: (0, uuid_1.v4)(),
            brand: 'Toyota',
            model: 'Corolla'
        },
        {
            id: (0, uuid_1.v4)(),
            brand: 'Honda',
            model: 'Civic'
        },
        {
            id: (0, uuid_1.v4)(),
            brand: 'Jeep',
            model: 'OwnJeep'
        },
    ];
    findAll() {
        return this.cars;
    }
    findOnById(id) {
        const car = this.cars.find(car => car.id === id);
        if (!car)
            throw new common_1.NotFoundException(`Car with id ${id} not found.`);
        return car;
    }
};
exports.CarsService = CarsService;
exports.CarsService = CarsService = __decorate([
    (0, common_1.Injectable)()
], CarsService);
//# sourceMappingURL=cars.service.js.map