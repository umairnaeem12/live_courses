import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn, Index,
    OneToOne
} from "typeorm";
import { UserRole } from "../enums/UserRole.enum";
import Instructor from "./Instructor";

@Entity("Users")
export default class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 120 })
    name!: string;

    @Index({ unique: true })
    @Column({ length: 180 })
    email!: string;

    @Column({ name: "password_hash", select: false })
    passwordHash!: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
    role!: UserRole;

    @OneToOne(() => Instructor, (i) => i.user, { nullable: true })
    instructor?: Instructor | null;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
