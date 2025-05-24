import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper function to get a safe user ID
async function getSafeUserId() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    // Clean up userId to ensure it's safe for DB
    return userId.replace(/[^a-zA-Z0-9_-]/g, '');
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

// GET: Fetch user profile data
export async function GET() {
  try {
    const userId = await getSafeUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check for the profiles table
    const { error: tableError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      // Table doesn't exist
      return NextResponse.json({
        error: "Profiles table not set up. Please run the setup script.",
        code: "TABLE_NOT_FOUND"
      }, { status: 500 });
    }

    console.log("Fetching profile for user:", userId);

    // Get profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }

    if (data) {
      console.log("Profile found:", data);
      return NextResponse.json(data);
    } else {
      // No profile found, but table exists
      console.log("No profile found for user:", userId);
      return NextResponse.json({
        error: "Profile not found",
        initialized: false
      }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return NextResponse.json(
      { error: error.message || "Error fetching profile data" },
      { status: 500 }
    );
  }
}

// PUT: Update user profile
export async function PUT(request) {
  try {
    const userId = await getSafeUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    console.log("Updating profile for user:", userId, data);

    // Check if table exists
    const { error: tableError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      // Table doesn't exist
      return NextResponse.json({
        error: "Profiles table not set up. Please run the setup script.",
        code: "TABLE_NOT_FOUND"
      }, { status: 500 });
    }

    // Format the data for the Supabase profiles table
    const profileData = {
      first_name: data.firstName || "",
      last_name: data.lastName || "",
      industry: data.industry || "",
      bio: data.bio || "",
      experience: parseInt(data.experience) || 0,
      skills: Array.isArray(data.skills) ? data.skills : [],
      position: data.position || "",
      updated_at: new Date().toISOString(),
    };

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    let result;

    if (existingProfile) {
      console.log("Updating existing profile");
      // Update existing profile
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      result = updatedProfile;
    } else {
      console.log("Creating new profile");
      // Create new profile
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({ ...profileData, user_id: userId })
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }
      result = newProfile;
    }

    return NextResponse.json({
      success: true,
      profile: result,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return NextResponse.json(
      { error: error.message || "Error updating profile" },
      { status: 500 }
    );
  }
} 