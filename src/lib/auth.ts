import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("careconnect");

const productionURL = "https://assignment-8-ten-omega.vercel.app";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || productionURL,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    productionURL,
  ],
});