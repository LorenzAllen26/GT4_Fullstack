import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | null = null;

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Copy .env.example to .env and fill it in."
    );
  }

  // If already connected, return existing connection
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (connection === null) {
    connection = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false, // Prevents queries from hanging indefinitely on Vercel
      })
      .then((m) => {
        console.log("MongoDB connected:", m.connection.name);
        return m;
      })
      .catch((err: unknown) => {
        connection = null;
        throw err;
      });
  }

  return connection;
}