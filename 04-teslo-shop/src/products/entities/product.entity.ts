import {
    BeforeInsert,
    BeforeUpdate,
    Column, 
    Entity, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { ProductImage } from "./";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:   string;

    @Column('text', {
        unique: true,
    })
    title:  string;

    //Forma A
    @Column('float',{
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

    
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[]

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User


    @OneToMany(
        ()=> ProductImage,                              //Entidad o tabla a relacionar
        ( productImage ) => productImage.product,       //Relacion de campos
        { cascade:  true, eager: true }                 //Eager funciona tipo "inner join", leftJoin, etc
    )
    images?:    ProductImage[];

    @BeforeInsert()
    checkSlugInsert() {

        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

}
