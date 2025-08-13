import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from "typeorm";
import User from "./User";
import Course from "./Course";

export enum PurchaseStatus {
  PENDING = "pending",
  PAID = "paid",
}

@Entity('Purchases')
@Unique(["userId", "courseId", "providerSessionId"])
@Index(["userId", "courseId"])
export default class Purchase {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Course, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "courseId" })
  course!: Course;

  @Column()
  courseId!: number;

  @Column({ type: "enum", enum: PurchaseStatus, default: PurchaseStatus.PENDING })
  status!: PurchaseStatus;

  @Column({ type: "varchar", nullable: true })
  providerSessionId!: string | null;

  @Column({ type: "varchar", nullable: true })
  providerChargeId!: string | null;
}
