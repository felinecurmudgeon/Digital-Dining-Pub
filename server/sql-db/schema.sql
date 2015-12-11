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
  restaurant_owner_id INT NOT NULL,
  restaurant_address VARCHAR(255) NOT NULL,
  restaurant_city VARCHAR(40) NOT NULL,
  restaurant_state VARCHAR(40) NOT NULL,
  restaurant_zip_code INT NOT NULL,
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
  closing_hour_sunday TIME DEFAULT '23:00:00',

  FOREIGN KEY (restaurant_owner_id)
    REFERENCES restaurant_users(id)
);

CREATE TABLE restaurant_employees (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  restaurant_user_id INT NOT NULL,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id),
  FOREIGN KEY (restaurant_user_id)
    REFERENCES restaurant_users(id)  
);

CREATE TABLE tables (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  table_number INT NOT NULL,
  seats INT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id)
);

CREATE TABLE menu_categories (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  category_name VARCHAR(40) NOT NULL,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id)
);

CREATE TABLE menu_items (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  menu_category_id INT,
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
  password CHAR(60),
  facebook_id CHAR(32),
  stripe_id VARCHAR(100),

  UNIQUE(username)
);

CREATE TABLE payment_info (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  payment_info CHAR(32),

  FOREIGN KEY (user_id)
    REFERENCES users(id)
);

CREATE TABLE parties (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  restaurant_id INT NOT NULL,
  table_id INT,
  party_size INT NOT NULL,
  checkedin_at TIMESTAMP,
  seated_at TIMESTAMP,
  closed_at TIMESTAMP,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id),
  FOREIGN KEY (table_id)
    REFERENCES tables(id)
);

CREATE TABLE menu_items_ordered (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  party_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_paid INT NOT NULL DEFAULT 0,
  ordered_at TIMESTAMP,
  served_at TIMESTAMP,
  paid_at TIMESTAMP,
  canceled_at TIMESTAMP,

  FOREIGN KEY (menu_item_id)
    REFERENCES menu_items(id),
  FOREIGN KEY (party_id)
    REFERENCES parties(id)
);

CREATE TABLE party_participants (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  party_id INT NOT NULL,
  user_id INT NOT NULL,

  FOREIGN KEY (party_id)
    REFERENCES parties(id),
  FOREIGN KEY (user_id)
    REFERENCES users(id)  
);

CREATE TABLE payments (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  menu_item_ordered_id INT NOT NULL,
  user_id INT NOT NULL,
  amount INT,

  FOREIGN KEY (menu_item_ordered_id)
    REFERENCES menu_items_ordered(id),
  FOREIGN KEY (user_id)
    REFERENCES users(id)  
);

/*  Execute this file from the command line by typing:
 *    mysql -u root -p < server/sql-db/schema.sql
 *  to create the database and the tables.*/

