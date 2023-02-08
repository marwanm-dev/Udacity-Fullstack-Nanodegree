CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INT NOT NULL
);

DROP TYPE IF EXISTS mood cascade;
CREATE TYPE mood AS ENUM('active', 'complete');

CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  status mood NOT NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE order_products(
  id SERIAL PRIMARY KEY,
  quantity INT,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
);