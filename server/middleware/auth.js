// middleware/auth.js
import { clerkClient } from '@clerk/clerk-sdk-node';

export const verifyClerkToken = async (token) => {
  try {
    const session = await clerkClient.verifyToken(token);
    return session;
  } catch (error) {
    throw new Error("Unauthorized");
  }
};
