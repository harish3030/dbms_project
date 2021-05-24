DROP PROCEDURE IF EXISTS SERVE_REG;
DELIMITER $$
CREATE PROCEDURE SERVE_REG(IN bbid int,OUT req int)
BEGIN  
    DECLARE l_uid INT;
    DECLARE l_rid INT;
    DECLARE l_bid INT;
    DECLARE l_unit_part INT;
    DECLARE l_type varchar(20);
    DECLARE l_comp varchar(20);
    DECLARE l_units INT;
    DECLARE l_count INT DEFAULT 0;
    DECLARE tot_units INT;
    DECLARE data_obj JSON;
    DECLARE FLAG1 INT DEFAULT 0;
    DECLARE FLAG2 INT DEFAULT 0; 
    DECLARE c1 CURSOR FOR SELECT RequestID FROM REQUESTS WHERE BloodbankID=bbid;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET FLAG1 = 1;
    OPEN c1; 
    
    blood_loop:LOOP
        FETCH c1 into l_rid;
        IF FLAG1 THEN 
            CLOSE c1;
            SET FLAG1=0;
            LEAVE blood_loop;
        END IF;
        SELECT UserID,blood_type,blood_component,Units INTO l_uid,l_type,l_comp,l_units FROM Requests WHERE RequestID=l_rid; 
        SELECT U_AVAIL(bbid,l_type,l_comp) INTO data_obj;
        SELECT JSON_EXTRACT(data_obj,'$.Units') INTO tot_units;
        IF tot_units < l_units THEN
            INSERT INTO TRANSACTIONS(RequestID,BloodBankID,blood_type,blood_component,blood_units,date_sent) VALUES
            (l_rid,bbid,l_type,l_comp,l_units,NOW());
        END IF;

        block1:BEGIN
        DECLARE blood_unit CURSOR FOR Select BloodID,blood_units FROM Blood b INNER JOIN Donations d USING(DonationID) WHERE b.blood_group=l_type AND b.blood_component=l_comp AND d.BloodbankID=bbid ORDER BY b.blood_units desc;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET FLAG2 = 1;
        OPEN blood_unit;

        blood_loop2:LOOP    
            FETCH blood_unit into l_bid,l_unit_part;
            IF FLAG2 THEN
                IF l_units = 0 THEN
                UPDATE Requests SET status="Done" WHERE RequestID=l_rid;
                SET l_count=l_count+1;
                LEAVE blood_loop2;
                END IF; 
                CLOSE blood_unit;
                SET FLAG2=0;
                LEAVE blood_loop2;
            END IF;
            IF l_unit_part > l_units THEN 
                SET l_unit_part=l_unit_part-l_units;
                UPDATE Blood SET blood_units=l_unit_part WHERE BloodID=l_bid;
                UPDATE Requests SET status="Done" WHERE RequestID=l_rid;
                SET l_count=l_count+1;
                LEAVE blood_loop2;
            END IF;
            SET l_units=l_units - l_unit_part;
            DELETE FROM Blood WHERE BloodID=l_bid;
        END LOOP blood_loop2;
        IF l_units > 0 THEN 
            UPDATE Requests SET Units=l_units WHERE RequestID=l_rid;
        END IF;
        END block1;
    
    END LOOP blood_loop;
    SET req=l_count;
END$$
DELIMITER ;    
