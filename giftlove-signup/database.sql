-- Run this in SiteGround's phpMyAdmin to set up your database
-- Go to: cPanel → phpMyAdmin → select your database → SQL tab → paste and run

CREATE TABLE IF NOT EXISTS signups (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  ip_address    VARCHAR(45)   DEFAULT NULL,
  signed_up_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);
