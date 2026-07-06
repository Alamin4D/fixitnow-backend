import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")})

export default {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,
    jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret-key!",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
    // stripe_price_id : process.env.STRIPE_PRICE_ID!,
    // stripe_secret_key : process.env.STRIPE_SECRET_KEY!,
    // stripe_webhook_secret : process.env.STRIPE_WEBHOOK_SECRET!,
}