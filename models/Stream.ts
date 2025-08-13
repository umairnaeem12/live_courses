import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Course from "./Course";

@Entity('Streams')
export default class Stream {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Course, (c) => c.streams, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "courseId" })
  course!: Course;

  @Column({ type: "varchar", nullable: true })
  muxLiveId!: string | null;

  @Column({ type: "varchar", nullable: true })
  playbackId!: string | null;

  @Column({ type: "varchar", nullable: true })
  streamKey!: string | null;

  @Column({ type: "varchar", default: "signed" })
  playbackPolicy!: "signed";
}
