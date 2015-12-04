DROP DATABASE digitaldining;
CREATE DATABASE digitaldining;

USE digitaldining;

CREATE TABLE restaurant_users (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  username VARCHAR(20) NOT NULL,
  password CHAR(32) NOT NULL,

  UNIQUE(username)
);

CREATE TABLE restaurants (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_name VARCHAR(40) NOT NULL,
  opening_hour_monday TIME DEFAULT '08:00:00',
  closing_hour_monday TIME DEFAULT '23:00:00',
  opening_hour_tuesday TIME DEFAULT '08:00:00',
  closing_hour_tuesday TIME DEFAULT '23:00:00',
  opening_hour_wednesday TIME DEFAULT '08:00:00',
  closing_hour_wednesday TIME DEFAULT '23:00:00',
  opening_hour_thursday TIME DEFAULT '08:00:00',
  closing_hour_thursday TIME DEFAULT '23:00:00',
  opening_hour_friday TIME DEFAULT '08:00:00',
  closing_hour_friday TIME DEFAULT '23:00:00',
  opening_hour_saturday TIME DEFAULT '08:00:00',
  closing_hour_saturday TIME DEFAULT '23:00:00',
  opening_hour_sunday TIME DEFAULT '08:00:00',
  closing_hour_sunday TIME DEFAULT '23:00:00'
);

CREATE TABLE tables (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  table_number INT NOT NULL,
  seats INT NOT NULL,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id)
);

CREATE TABLE menu_categories (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  category_name VARCHAR(40) NOT NULL
);

CREATE TABLE menu (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  menu_category_id INT NOT NULL,
  title VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price DECIMAL(5,2) NOT NULL,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id),
  FOREIGN KEY (menu_category_id)
    REFERENCES menu_categories(id)
);

CREATE TABLE users (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  username VARCHAR(20) NOT NULL,
  password CHAR(32),
  facebook_id CHAR(32),

  UNIQUE(username)
);

CREATE TABLE credit_cards (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  cc_info CHAR(32),

  FOREIGN KEY (user_id)
    REFERENCES users(id)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < sql-db/schema.sql
 *  to create the database and the tables.*/

