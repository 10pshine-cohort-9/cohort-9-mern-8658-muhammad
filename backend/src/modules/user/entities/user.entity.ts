import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserStatus } from "../enums/useStatus";
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from "@nestjs/common";
import { Note } from "src/modules/note/entities/note.entity";
import { Activity } from "src/modules/activity/entities/activity.entity";


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

    @OneToMany(()=>Note,(notes=>notes.user))
    notes:Note[];

    @OneToMany(()=>Activity,(act=>act.user))
    activities:Activity[];
 

    @BeforeInsert()
    async hashingPassword(){
        try {
            this.passwordHash=await bcrypt.hash(this.passwordHash,10)
        } catch (error) {
            throw new InternalServerErrorException("Failed to hash user password")
        }
    }

}
