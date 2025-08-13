// src/models/CourseMaterial.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Course from "./Course";
import { MaterialKind } from "../enums/MaterialKind.enum";

@Entity("CourseMaterials")
export default class CourseMaterial {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Course, (c) => c.materials, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "courseId" })
  course!: Course;

  @Column()
  s3Key!: string;

  @Column({ type: "enum", enum: MaterialKind })
  kind!: MaterialKind;

  // 🔽 add these to match controller usage
  @Column({ nullable: true })
  originalName?: string;

  @Column({ nullable: true })
  contentType?: string;
}
