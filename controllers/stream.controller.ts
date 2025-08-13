import { Request, Response, NextFunction } from "express";
import { StreamRepository } from "../repositories";
import { muxSignedPlaybackUrl } from "../utils/mux";

export const getSignedPlayback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = Number(req.params.courseId);
    const stream = await StreamRepository.findOne({
      where: { course: { id: courseId } },
      relations: ["course"],
    });
    if (!stream?.playbackId) return res.status(404).json({ message: "Stream not found" });
    return res.json(muxSignedPlaybackUrl(stream.playbackId, 600));
  } catch (e) { next(e); }
};

export * as StreamController from "./stream.controller";
