import { AppDataSource } from "../data-source";
import User from "../models/User";
import Instructor from "../models/Instructor";
import Course from "../models/Course";
import CourseMaterial from "../models/CourseMaterial";
import Purchase from "../models/Purchase";
import Stream from "../models/Stream";

export const UserRepository = AppDataSource.getRepository(User);
export const InstructorRepository = AppDataSource.getRepository(Instructor);
export const CourseRepository = AppDataSource.getRepository(Course);
export const CourseMaterialRepository = AppDataSource.getRepository(CourseMaterial);
export const PurchaseRepository = AppDataSource.getRepository(Purchase);
export const StreamRepository = AppDataSource.getRepository(Stream);
