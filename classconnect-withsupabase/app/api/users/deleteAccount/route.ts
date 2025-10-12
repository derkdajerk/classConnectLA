import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const supabaseAdmin = await createAdminClient();

    // 1. Delete user's scheduled classes
    const { error: scheduleError } = await supabaseAdmin
      .from("user_schedule")
      .delete()
      .eq("user_id", userId);

    if (scheduleError) {
      console.error("Error deleting user schedule:", scheduleError);
      // Continue anyway - don't fail the whole operation
    }

    // 2. Delete user's bookmarked classes
    const { error: bookmarksError } = await supabaseAdmin
      .from("user_bookmarks")
      .delete()
      .eq("user_id", userId);

    if (bookmarksError) {
      console.error("Error deleting user bookmarks:", bookmarksError);
      // Continue anyway - don't fail the whole operation
    }

    // 3. Delete the auth user (this will cascade delete any other user-related data)
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("User and associated data deleted successfully:", data);

    return NextResponse.json(
      { message: "User and all associated data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error during account deletion:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
