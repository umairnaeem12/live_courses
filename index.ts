import "dotenv/config";
import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import { AppDataSource } from "./data-source";
import { stripeWebhook } from "./controllers/stripe.webhook";


(async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const app = express();
    app.post("/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhook);

    app.use(
      cors({
        origin: (origin, callback) => {
          callback(null, origin || "*");
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    app.use(express.json());
    app.use(morgan("dev"));

    app.use("/api", routes);

    app.use((err: any, _req: any, res: any, _next: any) => {
      console.error("❌ Server Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });

    const PORT = Number(process.env.PORT) || 3000; // <- use PORT, not DATABASE_PORT
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
