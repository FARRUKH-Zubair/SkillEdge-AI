import { auth } from "@clerk/nextjs";
import { db } from "./prisma";

export const checkUser = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (loggedInUser) {
      return {
        ...loggedInUser,
        hasCompletedProfile: !!loggedInUser.industry && !!loggedInUser.skills
      };
    }

    // If user doesn't exist in our database, we'll create them
    // Note: You might want to fetch user details from Clerk's API here
    const newUser = await db.user.create({
      data: {
        clerkUserId: userId,
        name: "New User", // You might want to fetch this from Clerk
        imageUrl: "", // You might want to fetch this from Clerk
        email: "", // You might want to fetch this from Clerk
      },
    });

    return {
      ...newUser,
      hasCompletedProfile: false
    };
  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
};