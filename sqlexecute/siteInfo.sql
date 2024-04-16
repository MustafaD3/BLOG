USE blogmd;
CREATE TABLE siteinfo(
	name varchar(255),
    port int,
    clickCount int,
    extension varchar(30),
    HTTPS boolean,
    id int AUTO_INCREMENT PRIMARY KEY
);
INSERT INTO siteinfo(name,port,clickCount,extension,HTTPS) VALUES ("mustafadalkilic",4000,0,".org",0);