DROP TABLE IF EXISTS items;
CREATE TABLE items

(
  _id VARCHAR(6) PRIMARY KEY,
  seller VARCHAR(50),
  rating DOUBLE PRECISION,
  sales INT,
  employee VARCHAR(50),
  employee_position VARCHAR(50),
  employee_ava VARCHAR(70),
  policy_updated DATE,
  policy_acceptReturn BOOLEAN,
  policy_allowExchange BOOLEAN,
  policy_types VARCHAR [],
  item VARCHAR(50),
  item_tags VARCHAR [],
  price DOUBLE PRECISION,
  item_availability BOOLEAN,
  item_description TEXT,
  selector JSON,
  shipping_origin DOUBLE PRECISION[]
);

DROP USER IF EXISTS student;
CREATE USER student WITH PASSWORD 'student';
GRANT SELECT, UPDATE, INSERT ON TABLE items TO student;
