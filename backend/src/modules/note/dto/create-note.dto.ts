import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Category } from "../enums/category";

export class CreateNoteDto {

    @IsString()
    title:string;

    @IsString()
    content:string;

    @IsEnum(Category)
    category:Category;

    @IsBoolean()
    pinned:boolean;

    @IsBoolean()
    archived:boolean;

    @IsBoolean()
    favorite:boolean;
    
    @IsArray()
    @IsOptional()
    @IsString({each:true}) 
    @ArrayUnique()
    tags?:string[];

}
