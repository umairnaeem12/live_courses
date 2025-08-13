import { UserRole } from "../enums/UserRole.enum";
import { UserRepository, CourseRepository, InstructorRepository, PurchaseRepository } from "../repositories";
import { CreateCourseInput } from "../validators/course.validation";

export async function createCourseService(input: CreateCourseInput) {

    const user = await UserRepository.findOne({
        where: { id: input.userId },
        relations: ["instructor"],
    });
    if (!user) throw new Error("User not found");
    if (user.role !== UserRole.INSTRUCTOR) throw new Error("Only instructors can create courses");

    let instructor = user.instructor;
    if (!instructor) {
        instructor = InstructorRepository.create({ user });
        await InstructorRepository.save(instructor);
    }

    const course = CourseRepository.create({
        title: input.title,
        priceCents: input.priceCents,
        instructor,
    });
    return await CourseRepository.save(course);
}

export async function getCourseService(id: number, userId?: number) {
    const course = await CourseRepository.findOne({
        where: { id },
        relations: ["instructor", "instructor.user"],
    });
    if (!course) throw new Error("Course not found");

    let purchaseStatus: string | null = null;
    if (userId) {
        const purchase = await PurchaseRepository.findOne({
            where: { courseId: id, userId },
        });
        purchaseStatus = purchase?.status || null;
    }

    return { ...course, purchaseStatus };
}

export async function getAllCoursesService() {
    const courses = await CourseRepository.find({
        relations: ["instructor", "instructor.user"],
    });
    return courses;
}

export * as CourseService from "./course.service";