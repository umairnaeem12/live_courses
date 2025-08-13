import { z } from "zod";
import { MaterialKind } from "../enums/MaterialKind.enum";

export const uploadUrlSchema = z.object({
    courseId: z.number().int(),
    fileName: z.string().min(1),
    contentType: z.string().min(1),
    kind: z.nativeEnum(MaterialKind),
});
export type UploadUrlInput = z.infer<typeof uploadUrlSchema>;

export const downloadUrlSchema = z.object({
    courseId: z.number().int(),
    materialId: z.number().int()
});
export type DownloadUrlInput = z.infer<typeof downloadUrlSchema>;
