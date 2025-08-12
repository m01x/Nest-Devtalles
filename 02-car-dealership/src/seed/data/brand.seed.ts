import { v4 as uuidv4 } from 'uuid';
import { Brand } from 'src/brands/entities/brand.entity';

export const BRANDS_SEED: Brand[] = [
    {
        id: uuidv4(),
        name: 'Toyota',
        createdAt: new Date().getTime()
    },
    {
        id: uuidv4(),
        name: 'Honda',
        createdAt: new Date().getTime()
    },
    {
        id: uuidv4(),
        name: 'Ford',
        createdAt: new Date().getTime()
    },
    {
        id: uuidv4(),
        name: 'Chevrolet',
        createdAt: new Date().getTime()
    },
    {
        id: uuidv4(),
        name: 'Nissan',
        createdAt: new Date().getTime()
    },
];
