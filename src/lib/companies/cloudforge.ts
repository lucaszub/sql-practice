import type { CompanyProfile } from "./types";

const schema = `
CREATE TABLE raw_events (
  event_id INTEGER PRIMARY KEY,
  source VARCHAR NOT NULL,
  event_type VARCHAR NOT NULL,
  payload VARCHAR,
  event_timestamp TIMESTAMP NOT NULL,
  ingestion_date DATE NOT NULL,
  is_valid BOOLEAN
);

CREATE TABLE staging_users (
  staging_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  email VARCHAR NOT NULL,
  full_name VARCHAR,
  country VARCHAR,
  created_at DATE NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  load_date DATE NOT NULL
);

CREATE TABLE dim_customer (
  customer_key INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  customer_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  country VARCHAR,
  segment VARCHAR NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE,
  is_current BOOLEAN NOT NULL
);

CREATE TABLE dim_date (
  date_key INTEGER PRIMARY KEY,
  full_date DATE NOT NULL,
  day_of_week VARCHAR NOT NULL,
  month_num INTEGER NOT NULL,
  month_name VARCHAR NOT NULL,
  quarter INTEGER NOT NULL,
  year INTEGER NOT NULL
);

CREATE TABLE fact_events (
  fact_id INTEGER PRIMARY KEY,
  event_date_key INTEGER NOT NULL REFERENCES dim_date(date_key),
  customer_key INTEGER NOT NULL REFERENCES dim_customer(customer_key),
  event_type VARCHAR NOT NULL,
  event_count INTEGER NOT NULL,
  revenue DECIMAL(10,2),
  processing_time_ms INTEGER NOT NULL
);

CREATE TABLE data_quality_logs (
  log_id INTEGER PRIMARY KEY,
  table_name VARCHAR NOT NULL,
  check_name VARCHAR NOT NULL,
  check_type VARCHAR NOT NULL,
  result VARCHAR NOT NULL,
  records_checked INTEGER NOT NULL,
  records_failed INTEGER NOT NULL,
  check_date DATE NOT NULL,
  run_by VARCHAR NOT NULL
);

-- raw_events (50 rows)
INSERT INTO raw_events VALUES
  (1, 'web_app', 'page_view', '{"page": "/home", "user_id": 101}', '2024-01-15 08:30:00', '2024-01-15', true),
  (2, 'web_app', 'page_view', '{"page": "/pricing", "user_id": 102}', '2024-01-15 09:15:00', '2024-01-15', true),
  (3, 'mobile_app', 'click', '{"button": "signup", "user_id": 103}', '2024-01-15 10:00:00', '2024-01-15', true),
  (4, 'web_app', 'purchase', '{"amount": 99.00, "user_id": 101}', '2024-01-16 11:20:00', '2024-01-16', true),
  (5, 'api', 'webhook', '{"event": "payment_success", "ref": "PAY-001"}', '2024-01-16 11:25:00', '2024-01-16', true),
  (6, 'mobile_app', 'page_view', '{"page": "/dashboard", "user_id": 104}', '2024-01-17 14:00:00', '2024-01-17', true),
  (7, 'web_app', 'click', '{"button": "download", "user_id": 102}', '2024-01-17 15:30:00', '2024-01-17', true),
  (8, 'web_app', 'page_view', NULL, '2024-01-18 08:00:00', '2024-01-18', false),
  (9, 'mobile_app', 'purchase', '{"amount": 49.00, "user_id": 105}', '2024-01-18 09:45:00', '2024-01-18', true),
  (10, 'api', 'webhook', NULL, '2024-01-18 10:00:00', '2024-01-18', false),
  (11, 'web_app', 'page_view', '{"page": "/docs", "user_id": 106}', '2024-02-01 08:10:00', '2024-02-01', true),
  (12, 'web_app', 'click', '{"button": "trial", "user_id": 106}', '2024-02-01 08:15:00', '2024-02-01', true),
  (13, 'mobile_app', 'page_view', '{"page": "/settings", "user_id": 101}', '2024-02-02 10:30:00', '2024-02-02', true),
  (14, 'api', 'webhook', '{"event": "subscription_renewed", "ref": "SUB-042"}', '2024-02-02 12:00:00', '2024-02-02', true),
  (15, 'web_app', 'purchase', '{"amount": 199.00, "user_id": 107}', '2024-02-03 14:20:00', '2024-02-03', true),
  (16, 'web_app', 'page_view', '{"page": "/home", "user_id": 108}', '2024-02-05 09:00:00', '2024-02-05', true),
  (17, 'mobile_app', 'click', NULL, '2024-02-05 09:30:00', '2024-02-05', false),
  (18, 'api', 'webhook', '{"event": "payment_failed", "ref": "PAY-099"}', '2024-02-05 10:00:00', '2024-02-05', true),
  (19, 'web_app', 'page_view', '{"page": "/pricing", "user_id": 109}', '2024-02-10 11:00:00', '2024-02-10', true),
  (20, 'web_app', 'purchase', '{"amount": 99.00, "user_id": 109}', '2024-02-10 11:30:00', '2024-02-10', true),
  (21, 'mobile_app', 'page_view', '{"page": "/home", "user_id": 110}', '2024-03-01 08:00:00', '2024-03-01', true),
  (22, 'web_app', 'click', '{"button": "demo", "user_id": 110}', '2024-03-01 08:30:00', '2024-03-01', true),
  (23, 'web_app', 'page_view', '{"page": "/features", "user_id": 111}', '2024-03-02 09:00:00', '2024-03-02', true),
  (24, 'api', 'webhook', '{"event": "payment_success", "ref": "PAY-102"}', '2024-03-02 09:15:00', '2024-03-02', true),
  (25, 'mobile_app', 'purchase', '{"amount": 149.00, "user_id": 111}', '2024-03-03 10:00:00', '2024-03-03', true),
  (26, 'web_app', 'page_view', NULL, '2024-03-05 14:00:00', '2024-03-05', false),
  (27, 'web_app', 'click', '{"button": "contact", "user_id": 112}', '2024-03-05 14:30:00', '2024-03-05', true),
  (28, 'mobile_app', 'page_view', '{"page": "/pricing", "user_id": 113}', '2024-03-10 11:00:00', '2024-03-10', true),
  (29, 'api', 'webhook', NULL, '2024-03-10 12:00:00', '2024-03-10', false),
  (30, 'web_app', 'purchase', '{"amount": 299.00, "user_id": 112}', '2024-03-12 15:00:00', '2024-03-12', true),
  (31, 'web_app', 'page_view', '{"page": "/home", "user_id": 114}', '2024-04-01 08:00:00', '2024-04-01', true),
  (32, 'mobile_app', 'click', '{"button": "signup", "user_id": 114}', '2024-04-01 08:15:00', '2024-04-01', true),
  (33, 'web_app', 'page_view', '{"page": "/docs", "user_id": 115}', '2024-04-02 09:30:00', '2024-04-02', true),
  (34, 'api', 'webhook', '{"event": "subscription_cancelled", "ref": "SUB-015"}', '2024-04-03 10:00:00', '2024-04-03', true),
  (35, 'web_app', 'purchase', '{"amount": 99.00, "user_id": 115}', '2024-04-05 11:00:00', '2024-04-05', true),
  (36, 'mobile_app', 'page_view', NULL, '2024-04-08 13:00:00', '2024-04-08', false),
  (37, 'web_app', 'click', '{"button": "upgrade", "user_id": 101}', '2024-04-10 14:00:00', '2024-04-10', true),
  (38, 'web_app', 'page_view', '{"page": "/billing", "user_id": 101}', '2024-04-10 14:05:00', '2024-04-10', true),
  (39, 'api', 'webhook', '{"event": "payment_success", "ref": "PAY-150"}', '2024-04-12 09:00:00', '2024-04-12', true),
  (40, 'mobile_app', 'purchase', '{"amount": 49.00, "user_id": 116}', '2024-04-15 16:00:00', '2024-04-15', true),
  (41, 'web_app', 'page_view', '{"page": "/home", "user_id": 117}', '2024-05-01 08:00:00', '2024-05-01', true),
  (42, 'web_app', 'click', '{"button": "trial", "user_id": 117}', '2024-05-01 08:10:00', '2024-05-01', true),
  (43, 'mobile_app', 'page_view', '{"page": "/settings", "user_id": 105}', '2024-05-02 10:00:00', '2024-05-02', true),
  (44, 'api', 'webhook', '{"event": "payment_success", "ref": "PAY-175"}', '2024-05-03 11:00:00', '2024-05-03', true),
  (45, 'web_app', 'purchase', '{"amount": 199.00, "user_id": 117}', '2024-05-05 14:00:00', '2024-05-05', true),
  (46, 'web_app', 'page_view', NULL, '2024-05-08 09:00:00', '2024-05-08', false),
  (47, 'mobile_app', 'click', '{"button": "share", "user_id": 118}', '2024-05-10 10:30:00', '2024-05-10', true),
  (48, 'web_app', 'page_view', '{"page": "/pricing", "user_id": 118}', '2024-05-12 11:00:00', '2024-05-12', true),
  (49, 'api', 'webhook', NULL, '2024-05-15 12:00:00', '2024-05-15', false),
  (50, 'web_app', 'purchase', '{"amount": 99.00, "user_id": 118}', '2024-05-18 15:00:00', '2024-05-18', true);

-- staging_users (25 rows) — includes duplicates for deduplication exercises
INSERT INTO staging_users VALUES
  (1, 101, 'alice.durand@mail.com', 'Alice Durand', 'France', '2023-06-15', '2024-01-15 08:00:00', '2024-01-15'),
  (2, 102, 'bob.martin@mail.com', 'Bob Martin', 'France', '2023-07-20', '2024-01-15 08:00:00', '2024-01-15'),
  (3, 103, 'carla.rossi@mail.com', 'Carla Rossi', 'Italy', '2023-08-10', '2024-01-15 08:00:00', '2024-01-15'),
  (4, 104, 'david.chen@mail.com', 'David Chen', 'Singapore', '2023-09-01', '2024-01-15 08:00:00', '2024-01-15'),
  (5, 105, 'emma.schmidt@mail.com', NULL, 'Germany', '2023-10-05', '2024-01-15 08:00:00', '2024-01-15'),
  (6, 106, 'fabien.petit@mail.com', 'Fabien Petit', 'France', '2023-11-12', '2024-02-01 08:00:00', '2024-02-01'),
  (7, 107, 'grace.taylor@mail.com', 'Grace Taylor', 'UK', '2023-12-01', '2024-02-01 08:00:00', '2024-02-01'),
  (8, 108, 'hassan.ali@mail.com', 'Hassan Ali', NULL, '2024-01-10', '2024-02-05 08:00:00', '2024-02-05'),
  (9, 109, 'isabelle.leroy@mail.com', 'Isabelle Leroy', 'France', '2024-01-20', '2024-02-10 08:00:00', '2024-02-10'),
  (10, 110, 'jules.moreau@mail.com', 'Jules Moreau', 'France', '2024-02-15', '2024-03-01 08:00:00', '2024-03-01'),
  (11, 111, 'karen.jones@mail.com', 'Karen Jones', 'USA', '2024-02-20', '2024-03-02 08:00:00', '2024-03-02'),
  (12, 112, 'leo.garcia@mail.com', 'Leo Garcia', 'Spain', '2024-03-01', '2024-03-05 08:00:00', '2024-03-05'),
  (13, 101, 'alice.durand@mail.com', 'Alice Durand', 'France', '2023-06-15', '2024-03-10 10:00:00', '2024-03-10'),
  (14, 113, 'maria.silva@mail.com', NULL, 'Brazil', '2024-03-05', '2024-03-10 08:00:00', '2024-03-10'),
  (15, 105, 'emma.schmidt@mail.com', 'Emma Schmidt', 'Germany', '2023-10-05', '2024-03-15 09:00:00', '2024-03-15'),
  (16, 114, 'nicolas.blanc@mail.com', 'Nicolas Blanc', 'France', '2024-03-20', '2024-04-01 08:00:00', '2024-04-01'),
  (17, 115, 'olivia.brown@mail.com', 'Olivia Brown', 'UK', '2024-03-25', '2024-04-02 08:00:00', '2024-04-02'),
  (18, 108, 'hassan.ali@mail.com', 'Hassan Ali', 'Morocco', '2024-01-10', '2024-04-05 08:00:00', '2024-04-05'),
  (19, 116, 'paul.dupont@mail.com', 'Paul Dupont', 'France', '2024-04-01', '2024-04-15 08:00:00', '2024-04-15'),
  (20, 117, 'quinn.wu@mail.com', 'Quinn Wu', 'Canada', '2024-04-10', '2024-05-01 08:00:00', '2024-05-01'),
  (21, 118, 'rachel.kim@mail.com', 'Rachel Kim', 'South Korea', '2024-04-20', '2024-05-10 08:00:00', '2024-05-10'),
  (22, 102, 'bob.martin@mail.com', 'Bob Martin', 'France', '2023-07-20', '2024-05-12 09:00:00', '2024-05-12'),
  (23, 113, 'maria.silva@mail.com', 'Maria Silva', 'Brazil', '2024-03-05', '2024-05-15 10:00:00', '2024-05-15'),
  (24, 119, 'sam.jones@mail.com', NULL, NULL, '2024-05-01', '2024-05-18 08:00:00', '2024-05-18'),
  (25, 110, 'jules.moreau@mail.com', 'Jules Moreau', 'France', '2024-02-15', '2024-05-20 08:00:00', '2024-05-20');

-- dim_customer (20 rows) — SCD Type 2 with valid_from/valid_to/is_current
INSERT INTO dim_customer VALUES
  (1, 101, 'Alice Durand', 'alice.durand@mail.com', 'France', 'enterprise', '2023-06-15', '2024-03-01', false),
  (2, 101, 'Alice Durand', 'alice.durand@mail.com', 'France', 'strategic', '2024-03-01', NULL, true),
  (3, 102, 'Bob Martin', 'bob.martin@mail.com', 'France', 'starter', '2023-07-20', '2024-02-01', false),
  (4, 102, 'Bob Martin', 'bob.martin@mail.com', 'France', 'professional', '2024-02-01', NULL, true),
  (5, 103, 'Carla Rossi', 'carla.rossi@mail.com', 'Italy', 'professional', '2023-08-10', NULL, true),
  (6, 104, 'David Chen', 'david.chen@mail.com', 'Singapore', 'enterprise', '2023-09-01', NULL, true),
  (7, 105, 'Emma Schmidt', 'emma.schmidt@mail.com', 'Germany', 'starter', '2023-10-05', '2024-01-15', false),
  (8, 105, 'Emma Schmidt', 'emma.schmidt@mail.com', 'Germany', 'professional', '2024-01-15', NULL, true),
  (9, 106, 'Fabien Petit', 'fabien.petit@mail.com', 'France', 'starter', '2023-11-12', NULL, true),
  (10, 107, 'Grace Taylor', 'grace.taylor@mail.com', 'UK', 'enterprise', '2023-12-01', NULL, true),
  (11, 108, 'Hassan Ali', 'hassan.ali@mail.com', NULL, 'starter', '2024-01-10', '2024-04-01', false),
  (12, 108, 'Hassan Ali', 'hassan.ali@mail.com', 'Morocco', 'starter', '2024-04-01', NULL, true),
  (13, 109, 'Isabelle Leroy', 'isabelle.leroy@mail.com', 'France', 'professional', '2024-01-20', NULL, true),
  (14, 110, 'Jules Moreau', 'jules.moreau@mail.com', 'France', 'starter', '2024-02-15', NULL, true),
  (15, 111, 'Karen Jones', 'karen.jones@mail.com', 'USA', 'enterprise', '2024-02-20', NULL, true),
  (16, 112, 'Leo Garcia', 'leo.garcia@mail.com', 'Spain', 'professional', '2024-03-01', NULL, true),
  (17, 113, 'Maria Silva', 'maria.silva@mail.com', 'Brazil', 'starter', '2024-03-05', NULL, true),
  (18, 114, 'Nicolas Blanc', 'nicolas.blanc@mail.com', 'France', 'starter', '2024-03-20', NULL, true),
  (19, 115, 'Olivia Brown', 'olivia.brown@mail.com', 'UK', 'professional', '2024-03-25', NULL, true),
  (20, 116, 'Paul Dupont', 'paul.dupont@mail.com', 'France', 'enterprise', '2024-04-01', NULL, true);

-- dim_date (30 rows) — weekly Mondays covering Jan–Jul 2024
INSERT INTO dim_date VALUES
  (20240101, '2024-01-01', 'Monday', 1, 'January', 1, 2024),
  (20240108, '2024-01-08', 'Monday', 1, 'January', 1, 2024),
  (20240115, '2024-01-15', 'Monday', 1, 'January', 1, 2024),
  (20240122, '2024-01-22', 'Monday', 1, 'January', 1, 2024),
  (20240129, '2024-01-29', 'Monday', 1, 'January', 1, 2024),
  (20240205, '2024-02-05', 'Monday', 2, 'February', 1, 2024),
  (20240212, '2024-02-12', 'Monday', 2, 'February', 1, 2024),
  (20240219, '2024-02-19', 'Monday', 2, 'February', 1, 2024),
  (20240226, '2024-02-26', 'Monday', 2, 'February', 1, 2024),
  (20240304, '2024-03-04', 'Monday', 3, 'March', 1, 2024),
  (20240311, '2024-03-11', 'Monday', 3, 'March', 1, 2024),
  (20240318, '2024-03-18', 'Monday', 3, 'March', 1, 2024),
  (20240325, '2024-03-25', 'Monday', 3, 'March', 1, 2024),
  (20240401, '2024-04-01', 'Monday', 4, 'April', 2, 2024),
  (20240408, '2024-04-08', 'Monday', 4, 'April', 2, 2024),
  (20240415, '2024-04-15', 'Monday', 4, 'April', 2, 2024),
  (20240422, '2024-04-22', 'Monday', 4, 'April', 2, 2024),
  (20240429, '2024-04-29', 'Monday', 4, 'April', 2, 2024),
  (20240506, '2024-05-06', 'Monday', 5, 'May', 2, 2024),
  (20240513, '2024-05-13', 'Monday', 5, 'May', 2, 2024),
  (20240520, '2024-05-20', 'Monday', 5, 'May', 2, 2024),
  (20240527, '2024-05-27', 'Monday', 5, 'May', 2, 2024),
  (20240603, '2024-06-03', 'Monday', 6, 'June', 2, 2024),
  (20240610, '2024-06-10', 'Monday', 6, 'June', 2, 2024),
  (20240617, '2024-06-17', 'Monday', 6, 'June', 2, 2024),
  (20240624, '2024-06-24', 'Monday', 6, 'June', 2, 2024),
  (20240701, '2024-07-01', 'Monday', 7, 'July', 3, 2024),
  (20240708, '2024-07-08', 'Monday', 7, 'July', 3, 2024),
  (20240715, '2024-07-15', 'Monday', 7, 'July', 3, 2024),
  (20240722, '2024-07-22', 'Monday', 7, 'July', 3, 2024);

-- fact_events (40 rows) — fact table with FKs to dim_date and dim_customer
INSERT INTO fact_events VALUES
  (1, 20240115, 2, 'page_view', 5, NULL, 120),
  (2, 20240115, 5, 'page_view', 3, NULL, 95),
  (3, 20240115, 6, 'purchase', 1, 99.00, 340),
  (4, 20240122, 8, 'page_view', 2, NULL, 110),
  (5, 20240122, 5, 'purchase', 1, 49.00, 280),
  (6, 20240129, 9, 'page_view', 4, NULL, 105),
  (7, 20240205, 10, 'page_view', 3, NULL, 130),
  (8, 20240205, 13, 'click', 7, NULL, 88),
  (9, 20240212, 4, 'purchase', 1, 199.00, 450),
  (10, 20240212, 2, 'click', 4, NULL, 92),
  (11, 20240219, 6, 'page_view', 6, NULL, 115),
  (12, 20240226, 13, 'purchase', 1, 99.00, 310),
  (13, 20240304, 14, 'page_view', 2, NULL, 100),
  (14, 20240304, 15, 'click', 5, NULL, 78),
  (15, 20240311, 16, 'purchase', 1, 149.00, 520),
  (16, 20240311, 5, 'page_view', 4, NULL, 108),
  (17, 20240318, 14, 'click', 3, NULL, 85),
  (18, 20240325, 16, 'page_view', 8, NULL, 140),
  (19, 20240325, 15, 'purchase', 1, 299.00, 610),
  (20, 20240401, 18, 'page_view', 2, NULL, 98),
  (21, 20240401, 19, 'click', 4, NULL, 76),
  (22, 20240408, 2, 'page_view', 3, NULL, 112),
  (23, 20240408, 20, 'purchase', 1, 99.00, 290),
  (24, 20240415, 12, 'page_view', 5, NULL, 125),
  (25, 20240415, 18, 'click', 6, NULL, 82),
  (26, 20240422, 19, 'purchase', 1, 99.00, 305),
  (27, 20240422, 14, 'page_view', 4, NULL, 118),
  (28, 20240429, 20, 'click', 3, NULL, 90),
  (29, 20240506, 2, 'purchase', 1, 199.00, 475),
  (30, 20240506, 8, 'page_view', 6, NULL, 135),
  (31, 20240513, 17, 'click', 2, NULL, 70),
  (32, 20240513, 15, 'page_view', 3, NULL, 102),
  (33, 20240520, 9, 'purchase', 1, 199.00, 380),
  (34, 20240520, 12, 'click', 5, NULL, 88),
  (35, 20240527, 6, 'page_view', 7, NULL, 142),
  (36, 20240527, 17, 'purchase', 1, 99.00, 295),
  (37, 20240603, 14, 'page_view', 3, NULL, 108),
  (38, 20240603, 18, 'purchase', 1, 49.00, 260),
  (39, 20240610, 20, 'page_view', 4, NULL, 115),
  (40, 20240610, 19, 'click', 6, NULL, 80);

-- data_quality_logs (15 rows)
INSERT INTO data_quality_logs VALUES
  (1, 'staging_users', 'null_email_check', 'completeness', 'pass', 25, 0, '2024-01-15', 'pipeline_bot'),
  (2, 'staging_users', 'null_name_check', 'completeness', 'fail', 25, 3, '2024-01-15', 'pipeline_bot'),
  (3, 'staging_users', 'unique_email_check', 'uniqueness', 'pass', 25, 0, '2024-01-15', 'pipeline_bot'),
  (4, 'raw_events', 'null_payload_check', 'completeness', 'fail', 50, 7, '2024-02-01', 'pipeline_bot'),
  (5, 'raw_events', 'valid_event_type_check', 'validity', 'pass', 50, 0, '2024-02-01', 'pipeline_bot'),
  (6, 'fact_events', 'referential_integrity_customer', 'referential', 'pass', 40, 0, '2024-02-15', 'pipeline_bot'),
  (7, 'fact_events', 'referential_integrity_date', 'referential', 'pass', 40, 0, '2024-02-15', 'pipeline_bot'),
  (8, 'dim_customer', 'scd_no_overlap_check', 'validity', 'pass', 20, 0, '2024-03-01', 'amelie'),
  (9, 'staging_users', 'duplicate_user_check', 'uniqueness', 'fail', 25, 6, '2024-03-15', 'pipeline_bot'),
  (10, 'raw_events', 'freshness_check', 'freshness', 'pass', 50, 0, '2024-04-01', 'pipeline_bot'),
  (11, 'dim_customer', 'null_country_check', 'completeness', 'fail', 20, 1, '2024-04-01', 'amelie'),
  (12, 'fact_events', 'negative_revenue_check', 'validity', 'pass', 40, 0, '2024-04-15', 'pipeline_bot'),
  (13, 'staging_users', 'null_country_check', 'completeness', 'fail', 25, 1, '2024-05-01', 'pipeline_bot'),
  (14, 'raw_events', 'null_payload_check', 'completeness', 'fail', 50, 7, '2024-05-15', 'amelie'),
  (15, 'fact_events', 'freshness_check', 'freshness', 'fail', 40, 0, '2024-06-01', 'pipeline_bot');
`;

export const cloudForge: CompanyProfile = {
  id: "cloudforge",
  name: "CloudForge",
  tagline: "Your data, our forge",
  taglineFr: "Vos donn\u00e9es, notre forge",
  sector: "Data Platform",
  sectorFr: "Plateforme Data",
  icon: "\u2692\uFE0F",
  description:
    "You just joined CloudForge, a data platform vendor that helps clients build their data warehouse. Internally, the DE team manages a pipeline with a medallion architecture (bronze/silver/gold). Romain (CTO) wants pipeline reliability, Am\u00e9lie (Senior DE) reviews SQL and PRs, and Karim (Data Analyst) consumes the gold tables \u2014 and complains when they break.",
  descriptionFr:
    "Tu viens de rejoindre CloudForge, un \u00e9diteur de plateforme data qui aide ses clients \u00e0 construire leur data warehouse. En interne, l'\u00e9quipe DE g\u00e8re un pipeline avec une architecture medallion (bronze/silver/gold). Romain (CTO) veut de la fiabilit\u00e9 pipeline, Am\u00e9lie (DE Senior) review le SQL et les PRs, et Karim (Data Analyst) consomme les tables gold \u2014 et se plaint quand \u00e7a casse.",
  schema,
  tables: [
    {
      name: "raw_events",
      description: "Raw events from various sources (bronze layer)",
      descriptionFr: "\u00c9v\u00e9nements bruts depuis diff\u00e9rentes sources (couche bronze)",
      rowCount: 50,
      columns: [
        { name: "event_id", type: "INTEGER", nullable: false, description: "Unique event ID", descriptionFr: "ID unique de l'\u00e9v\u00e9nement" },
        { name: "source", type: "VARCHAR", nullable: false, description: "Event source (web_app, mobile_app, api)", descriptionFr: "Source de l'\u00e9v\u00e9nement (web_app, mobile_app, api)" },
        { name: "event_type", type: "VARCHAR", nullable: false, description: "Type of event (page_view, click, purchase, webhook)", descriptionFr: "Type d'\u00e9v\u00e9nement (page_view, click, purchase, webhook)" },
        { name: "payload", type: "VARCHAR", nullable: true, description: "JSON payload (can be NULL for invalid events)", descriptionFr: "Payload JSON (peut \u00eatre NULL pour les \u00e9v\u00e9nements invalides)" },
        { name: "event_timestamp", type: "TIMESTAMP", nullable: false, description: "When the event occurred", descriptionFr: "Quand l'\u00e9v\u00e9nement s'est produit" },
        { name: "ingestion_date", type: "DATE", nullable: false, description: "Date the event was ingested", descriptionFr: "Date d'ingestion de l'\u00e9v\u00e9nement" },
        { name: "is_valid", type: "BOOLEAN", nullable: true, description: "Whether the event passed validation", descriptionFr: "Si l'\u00e9v\u00e9nement a pass\u00e9 la validation" },
      ],
    },
    {
      name: "staging_users",
      description: "Staging table for user data (silver layer, not yet validated)",
      descriptionFr: "Table staging des donn\u00e9es utilisateur (couche silver, pas encore valid\u00e9es)",
      rowCount: 25,
      columns: [
        { name: "staging_id", type: "INTEGER", nullable: false, description: "Unique staging record ID", descriptionFr: "ID unique de l'enregistrement staging" },
        { name: "user_id", type: "INTEGER", nullable: false, description: "Business user ID (can have duplicates)", descriptionFr: "ID utilisateur m\u00e9tier (peut avoir des doublons)" },
        { name: "email", type: "VARCHAR", nullable: false, description: "User email", descriptionFr: "Email de l'utilisateur" },
        { name: "full_name", type: "VARCHAR", nullable: true, description: "Full name (can be NULL)", descriptionFr: "Nom complet (peut \u00eatre NULL)" },
        { name: "country", type: "VARCHAR", nullable: true, description: "Country (can be NULL)", descriptionFr: "Pays (peut \u00eatre NULL)" },
        { name: "created_at", type: "DATE", nullable: false, description: "Account creation date", descriptionFr: "Date de cr\u00e9ation du compte" },
        { name: "updated_at", type: "TIMESTAMP", nullable: false, description: "Last update timestamp", descriptionFr: "Timestamp de derni\u00e8re mise \u00e0 jour" },
        { name: "load_date", type: "DATE", nullable: false, description: "Date loaded into staging", descriptionFr: "Date de chargement en staging" },
      ],
    },
    {
      name: "dim_customer",
      description: "Customer dimension with SCD Type 2 history (gold layer)",
      descriptionFr: "Dimension client avec historique SCD Type 2 (couche gold)",
      rowCount: 20,
      columns: [
        { name: "customer_key", type: "INTEGER", nullable: false, description: "Surrogate key", descriptionFr: "Cl\u00e9 de substitution" },
        { name: "customer_id", type: "INTEGER", nullable: false, description: "Natural business key", descriptionFr: "Cl\u00e9 m\u00e9tier naturelle" },
        { name: "customer_name", type: "VARCHAR", nullable: false, description: "Customer full name", descriptionFr: "Nom complet du client" },
        { name: "email", type: "VARCHAR", nullable: false, description: "Customer email", descriptionFr: "Email du client" },
        { name: "country", type: "VARCHAR", nullable: true, description: "Country (can be NULL)", descriptionFr: "Pays (peut \u00eatre NULL)" },
        { name: "segment", type: "VARCHAR", nullable: false, description: "Customer segment (starter, professional, enterprise, strategic)", descriptionFr: "Segment client (starter, professional, enterprise, strategic)" },
        { name: "valid_from", type: "DATE", nullable: false, description: "Start of validity period", descriptionFr: "D\u00e9but de la p\u00e9riode de validit\u00e9" },
        { name: "valid_to", type: "DATE", nullable: true, description: "End of validity (NULL = current)", descriptionFr: "Fin de validit\u00e9 (NULL = actuel)" },
        { name: "is_current", type: "BOOLEAN", nullable: false, description: "Whether this is the current record", descriptionFr: "Si c'est l'enregistrement actuel" },
      ],
    },
    {
      name: "dim_date",
      description: "Date dimension (weekly granularity)",
      descriptionFr: "Dimension date (granularit\u00e9 hebdomadaire)",
      rowCount: 30,
      columns: [
        { name: "date_key", type: "INTEGER", nullable: false, description: "Date key (YYYYMMDD format)", descriptionFr: "Cl\u00e9 date (format AAAAMMJJ)" },
        { name: "full_date", type: "DATE", nullable: false, description: "Full calendar date", descriptionFr: "Date calendaire compl\u00e8te" },
        { name: "day_of_week", type: "VARCHAR", nullable: false, description: "Day name", descriptionFr: "Nom du jour" },
        { name: "month_num", type: "INTEGER", nullable: false, description: "Month number (1-12)", descriptionFr: "Num\u00e9ro du mois (1-12)" },
        { name: "month_name", type: "VARCHAR", nullable: false, description: "Month name", descriptionFr: "Nom du mois" },
        { name: "quarter", type: "INTEGER", nullable: false, description: "Quarter (1-4)", descriptionFr: "Trimestre (1-4)" },
        { name: "year", type: "INTEGER", nullable: false, description: "Calendar year", descriptionFr: "Ann\u00e9e calendaire" },
      ],
    },
    {
      name: "fact_events",
      description: "Fact table with aggregated event metrics (gold layer)",
      descriptionFr: "Table de faits avec m\u00e9triques d'\u00e9v\u00e9nements agr\u00e9g\u00e9s (couche gold)",
      rowCount: 40,
      columns: [
        { name: "fact_id", type: "INTEGER", nullable: false, description: "Unique fact record ID", descriptionFr: "ID unique de l'enregistrement fact" },
        { name: "event_date_key", type: "INTEGER", nullable: false, description: "FK to dim_date", descriptionFr: "FK vers dim_date" },
        { name: "customer_key", type: "INTEGER", nullable: false, description: "FK to dim_customer", descriptionFr: "FK vers dim_customer" },
        { name: "event_type", type: "VARCHAR", nullable: false, description: "Event type (page_view, click, purchase)", descriptionFr: "Type d'\u00e9v\u00e9nement (page_view, click, purchase)" },
        { name: "event_count", type: "INTEGER", nullable: false, description: "Number of events", descriptionFr: "Nombre d'\u00e9v\u00e9nements" },
        { name: "revenue", type: "DECIMAL(10,2)", nullable: true, description: "Revenue amount (NULL for non-purchase events)", descriptionFr: "Montant du revenu (NULL pour les non-achats)" },
        { name: "processing_time_ms", type: "INTEGER", nullable: false, description: "Pipeline processing time in ms", descriptionFr: "Temps de traitement pipeline en ms" },
      ],
    },
    {
      name: "data_quality_logs",
      description: "Data quality check results from pipeline runs",
      descriptionFr: "R\u00e9sultats des contr\u00f4les qualit\u00e9 des ex\u00e9cutions pipeline",
      rowCount: 15,
      columns: [
        { name: "log_id", type: "INTEGER", nullable: false, description: "Unique log ID", descriptionFr: "ID unique du log" },
        { name: "table_name", type: "VARCHAR", nullable: false, description: "Table being checked", descriptionFr: "Table contr\u00f4l\u00e9e" },
        { name: "check_name", type: "VARCHAR", nullable: false, description: "Name of the quality check", descriptionFr: "Nom du contr\u00f4le qualit\u00e9" },
        { name: "check_type", type: "VARCHAR", nullable: false, description: "Type of check (completeness, uniqueness, validity, referential, freshness)", descriptionFr: "Type de contr\u00f4le (completeness, uniqueness, validity, referential, freshness)" },
        { name: "result", type: "VARCHAR", nullable: false, description: "Check result (pass or fail)", descriptionFr: "R\u00e9sultat du contr\u00f4le (pass ou fail)" },
        { name: "records_checked", type: "INTEGER", nullable: false, description: "Number of records checked", descriptionFr: "Nombre d'enregistrements contr\u00f4l\u00e9s" },
        { name: "records_failed", type: "INTEGER", nullable: false, description: "Number of records that failed", descriptionFr: "Nombre d'enregistrements en \u00e9chec" },
        { name: "check_date", type: "DATE", nullable: false, description: "Date the check was run", descriptionFr: "Date d'ex\u00e9cution du contr\u00f4le" },
        { name: "run_by", type: "VARCHAR", nullable: false, description: "Who ran the check (pipeline_bot or person)", descriptionFr: "Qui a lanc\u00e9 le contr\u00f4le (pipeline_bot ou personne)" },
      ],
    },
  ],
  questions: [
    {
      id: "cf-01",
      title: "Failed data quality checks dashboard",
      titleFr: "Tableau de bord des contr\u00f4les qualit\u00e9 en \u00e9chec",
      stakeholder: "Romain",
      stakeholderRole: "CTO",
      difficulty: "easy",
      description:
        "Romain (CTO) needs a quick view of all failed data quality checks across the platform. Show the table name, check name, check type, number of failed records, and check date. Sort by most recent check first, then by table name.",
      descriptionFr:
        "Romain (CTO) a besoin d'une vue rapide de tous les contr\u00f4les qualit\u00e9 en \u00e9chec sur la plateforme. Affiche le nom de la table, le nom du contr\u00f4le, le type de contr\u00f4le, le nombre d'enregistrements en \u00e9chec et la date du contr\u00f4le. Trie par date la plus r\u00e9cente d'abord, puis par nom de table.",
      hint: "Filter data_quality_logs WHERE result = 'fail'. ORDER BY check_date DESC, table_name.",
      hintFr: "Filtre data_quality_logs WHERE result = 'fail'. ORDER BY check_date DESC, table_name.",
      solutionQuery: `SELECT table_name, check_name, check_type, records_failed, check_date
FROM data_quality_logs
WHERE result = 'fail'
ORDER BY check_date DESC, table_name;`,
      expectedColumns: ["table_name", "check_name", "check_type", "records_failed", "check_date"],
      expectedRows: [
        { table_name: "fact_events", check_name: "freshness_check", check_type: "freshness", records_failed: 0, check_date: "2024-06-01" },
        { table_name: "raw_events", check_name: "null_payload_check", check_type: "completeness", records_failed: 7, check_date: "2024-05-15" },
        { table_name: "staging_users", check_name: "null_country_check", check_type: "completeness", records_failed: 1, check_date: "2024-05-01" },
        { table_name: "dim_customer", check_name: "null_country_check", check_type: "completeness", records_failed: 1, check_date: "2024-04-01" },
        { table_name: "staging_users", check_name: "duplicate_user_check", check_type: "uniqueness", records_failed: 6, check_date: "2024-03-15" },
        { table_name: "raw_events", check_name: "null_payload_check", check_type: "completeness", records_failed: 7, check_date: "2024-02-01" },
        { table_name: "staging_users", check_name: "null_name_check", check_type: "completeness", records_failed: 3, check_date: "2024-01-15" },
      ],
      orderMatters: true,
    },
    {
      id: "cf-02",
      title: "Current customers by segment",
      titleFr: "Clients actuels par segment",
      stakeholder: "Karim",
      stakeholderRole: "Data Analyst",
      difficulty: "easy",
      description:
        "Karim (Data Analyst) needs to build a segment breakdown for the latest board deck. Using the customer dimension, count how many current (active) customers belong to each segment. Sort by customer count descending.",
      descriptionFr:
        "Karim (Data Analyst) doit pr\u00e9parer une r\u00e9partition par segment pour la pr\u00e9sentation au board. En utilisant la dimension client, compte combien de clients actuels (actifs) appartiennent \u00e0 chaque segment. Trie par nombre de clients d\u00e9croissant.",
      hint: "Filter dim_customer WHERE is_current = true. GROUP BY segment, COUNT(*).",
      hintFr: "Filtre dim_customer WHERE is_current = true. GROUP BY segment, COUNT(*).",
      solutionQuery: `SELECT segment, COUNT(*) AS customer_count
FROM dim_customer
WHERE is_current = true
GROUP BY segment
ORDER BY customer_count DESC;`,
      expectedColumns: ["segment", "customer_count"],
      expectedRows: [
        { segment: "professional", customer_count: 6 },
        { segment: "starter", customer_count: 5 },
        { segment: "enterprise", customer_count: 4 },
        { segment: "strategic", customer_count: 1 },
      ],
      orderMatters: true,
    },
    {
      id: "cf-03",
      title: "NULL completeness report for staging users",
      titleFr: "Rapport de compl\u00e9tude NULL de la table staging users",
      stakeholder: "Am\u00e9lie",
      stakeholderRole: "Senior Data Engineer",
      difficulty: "medium",
      description:
        "Am\u00e9lie (Senior DE) wants a data quality report showing NULL completeness for the staging_users table. Show the total number of rows, the count of NULL values for full_name and country columns, and the percentage of NULLs for each (rounded to 1 decimal).",
      descriptionFr:
        "Am\u00e9lie (DE Senior) veut un rapport qualit\u00e9 montrant la compl\u00e9tude NULL de la table staging_users. Affiche le nombre total de lignes, le nombre de valeurs NULL pour les colonnes full_name et country, et le pourcentage de NULL pour chacune (arrondi \u00e0 1 d\u00e9cimale).",
      hint: "Use COUNT(*) - COUNT(column) to find NULLs. Divide by COUNT(*) for percentage.",
      hintFr: "Utilise COUNT(*) - COUNT(colonne) pour trouver les NULL. Divise par COUNT(*) pour le pourcentage.",
      solutionQuery: `SELECT
  COUNT(*) AS total_rows,
  COUNT(*) - COUNT(full_name) AS null_full_name,
  COUNT(*) - COUNT(country) AS null_country,
  ROUND(100.0 * (COUNT(*) - COUNT(full_name)) / COUNT(*), 1) AS pct_null_full_name,
  ROUND(100.0 * (COUNT(*) - COUNT(country)) / COUNT(*), 1) AS pct_null_country
FROM staging_users;`,
      expectedColumns: ["total_rows", "null_full_name", "null_country", "pct_null_full_name", "pct_null_country"],
      expectedRows: [
        { total_rows: 25, null_full_name: 3, null_country: 2, pct_null_full_name: 12.0, pct_null_country: 8.0 },
      ],
      orderMatters: false,
    },
    {
      id: "cf-04",
      title: "Deduplicate staging users",
      titleFr: "D\u00e9doublonner les utilisateurs en staging",
      stakeholder: "Am\u00e9lie",
      stakeholderRole: "Senior Data Engineer",
      difficulty: "medium",
      description:
        "Am\u00e9lie (Senior DE) discovered that staging_users contains duplicate records for the same user_id (loaded multiple times). Write a deduplication query that keeps only the most recent record per user_id (based on updated_at). Show user_id, email, full_name, country, created_at, and updated_at, ordered by user_id.",
      descriptionFr:
        "Am\u00e9lie (DE Senior) a d\u00e9couvert que staging_users contient des doublons pour le m\u00eame user_id (charg\u00e9s plusieurs fois). \u00c9cris une requ\u00eate de d\u00e9doublonnage qui ne garde que l'enregistrement le plus r\u00e9cent par user_id (bas\u00e9 sur updated_at). Affiche user_id, email, full_name, country, created_at et updated_at, tri\u00e9 par user_id.",
      hint: "Use ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) and filter rn = 1 in an outer query.",
      hintFr: "Utilise ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) et filtre rn = 1 dans une requ\u00eate externe.",
      solutionQuery: `SELECT user_id, email, full_name, country, created_at, updated_at
FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) AS rn
  FROM staging_users
)
WHERE rn = 1
ORDER BY user_id;`,
      expectedColumns: ["user_id", "email", "full_name", "country", "created_at", "updated_at"],
      expectedRows: [
        { user_id: 101, email: "alice.durand@mail.com", full_name: "Alice Durand", country: "France", created_at: "2023-06-15", updated_at: "2024-03-10 10:00:00" },
        { user_id: 102, email: "bob.martin@mail.com", full_name: "Bob Martin", country: "France", created_at: "2023-07-20", updated_at: "2024-05-12 09:00:00" },
        { user_id: 103, email: "carla.rossi@mail.com", full_name: "Carla Rossi", country: "Italy", created_at: "2023-08-10", updated_at: "2024-01-15 08:00:00" },
        { user_id: 104, email: "david.chen@mail.com", full_name: "David Chen", country: "Singapore", created_at: "2023-09-01", updated_at: "2024-01-15 08:00:00" },
        { user_id: 105, email: "emma.schmidt@mail.com", full_name: "Emma Schmidt", country: "Germany", created_at: "2023-10-05", updated_at: "2024-03-15 09:00:00" },
        { user_id: 106, email: "fabien.petit@mail.com", full_name: "Fabien Petit", country: "France", created_at: "2023-11-12", updated_at: "2024-02-01 08:00:00" },
        { user_id: 107, email: "grace.taylor@mail.com", full_name: "Grace Taylor", country: "UK", created_at: "2023-12-01", updated_at: "2024-02-01 08:00:00" },
        { user_id: 108, email: "hassan.ali@mail.com", full_name: "Hassan Ali", country: "Morocco", created_at: "2024-01-10", updated_at: "2024-04-05 08:00:00" },
        { user_id: 109, email: "isabelle.leroy@mail.com", full_name: "Isabelle Leroy", country: "France", created_at: "2024-01-20", updated_at: "2024-02-10 08:00:00" },
        { user_id: 110, email: "jules.moreau@mail.com", full_name: "Jules Moreau", country: "France", created_at: "2024-02-15", updated_at: "2024-05-20 08:00:00" },
        { user_id: 111, email: "karen.jones@mail.com", full_name: "Karen Jones", country: "USA", created_at: "2024-02-20", updated_at: "2024-03-02 08:00:00" },
        { user_id: 112, email: "leo.garcia@mail.com", full_name: "Leo Garcia", country: "Spain", created_at: "2024-03-01", updated_at: "2024-03-05 08:00:00" },
        { user_id: 113, email: "maria.silva@mail.com", full_name: "Maria Silva", country: "Brazil", created_at: "2024-03-05", updated_at: "2024-05-15 10:00:00" },
        { user_id: 114, email: "nicolas.blanc@mail.com", full_name: "Nicolas Blanc", country: "France", created_at: "2024-03-20", updated_at: "2024-04-01 08:00:00" },
        { user_id: 115, email: "olivia.brown@mail.com", full_name: "Olivia Brown", country: "UK", created_at: "2024-03-25", updated_at: "2024-04-02 08:00:00" },
        { user_id: 116, email: "paul.dupont@mail.com", full_name: "Paul Dupont", country: "France", created_at: "2024-04-01", updated_at: "2024-04-15 08:00:00" },
        { user_id: 117, email: "quinn.wu@mail.com", full_name: "Quinn Wu", country: "Canada", created_at: "2024-04-10", updated_at: "2024-05-01 08:00:00" },
        { user_id: 118, email: "rachel.kim@mail.com", full_name: "Rachel Kim", country: "South Korea", created_at: "2024-04-20", updated_at: "2024-05-10 08:00:00" },
        { user_id: 119, email: "sam.jones@mail.com", full_name: null, country: null, created_at: "2024-05-01", updated_at: "2024-05-18 08:00:00" },
      ],
      orderMatters: true,
    },
    {
      id: "cf-05",
      title: "Customers who changed segment (SCD Type 2)",
      titleFr: "Clients ayant chang\u00e9 de segment (SCD Type 2)",
      stakeholder: "Romain",
      stakeholderRole: "CTO",
      difficulty: "medium",
      description:
        "Romain (CTO) wants to understand customer segment migrations. Using the SCD Type 2 history in dim_customer, find customers whose segment changed over time. Show the customer_id, customer_name, old segment, new segment, and the date of change. Order by customer_id.",
      descriptionFr:
        "Romain (CTO) veut comprendre les migrations de segments clients. En utilisant l'historique SCD Type 2 dans dim_customer, trouve les clients dont le segment a chang\u00e9 au fil du temps. Affiche le customer_id, customer_name, l'ancien segment, le nouveau segment et la date du changement. Trie par customer_id.",
      hint: "Self-join dim_customer: match c1.customer_id = c2.customer_id AND c1.valid_to = c2.valid_from. Filter WHERE c1.segment != c2.segment.",
      hintFr: "Auto-jointure sur dim_customer : match c1.customer_id = c2.customer_id AND c1.valid_to = c2.valid_from. Filtre WHERE c1.segment != c2.segment.",
      solutionQuery: `SELECT
  c1.customer_id,
  c1.customer_name,
  c1.segment AS old_segment,
  c2.segment AS new_segment,
  c1.valid_to AS change_date
FROM dim_customer c1
JOIN dim_customer c2
  ON c1.customer_id = c2.customer_id
  AND c1.valid_to = c2.valid_from
WHERE c1.segment != c2.segment
ORDER BY c1.customer_id;`,
      expectedColumns: ["customer_id", "customer_name", "old_segment", "new_segment", "change_date"],
      expectedRows: [
        { customer_id: 101, customer_name: "Alice Durand", old_segment: "enterprise", new_segment: "strategic", change_date: "2024-03-01" },
        { customer_id: 102, customer_name: "Bob Martin", old_segment: "starter", new_segment: "professional", change_date: "2024-02-01" },
        { customer_id: 105, customer_name: "Emma Schmidt", old_segment: "starter", new_segment: "professional", change_date: "2024-01-15" },
      ],
      orderMatters: true,
    },
    {
      id: "cf-06",
      title: "Monthly revenue from star schema",
      titleFr: "Revenu mensuel depuis le sch\u00e9ma en \u00e9toile",
      stakeholder: "Karim",
      stakeholderRole: "Data Analyst",
      difficulty: "medium",
      description:
        "Karim (Data Analyst) needs a monthly revenue report for a dashboard. Join fact_events with dim_date to get the month name and total revenue for purchase events only. Also show the number of purchases per month. Order by month number.",
      descriptionFr:
        "Karim (Data Analyst) a besoin d'un rapport de revenu mensuel pour un dashboard. Joins fact_events avec dim_date pour obtenir le nom du mois et le revenu total pour les \u00e9v\u00e9nements d'achat uniquement. Affiche aussi le nombre d'achats par mois. Trie par num\u00e9ro de mois.",
      hint: "JOIN fact_events with dim_date ON event_date_key = date_key. Filter WHERE revenue IS NOT NULL. GROUP BY month_name and month_num.",
      hintFr: "JOIN fact_events avec dim_date ON event_date_key = date_key. Filtre WHERE revenue IS NOT NULL. GROUP BY month_name et month_num.",
      solutionQuery: `SELECT d.month_name, d.month_num,
  SUM(f.revenue) AS total_revenue,
  COUNT(*) FILTER (WHERE f.revenue IS NOT NULL) AS purchase_count
FROM fact_events f
JOIN dim_date d ON f.event_date_key = d.date_key
WHERE f.revenue IS NOT NULL
GROUP BY d.month_name, d.month_num
ORDER BY d.month_num;`,
      expectedColumns: ["month_name", "month_num", "total_revenue", "purchase_count"],
      expectedRows: [
        { month_name: "January", month_num: 1, total_revenue: 148.00, purchase_count: 2 },
        { month_name: "February", month_num: 2, total_revenue: 298.00, purchase_count: 2 },
        { month_name: "March", month_num: 3, total_revenue: 448.00, purchase_count: 2 },
        { month_name: "April", month_num: 4, total_revenue: 198.00, purchase_count: 2 },
        { month_name: "May", month_num: 5, total_revenue: 497.00, purchase_count: 3 },
        { month_name: "June", month_num: 6, total_revenue: 49.00, purchase_count: 1 },
      ],
      orderMatters: true,
    },
    {
      id: "cf-07",
      title: "Invalid event rate by source and month",
      titleFr: "Taux d'\u00e9v\u00e9nements invalides par source et par mois",
      stakeholder: "Romain",
      stakeholderRole: "CTO",
      difficulty: "hard",
      description:
        "Romain (CTO) wants to monitor pipeline reliability. Calculate the invalid event rate per source per month from raw_events. Show the month (as date, first day), source, total events, invalid events, and the invalid rate as a percentage rounded to 1 decimal. Only include source/month combinations that have at least one invalid event. Order by month then source.",
      descriptionFr:
        "Romain (CTO) veut surveiller la fiabilit\u00e9 du pipeline. Calcule le taux d'\u00e9v\u00e9nements invalides par source et par mois depuis raw_events. Affiche le mois (en date, premier jour), la source, le total d'\u00e9v\u00e9nements, les \u00e9v\u00e9nements invalides et le taux d'invalidit\u00e9 en pourcentage arrondi \u00e0 1 d\u00e9cimale. N'inclus que les combinaisons source/mois ayant au moins un \u00e9v\u00e9nement invalide. Trie par mois puis source.",
      hint: "Use DATE_TRUNC('month', ingestion_date) for grouping. COUNT(*) FILTER (WHERE is_valid = false) for invalid count. HAVING to filter groups.",
      hintFr: "Utilise DATE_TRUNC('month', ingestion_date) pour le regroupement. COUNT(*) FILTER (WHERE is_valid = false) pour le compte invalide. HAVING pour filtrer les groupes.",
      solutionQuery: `SELECT
  CAST(DATE_TRUNC('month', ingestion_date) AS DATE) AS month,
  source,
  COUNT(*) AS total_events,
  COUNT(*) FILTER (WHERE is_valid = false) AS invalid_events,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_valid = false) / COUNT(*), 1) AS invalid_rate
FROM raw_events
GROUP BY CAST(DATE_TRUNC('month', ingestion_date) AS DATE), source
HAVING COUNT(*) FILTER (WHERE is_valid = false) > 0
ORDER BY month, source;`,
      expectedColumns: ["month", "source", "total_events", "invalid_events", "invalid_rate"],
      expectedRows: [
        { month: "2024-01-01", source: "api", total_events: 2, invalid_events: 1, invalid_rate: 50.0 },
        { month: "2024-01-01", source: "web_app", total_events: 5, invalid_events: 1, invalid_rate: 20.0 },
        { month: "2024-02-01", source: "mobile_app", total_events: 2, invalid_events: 1, invalid_rate: 50.0 },
        { month: "2024-03-01", source: "api", total_events: 2, invalid_events: 1, invalid_rate: 50.0 },
        { month: "2024-03-01", source: "web_app", total_events: 5, invalid_events: 1, invalid_rate: 20.0 },
        { month: "2024-04-01", source: "mobile_app", total_events: 3, invalid_events: 1, invalid_rate: 33.3 },
        { month: "2024-05-01", source: "api", total_events: 2, invalid_events: 1, invalid_rate: 50.0 },
        { month: "2024-05-01", source: "web_app", total_events: 6, invalid_events: 1, invalid_rate: 16.7 },
      ],
      orderMatters: true,
    },
    {
      id: "cf-08",
      title: "Pipeline freshness monitoring",
      titleFr: "Surveillance de la fra\u00eecheur du pipeline",
      stakeholder: "Romain",
      stakeholderRole: "CTO",
      difficulty: "hard",
      description:
        "Romain (CTO) wants a freshness dashboard showing the last ingestion date per event source and how many days have passed since then (relative to 2024-06-01 as the reference date). Show source, last ingestion date, and days since last event. Order by staleness descending (most stale first).",
      descriptionFr:
        "Romain (CTO) veut un dashboard de fra\u00eecheur montrant la derni\u00e8re date d'ingestion par source d'\u00e9v\u00e9nement et combien de jours se sont \u00e9coul\u00e9s depuis (par rapport au 2024-06-01 comme date de r\u00e9f\u00e9rence). Affiche la source, la derni\u00e8re date d'ingestion et le nombre de jours depuis le dernier \u00e9v\u00e9nement. Trie par anciennet\u00e9 d\u00e9croissante (le plus ancien d'abord).",
      hint: "MAX(ingestion_date) per source. Subtract from CAST('2024-06-01' AS DATE) to get days elapsed.",
      hintFr: "MAX(ingestion_date) par source. Soustrais de CAST('2024-06-01' AS DATE) pour obtenir les jours \u00e9coul\u00e9s.",
      solutionQuery: `SELECT
  source,
  MAX(ingestion_date) AS last_ingestion_date,
  CAST('2024-06-01' AS DATE) - MAX(ingestion_date) AS days_since_last_event
FROM raw_events
GROUP BY source
ORDER BY days_since_last_event DESC;`,
      expectedColumns: ["source", "last_ingestion_date", "days_since_last_event"],
      expectedRows: [
        { source: "mobile_app", last_ingestion_date: "2024-05-10", days_since_last_event: 22 },
        { source: "api", last_ingestion_date: "2024-05-15", days_since_last_event: 17 },
        { source: "web_app", last_ingestion_date: "2024-05-18", days_since_last_event: 14 },
      ],
      orderMatters: true,
    },
    {
      id: "cf-09",
      title: "Revenue by customer segment (star schema)",
      titleFr: "Revenu par segment client (sch\u00e9ma en \u00e9toile)",
      stakeholder: "Karim",
      stakeholderRole: "Data Analyst",
      difficulty: "hard",
      description:
        "Karim (Data Analyst) wants to understand revenue distribution by customer segment. Join fact_events with dim_customer to compute, for current customers only, the total revenue per segment, the number of distinct customers, and the average revenue per customer (rounded to 2 decimals). Only include purchase events (revenue IS NOT NULL). Order by total revenue descending.",
      descriptionFr:
        "Karim (Data Analyst) veut comprendre la r\u00e9partition du revenu par segment client. Joins fact_events avec dim_customer pour calculer, pour les clients actuels uniquement, le revenu total par segment, le nombre de clients distincts et le revenu moyen par client (arrondi \u00e0 2 d\u00e9cimales). N'inclus que les \u00e9v\u00e9nements d'achat (revenue IS NOT NULL). Trie par revenu total d\u00e9croissant.",
      hint: "JOIN fact_events with dim_customer ON customer_key. Filter is_current = true AND revenue IS NOT NULL. Use COUNT(DISTINCT customer_id) for unique customers.",
      hintFr: "JOIN fact_events avec dim_customer ON customer_key. Filtre is_current = true AND revenue IS NOT NULL. Utilise COUNT(DISTINCT customer_id) pour les clients uniques.",
      solutionQuery: `SELECT
  dc.segment,
  COUNT(DISTINCT dc.customer_id) AS customer_count,
  SUM(f.revenue) AS total_revenue,
  ROUND(SUM(f.revenue) / COUNT(DISTINCT dc.customer_id), 2) AS revenue_per_customer
FROM fact_events f
JOIN dim_customer dc ON f.customer_key = dc.customer_key
WHERE f.revenue IS NOT NULL
  AND dc.is_current = true
GROUP BY dc.segment
ORDER BY total_revenue DESC;`,
      expectedColumns: ["segment", "customer_count", "total_revenue", "revenue_per_customer"],
      expectedRows: [
        { segment: "professional", customer_count: 5, total_revenue: 595.00, revenue_per_customer: 119.00 },
        { segment: "enterprise", customer_count: 3, total_revenue: 497.00, revenue_per_customer: 165.67 },
        { segment: "starter", customer_count: 3, total_revenue: 347.00, revenue_per_customer: 115.67 },
        { segment: "strategic", customer_count: 1, total_revenue: 199.00, revenue_per_customer: 199.00 },
      ],
      orderMatters: true,
    },
    {
      id: "cf-10",
      title: "Incremental load: new events since checkpoint",
      titleFr: "Chargement incr\u00e9mental : nouveaux \u00e9v\u00e9nements depuis le checkpoint",
      stakeholder: "Am\u00e9lie",
      stakeholderRole: "Senior Data Engineer",
      difficulty: "hard",
      description:
        "Am\u00e9lie (Senior DE) is building an incremental load pattern. The last successful pipeline run processed events up to 2024-04-01 (inclusive). Write a query that identifies all events ingested after this checkpoint date, grouped by ingestion_date. Show the ingestion date, total event count, valid count, and invalid count. Order chronologically.",
      descriptionFr:
        "Am\u00e9lie (DE Senior) construit un pattern de chargement incr\u00e9mental. La derni\u00e8re ex\u00e9cution r\u00e9ussie du pipeline a trait\u00e9 les \u00e9v\u00e9nements jusqu'au 2024-04-01 (inclus). \u00c9cris une requ\u00eate qui identifie tous les \u00e9v\u00e9nements ingr\u00e9s apr\u00e8s cette date de checkpoint, group\u00e9s par ingestion_date. Affiche la date d'ingestion, le total d'\u00e9v\u00e9nements, le nombre de valides et le nombre d'invalides. Trie chronologiquement.",
      hint: "Filter WHERE ingestion_date > '2024-04-01'. Use COUNT(*) FILTER (WHERE is_valid = true/false) for valid/invalid counts.",
      hintFr: "Filtre WHERE ingestion_date > '2024-04-01'. Utilise COUNT(*) FILTER (WHERE is_valid = true/false) pour les comptes valides/invalides.",
      solutionQuery: `SELECT
  ingestion_date,
  COUNT(*) AS event_count,
  COUNT(*) FILTER (WHERE is_valid = true) AS valid_count,
  COUNT(*) FILTER (WHERE is_valid = false) AS invalid_count
FROM raw_events
WHERE ingestion_date > '2024-04-01'
GROUP BY ingestion_date
ORDER BY ingestion_date;`,
      expectedColumns: ["ingestion_date", "event_count", "valid_count", "invalid_count"],
      expectedRows: [
        { ingestion_date: "2024-04-02", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-04-03", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-04-05", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-04-08", event_count: 1, valid_count: 0, invalid_count: 1 },
        { ingestion_date: "2024-04-10", event_count: 2, valid_count: 2, invalid_count: 0 },
        { ingestion_date: "2024-04-12", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-04-15", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-05-01", event_count: 2, valid_count: 2, invalid_count: 0 },
        { ingestion_date: "2024-05-02", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-05-03", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-05-05", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-05-08", event_count: 1, valid_count: 0, invalid_count: 1 },
        { ingestion_date: "2024-05-10", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-05-12", event_count: 1, valid_count: 1, invalid_count: 0 },
        { ingestion_date: "2024-05-15", event_count: 1, valid_count: 0, invalid_count: 1 },
        { ingestion_date: "2024-05-18", event_count: 1, valid_count: 1, invalid_count: 0 },
      ],
      orderMatters: true,
    },
  ],
};
