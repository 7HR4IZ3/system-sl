import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: syncData } = await request.json();

    if (!syncData) {
      return NextResponse.json(
        { error: "No sync data provided" },
        { status: 400 },
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Process offline task completions
    if (syncData.taskCompletions?.length > 0) {
      for (const task of syncData.taskCompletions) {
        await supabase
          .from("tasks")
          .update({ completed: true, completed_at: task.completed_at })
          .eq("id", task.id)
          .eq("user_id", userId);
      }
    }

    // Process offline habit completions
    if (syncData.habitCompletions?.length > 0) {
      for (const habit of syncData.habitCompletions) {
        await supabase
          .from("habit_completions")
          .insert({
            habit_id: habit.habit_id,
            user_id: userId,
            completed_at: habit.completed_at,
          })
          .select();
      }
    }

    // Process offline goal updates
    if (syncData.goalUpdates?.length > 0) {
      for (const goal of syncData.goalUpdates) {
        await supabase
          .from("goals")
          .update({ current_value: goal.current_value })
          .eq("id", goal.id)
          .eq("user_id", userId);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data synchronized successfully",
    });
  } catch (error) {
    console.error("Error synchronizing offline data:", error);
    return NextResponse.json(
      { error: "Failed to synchronize data" },
      { status: 500 },
    );
  }
}
