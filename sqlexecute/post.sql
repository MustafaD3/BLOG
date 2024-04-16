USE blogmd;
CREATE TABLE post(
	title varchar(255),
	content varchar(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id int AUTO_INCREMENT PRIMARY KEY
);