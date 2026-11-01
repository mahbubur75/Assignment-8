import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

const db = client.db("careconnect");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // Google Login
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },

    additionalFields: {
      image: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  trustedOrigins: [
    "http://localhost:3000",
  ],
});