import {
    BeforeInsert,
    BeforeUpdate,
    Column, 
    Entity, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductImage } from "./";
import { User } from "src/auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example:'03d4c331-7f6f-467a-acf4-ba25309350f1',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:   string;

    @ApiProperty({
        example:'T-shirt teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title:  string;

    @ApiProperty({
        example:0,
        description: 'Product price',
    })
    //Forma A
    @Column('float',{
        default: 0
    })
    price:  number;

    // Forma B, ambos caminos son lo mism..
    @ApiProperty({
        example:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example:'T_shirt_teslo',
        description: 'Product slug - for SEO',
        default: null,
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    slug: string;

    @ApiProperty({
        example:10,
        description: 'Product Stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock:  number;

    @ApiProperty({
        example:['M', 'XL', 'S'],
        description: 'Product Sizes'
    })
    @Column('text',{
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example:'women',
        description: 'Product gender type cloth.'
    })
    @Column('text')
    gender: string;

    
    @ApiProperty()
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
    
    
    @ApiProperty()
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
