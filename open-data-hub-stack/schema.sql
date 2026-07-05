CREATE DATABASE IF NOT EXISTS open_data_hub;
USE open_data_hub;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS datasets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(220) NOT NULL,
  description TEXT NOT NULL,
  domain VARCHAR(80) NOT NULL,
  format VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  state VARCHAR(80) NOT NULL,
  source VARCHAR(140) NOT NULL,
  file_size VARCHAR(40) NOT NULL,
  download_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS downloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dataset_id INT NOT NULL,
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
);

INSERT INTO datasets
  (name, description, domain, format, year, state, source, file_size, download_url)
VALUES
  ('National Air Quality Index by City', 'Daily AQI readings for major Indian cities.', 'Pollution', 'CSV', 2025, 'All India', 'CPCB', '18 MB', '#'),
  ('NFHS District Health Indicators', 'Health, nutrition, sanitation, and household indicators.', 'Health', 'XLSX', 2024, 'All India', 'NFHS', '42 MB', '#'),
  ('School Infrastructure and Enrollment', 'School facilities, enrollment, and literacy signals.', 'Education', 'JSON', 2025, 'Karnataka', 'data.gov.in', '9 MB', '#');

