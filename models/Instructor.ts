import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import User from "./User";
import Course from "./Course";

@Entity('Instructors')
export default class Instructor {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User, (u) => u.instructor, {
        eager: true,
        onDelete: "CASCADE",
        nullable: false,
    })
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column({ length: 120 })
    displayName!: string;

    @OneToMany(() => Course, (c) => c.instructor, { cascade: false })
    courses!: Course[];
}
