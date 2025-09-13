import {
    Column, 
    Entity, 
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:   string;

    @Column('text', {
        unique: true,
    })
    title:  string;

    //Forma A
    @Column('numeric',{
        default: 0
    })
    price:  number;

    // Forma B, ambos caminos son lo mism..
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text',{
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock:  number;

    @Column('text',{
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string;

    
    //tags
    //images

}
