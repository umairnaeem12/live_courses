// src/config/env.ts
import * as dotenv from "dotenv";
dotenv.config();

export const must = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
};
