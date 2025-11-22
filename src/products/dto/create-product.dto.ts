import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';


export class CreateProductDto {

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product title',
        uniqueItems: true,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 'T-shirt Designed to celebrate Teslas incredible performance mode',
        description: 'Product description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 'T-shirmen_plaid_mode_teet Teslo',
        description: 'Product slug - for SEO',
        uniqueItems: true,
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    }) 
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number; 

    @ApiProperty({
        example: [ 'XS','S','M'],
        description: 'Product sizes',
        default: 0
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    @ApiProperty({
        example: 'men',
        description: 'Product gender',
        default: 0
    })
    @IsString()
    @IsIn(['men','women','kid','unisex'])
    gender: string;

    @ApiProperty({
        example: [ 'shirt','clothes','teslo' ],
        description: 'Product tags',
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[]; 

    @ApiProperty({
        example: [ 'http://example.com/image1.jpg', 'http://example.com/image2.jpg' ],
        description: 'Product images',
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[]; 

}