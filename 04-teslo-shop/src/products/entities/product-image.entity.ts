import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from ".";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id:     number;

    @Column('text')
    url:    string;

    @ManyToOne(
        ()=> Product, //tabla o entidad a relaiconar
        ( product ) => product.images, //relacion de campos.
        { onDelete: 'CASCADE'}
    )
    product: Product;
}