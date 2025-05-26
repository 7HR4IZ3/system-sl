-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON notifications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON notifications FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger function to create notifications for achievements
CREATE OR REPLACE FUNCTION create_achievement_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = TRUE AND (OLD IS NULL OR OLD.completed = FALSE) THEN
    -- Get achievement details
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      related_id
    )
    SELECT 
      NEW.user_id,
      'achievement',
      'Achievement Unlocked!',
      'You earned the "' || a.title || '" achievement and ' || a.xp_reward || ' XP!',
      NEW.achievement_id
    FROM achievements a
    WHERE a.id = NEW.achievement_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for achievement notifications
DROP TRIGGER IF EXISTS achievement_notification_trigger ON user_achievements;
CREATE TRIGGER achievement_notification_trigger
AFTER INSERT OR UPDATE ON user_achievements
FOR EACH ROW
EXECUTE FUNCTION create_achievement_notification();

-- Create trigger function to create notifications for friend requests
CREATE OR REPLACE FUNCTION create_friend_request_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    -- Get user details
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      related_id
    )
    SELECT 
      NEW.friend_id,
      'friend_request',
      'New Friend Request',
      u.username || ' wants to be your friend',
      NEW.id
    FROM users u
    WHERE u.id = NEW.user_id;
  ELSIF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Notify the requester that their request was accepted
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      related_id
    )
    SELECT 
      NEW.user_id,
      'friend_accepted',
      'Friend Request Accepted',
      u.username || ' accepted your friend request',
      NEW.id
    FROM users u
    WHERE u.id = NEW.friend_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for friend request notifications
DROP TRIGGER IF EXISTS friend_request_notification_trigger ON friends;
CREATE TRIGGER friend_request_notification_trigger
AFTER INSERT OR UPDATE ON friends
FOR EACH ROW
EXECUTE FUNCTION create_friend_request_notification();

-- Create trigger function to create notifications for level ups
CREATE OR REPLACE FUNCTION create_level_up_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.level > OLD.level THEN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      related_id
    ) VALUES (
      NEW.id,
      'level_up',
      'Level Up!',
      'Congratulations! You reached level ' || NEW.level,
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for level up notifications
DROP TRIGGER IF EXISTS level_up_notification_trigger ON users;
CREATE TRIGGER level_up_notification_trigger
AFTER UPDATE ON users
FOR EACH ROW
WHEN (NEW.level > OLD.level)
EXECUTE FUNCTION create_level_up_notification();
