import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserStatus } from "../enums/useStatus";
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from "@nestjs/common";


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @Column()
    passwordHash:string;

    @Column({nullable:true,type:"text"})
    hashRefreshToken?:string | null;

    @Column({type:"enum",default:UserStatus.ACTIVE,enum:UserStatus})
    status:UserStatus

    @Column({nullable:true})
    bio?:string

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date



    @BeforeInsert()
    async hashingPassword(){
        try {
            this.passwordHash=await bcrypt.hash(this.passwordHash,10)
        } catch (error) {
            throw new InternalServerErrorException("Failed to hash user password")
        }
    }

}
