USE blogmd;
CREATE TABLE admin(
	username varchar(50) NOT NULL,
    password varchar(100) NOT NULL,
    id int AUTO_INCREMENT PRIMARY KEY
);
INSERT INTO admin (username, password) VALUES ("mustafa", "123456");
