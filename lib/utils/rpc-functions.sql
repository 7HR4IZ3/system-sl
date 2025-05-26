-- Function to increment user XP and level
CREATE OR REPLACE FUNCTION increment_user_xp(user_id_param UUID, xp_amount INT)
RETURNS void AS $$
DECLARE
    current_xp INT;
    current_level INT;
    level_up BOOLEAN := false;
    xp_for_next_level INT;
BEGIN
    -- Get current XP and level
    SELECT xp, level INTO current_xp, current_level
    FROM users
    WHERE id = user_id_param;
    
    -- Calculate new XP
    current_xp := current_xp + xp_amount;
    
    -- Calculate XP required for next level
    xp_for_next_level := current_level * 100;
    
    -- Check for level up
    IF current_xp >= xp_for_next_level THEN
        current_level := current_level + 1;
        level_up := true;
    END IF;
    
    -- Update user
    UPDATE users
    SET xp = current_xp, level = current_level
    WHERE id = user_id_param;
    
    -- Add to activity feed if level up
    IF level_up THEN
        INSERT INTO activity_feed(user_id, activity_type, content)
        VALUES (user_id_param, 'level', 'reached Level ' || current_level);
    END IF;
END;
$$ LANGUAGE plpgsql;
