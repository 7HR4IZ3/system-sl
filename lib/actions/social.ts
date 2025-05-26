"use server";

import { createServerActionClient } from "@/lib/supabase/server";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Get user's friends
export async function getUserFriends() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Get friends where current user is either the user_id or friend_id
  const { data: friendsAsUser, error: error1 } = await supabase
    .from("friends")
    .select(
      `
      id,
      friend:friend_id(
        id,
        username,
        avatar_url,
        full_name,
        level
      )
    `
    )
    .eq("user_id", session.user.id)
    .eq("status", "accepted");

  const { data: friendsAsFriend, error: error2 } = await supabase
    .from("friends")
    .select(
      `
      id,
      user:user_id(
        id,
        username,
        avatar_url,
        full_name,
        level
      )
    `
    )
    .eq("friend_id", session.user.id)
    .eq("status", "accepted");

  if (error1 || error2) {
    console.error("Error fetching friends:", error1 || error2);
    throw new Error((error1 || error2)?.message || "Unknown error");
  }

  // Format the data to have consistent structure
  const formattedFriends = [
    ...(friendsAsUser || []).map((f) => ({
      id: f.id,
      friend: f.friend,
    })),
    ...(friendsAsFriend || []).map((f) => ({
      id: f.id,
      friend: f.user,
    })),
  ];

  return formattedFriends;
}

// Get friend requests
export async function getFriendRequests() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("friends")
    .select(
      `
      id,
      user:user_id(
        id,
        username,
        avatar_url,
        full_name
      )
    `
    )
    .eq("friend_id", session.user.id)
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching friend requests:", error);
    throw new Error(error.message);
  }

  return data;
}

// Send friend request
export async function sendFriendRequest(friendId: string) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Don't allow sending request to self
  if (friendId === session.user.id) {
    throw new Error("You cannot send a friend request to yourself.");
  }

  // Check if friendship already exists
  const { data: existingFriendship } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
    .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
    .single();

  if (existingFriendship) {
    throw new Error("A friend request already exists between these users.");
  }

  // Create friend request
  const { error } = await supabase.from("friends").insert({
    user_id: session.user.id,
    friend_id: friendId,
    status: "pending",
  });

  if (error) {
    console.error("Error sending friend request:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/social");
  return { success: true };
}

// Accept friend request
export async function acceptFriendRequest(requestId: string) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Verify that the request is addressed to the current user
  const { data: friendRequest } = await supabase
    .from("friends")
    .select("*")
    .eq("id", requestId)
    .eq("friend_id", session.user.id)
    .single();

  if (!friendRequest) {
    throw new Error("Friend request not found or not addressed to you.");
  }

  // Update request status
  const { error } = await supabase
    .from("friends")
    .update({ status: "accepted" })
    .eq("id", requestId);

  if (error) {
    console.error("Error accepting friend request:", error);
    throw new Error(error.message);
  }

  // Add activity to feed
  const { error: activityError } = await supabase.from("activity_feed").insert([
    {
      user_id: session.user.id,
      activity_type: "friend",
      content: `became friends with ${friendRequest.user_id}`,
      related_id: friendRequest.user_id,
    },
    {
      user_id: friendRequest.user_id,
      activity_type: "friend",
      content: `became friends with ${session.user.id}`,
      related_id: session.user.id,
    },
  ]);

  if (activityError) {
    console.error("Error adding to activity feed:", activityError);
    throw new Error(activityError.message);
  }

  // revalidatePath("/social");
  return { success: true };
}

// Reject friend request
export async function rejectFriendRequest(requestId: string) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Delete the request
  const { error } = await supabase
    .from("friends")
    .delete()
    .eq("id", requestId)
    .eq("friend_id", session.user.id);

  if (error) {
    console.error("Error rejecting friend request:", error);
    throw new Error(error.message);
  }

  // revalidatePath("/social");
  return { success: true };
}

// Get suggested friends (users who are not friends)
export async function getSuggestedFriends(limit = 5) {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Get current friends
  const { data: currentFriends } = await supabase
    .from("friends")
    .select("user_id, friend_id")
    .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`);

  // Extract friend IDs
  const friendIds = new Set(
    (currentFriends || []).flatMap((friend) => [
      friend.user_id,
      friend.friend_id,
    ])
  );

  // Remove the current user from the friend IDs
  friendIds.add(session.user.id);

  // Get users who are not friends
  const { data: users, error } = await supabase
    .from("users")
    .select("id, username, avatar_url, full_name")
    .not("id", "in", `(${Array.from(friendIds).join(",")})`)
    .limit(limit);

  if (error) {
    console.error("Error fetching suggested friends:", error);
    throw new Error(error.message);
  }

  return users;
}

// Get activity feed
export async function getActivityFeed() {
  const supabase = await createServerActionClient({ cookies });

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Get the activity feed for current user and friends
  const { data: friends } = await supabase
    .from("friends")
    .select("user_id, friend_id")
    .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
    .eq("status", "accepted");

  // Extract friend IDs
  const friendIds = new Set(
    (friends || []).flatMap((friend) => [friend.user_id, friend.friend_id])
  );

  // Remove the current user from the friend IDs set and add back as an array item
  friendIds.delete(session.user.id);
  const userIdsArray = [session.user.id, ...Array.from(friendIds)];

  // Get activities
  const { data, error } = await supabase
    .from("activity_feed")
    .select(
      `
      *,
      user:user_id(
        id,
        username,
        avatar_url,
        full_name
      )
    `
    )
    .in("user_id", userIdsArray)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching activity feed:", error);
    throw new Error(error.message);
  }

  return data;
}
