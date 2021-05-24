DELIMITER $$
CREATE TRIGGER update_pts
AFTER INSERT ON Donations
BEGIN
    UPDATE User
    SET points=points+1
    WHERE UserID=:New.UserID;
  
END$$
DELIMITER ;