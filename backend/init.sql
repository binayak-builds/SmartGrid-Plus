-- SmartGrid+ AI Electricity Billing System
-- Database Initialization Script

CREATE DATABASE IF NOT EXISTS smartgrid;
USE smartgrid;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS automation_rules;
DROP TABLE IF EXISTS energy_assets;
DROP TABLE IF EXISTS ai_predictions;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS usage_history;
DROP TABLE IF EXISTS bill;
DROP TABLE IF EXISTS meter_info;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS tax;
DROP TABLE IF EXISTS login;

-- CORE TABLES

CREATE TABLE login(
  meter_no VARCHAR(20) PRIMARY KEY,
  username VARCHAR(30) UNIQUE,
  name VARCHAR(30),
  password VARCHAR(20),
  user_type VARCHAR(20)
);

CREATE TABLE customer(
  name VARCHAR(20),
  meter_no VARCHAR(20) PRIMARY KEY,
  address VARCHAR(50),
  city VARCHAR(30),
  state VARCHAR(30),
  email VARCHAR(40),
  phone VARCHAR(20),
  FOREIGN KEY (meter_no) REFERENCES login(meter_no)
);

CREATE TABLE tax(
  tax_id INT PRIMARY KEY,
  cost_per_unit INT,
  meter_rent INT,
  service_charge INT,
  service_tax INT,
  fixed_tax INT
);

CREATE TABLE bill(
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  meter_no VARCHAR(20),
  month VARCHAR(20),
  month_index INT DEFAULT 0,
  units INT,
  totalbill INT,
  status VARCHAR(20),
  FOREIGN KEY (meter_no) REFERENCES customer(meter_no)
);

CREATE TABLE meter_info(
  meter_no VARCHAR(20) PRIMARY KEY,
  meter_location VARCHAR(20),
  meter_type VARCHAR(20),
  phase_code VARCHAR(20),
  bill_type VARCHAR(20),
  days INT,
  FOREIGN KEY (meter_no) REFERENCES customer(meter_no)
);

-- ADDITIONAL FEATURE TABLES

CREATE TABLE usage_history(
  id INT AUTO_INCREMENT PRIMARY KEY,
  meter_no VARCHAR(20),
  month VARCHAR(20),
  month_index INT DEFAULT 0,
  units INT
);

CREATE TABLE payments(
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT,
  amount INT,
  payment_date DATE,
  status VARCHAR(20)
);

CREATE TABLE alerts(
  alert_id INT AUTO_INCREMENT PRIMARY KEY,
  meter_no VARCHAR(20),
  message VARCHAR(255),
  severity VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_predictions(
  id INT AUTO_INCREMENT PRIMARY KEY,
  meter_no VARCHAR(20),
  predicted_units INT,
  predicted_bill INT,
  month VARCHAR(20)
);

CREATE TABLE energy_assets(
  asset_id INT AUTO_INCREMENT PRIMARY KEY,
  meter_no VARCHAR(20),
  type VARCHAR(20),
  capacity INT,
  status VARCHAR(20)
);

CREATE TABLE automation_rules(
  rule_id INT AUTO_INCREMENT PRIMARY KEY,
  meter_no VARCHAR(20),
  rule_name VARCHAR(50),
  action VARCHAR(100),
  status VARCHAR(20)
);

-- INSERT DATA

-- LOGIN (10)
INSERT INTO login VALUES
('101','user1','Aman','pass','user'),
('102','user2','Rahul','pass','user'),
('103','user3','Ravi','pass','user'),
('104','user4','Kiran','pass','user'),
('105','user5','Neha','pass','user'),
('106','user6','Priya','pass','user'),
('107','user7','Arjun','pass','user'),
('108','user8','Vikram','pass','user'),
('109','user9','Sneha','pass','user'),
('110','user10','Rohit','pass','user');

-- Add admin user
INSERT INTO login VALUES
('100','admin','Binayak','admin123','admin');

-- CUSTOMER (10 + admin)
INSERT INTO customer VALUES
('Binayak','100','BTM Layout','Bangalore','Karnataka','binayak@smartgrid.io','9876543210'),
('Aman','101','BTM','Bangalore','Karnataka','aman@gmail.com','9999999999'),
('Rahul','102','HSR','Bangalore','Karnataka','rahul@gmail.com','8888888888'),
('Ravi','103','Indiranagar','Bangalore','Karnataka','ravi@gmail.com','7777777777'),
('Kiran','104','Whitefield','Bangalore','Karnataka','kiran@gmail.com','6666666666'),
('Neha','105','MG Road','Bangalore','Karnataka','neha@gmail.com','5555555555'),
('Priya','106','Yelahanka','Bangalore','Karnataka','priya@gmail.com','4444444444'),
('Arjun','107','BTM','Bangalore','Karnataka','arjun@gmail.com','3333333333'),
('Vikram','108','HSR','Bangalore','Karnataka','vikram@gmail.com','2222222222'),
('Sneha','109','Jayanagar','Bangalore','Karnataka','sneha@gmail.com','1111111111'),
('Rohit','110','Hebbal','Bangalore','Karnataka','rohit@gmail.com','0000000000');

-- TAX (10)
INSERT INTO tax VALUES
(1,9,50,20,10,100),
(2,8,40,15,8,90),
(3,10,60,25,12,120),
(4,7,30,10,5,70),
(5,11,65,30,15,140),
(6,6,25,10,4,60),
(7,12,70,35,18,150),
(8,9,55,22,11,110),
(9,10,60,24,12,125),
(10,8,45,18,9,95);

-- METER INFO (10 + admin)
INSERT INTO meter_info VALUES
('100','Indoor','Smart Digital','Three','Commercial',30),
('101','Indoor','Digital','Single','Normal',30),
('102','Outdoor','Analog','Three','Commercial',30),
('103','Indoor','Digital','Single','Normal',30),
('104','Outdoor','Analog','Three','Commercial',30),
('105','Indoor','Digital','Single','Normal',30),
('106','Outdoor','Analog','Three','Commercial',30),
('107','Indoor','Digital','Single','Normal',30),
('108','Outdoor','Analog','Three','Commercial',30),
('109','Indoor','Digital','Single','Normal',30),
('110','Outdoor','Analog','Three','Commercial',30);

-- BILL (multiple months for richer data)
INSERT INTO bill(meter_no,month,units,totalbill,status) VALUES
('101','Jan',120,1080,'paid'),
('102','Jan',200,1800,'paid'),
('103','Jan',90,810,'paid'),
('104','Jan',300,2700,'unpaid'),
('105','Jan',150,1350,'paid'),
('106','Jan',170,1530,'unpaid'),
('107','Jan',110,990,'paid'),
('108','Jan',210,1890,'unpaid'),
('109','Jan',130,1170,'paid'),
('110','Jan',160,1440,'unpaid'),
('101','Feb',135,1215,'paid'),
('102','Feb',180,1620,'paid'),
('103','Feb',100,900,'paid'),
('104','Feb',280,2520,'unpaid'),
('105','Feb',140,1260,'paid'),
('106','Feb',190,1710,'unpaid'),
('107','Feb',125,1125,'paid'),
('108','Feb',200,1800,'unpaid'),
('109','Feb',145,1305,'paid'),
('110','Feb',175,1575,'unpaid');

-- USAGE HISTORY (multiple months)
INSERT INTO usage_history(meter_no,month,units) VALUES
('101','Jan',120),('102','Jan',200),('103','Jan',90),
('104','Jan',300),('105','Jan',150),('106','Jan',170),
('107','Jan',110),('108','Jan',210),('109','Jan',130),('110','Jan',160),
('101','Feb',135),('102','Feb',180),('103','Feb',100),
('104','Feb',280),('105','Feb',140),('106','Feb',190),
('107','Feb',125),('108','Feb',200),('109','Feb',145),('110','Feb',175),
('101','Mar',110),('102','Mar',220),('103','Mar',95),
('104','Mar',310),('105','Mar',160),('106','Mar',155),
('107','Mar',115),('108','Mar',195),('109','Mar',140),('110','Mar',180);

-- PAYMENTS (10)
INSERT INTO payments(bill_id,amount,payment_date,status) VALUES
(1,1080,'2025-01-10','completed'),
(2,1800,'2025-01-11','completed'),
(3,810,'2025-01-12','completed'),
(5,1350,'2025-01-13','completed'),
(7,990,'2025-01-14','completed'),
(9,1170,'2025-01-15','completed'),
(11,1215,'2025-02-10','completed'),
(12,1620,'2025-02-11','completed'),
(13,900,'2025-02-12','completed'),
(15,1260,'2025-02-13','completed');

-- ALERTS (10)
INSERT INTO alerts(meter_no,message,severity) VALUES
('101','High usage detected','high'),
('102','Bill overdue','medium'),
('103','Normal usage','low'),
('104','Power fluctuation','high'),
('105','New bill generated','low'),
('106','Payment reminder','medium'),
('107','Peak usage','high'),
('108','System alert','medium'),
('109','Usage stable','low'),
('110','Maintenance alert','medium');

-- AI PREDICTIONS (10)
INSERT INTO ai_predictions(meter_no,predicted_units,predicted_bill,month) VALUES
('101',200,1800,'Feb'),
('102',250,2250,'Feb'),
('103',120,1080,'Feb'),
('104',320,2880,'Feb'),
('105',180,1620,'Feb'),
('106',190,1710,'Feb'),
('107',140,1260,'Feb'),
('108',260,2340,'Feb'),
('109',150,1350,'Feb'),
('110',170,1530,'Feb');

-- ENERGY ASSETS (10)
INSERT INTO energy_assets(meter_no,type,capacity,status) VALUES
('101','solar',5,'active'),
('102','battery',3,'active'),
('103','solar',4,'active'),
('104','battery',6,'inactive'),
('105','solar',7,'active'),
('106','battery',2,'active'),
('107','solar',5,'active'),
('108','battery',3,'inactive'),
('109','solar',6,'active'),
('110','battery',4,'active');

-- AUTOMATION RULES (10)
INSERT INTO automation_rules(meter_no,rule_name,action,status) VALUES
('101','Peak Saver','Turn off AC','active'),
('102','Night Mode','Reduce load','active'),
('103','Eco Mode','Limit usage','active'),
('104','Auto Cutoff','Shutdown appliances','inactive'),
('105','Savings Mode','Reduce lights','active'),
('106','Battery Backup','Switch source','active'),
('107','Cooling Limit','Limit AC','active'),
('108','Energy Saver','Reduce power','inactive'),
('109','Auto Timer','Turn off devices','active'),
('110','Load Balance','Adjust load','active');
