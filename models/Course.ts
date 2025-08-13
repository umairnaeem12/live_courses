import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import Instructor from "./Instructor";
import CourseMaterial from "./CourseMaterial";
import Stream from "./Stream";

@Entity('Courses')
export default class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Instructor, (i) => i.courses, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "instructorId" })
  instructor!: Instructor;

  @Column({ length: 160 })
  title!: string;

  @Column({ type: "int" })
  priceCents!: number;

  @OneToMany(() => CourseMaterial, (m) => m.course, { cascade: false })
  materials!: CourseMaterial[];

  @OneToMany(() => Stream, (s) => s.course, { cascade: false })
  streams!: Stream[];
}
