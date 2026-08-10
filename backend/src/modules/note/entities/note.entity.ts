import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../enums/category";
import { User } from "src/modules/user/entities/user.entity";

@Entity()
export class Note {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    title:string;

    @Column("text")
    content:string;

    @Column({type:"enum",enum:Category})
    category:Category;

    @Column("text",{array:true,default:()=>"'{}'"})
    tags:string[]
    
    @Column({type:"boolean",default:false})
    pinned:boolean;
    
    @Column({type:"boolean",default:false}) 
    archived:boolean;
    
    @Column({type:"boolean",default:false})
    favorite:boolean;

    @ManyToOne(()=>User,(user)=>user.notes,{onDelete:"CASCADE"})
    user:User;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;





}
