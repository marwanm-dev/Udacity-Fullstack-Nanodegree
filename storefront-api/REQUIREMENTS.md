# API Requirements

## API Endpoints
### Users
- Index: `users/` [GET] (token)
    curl -i http://localhost:3000/api/users

- Show: `users/:id` [GET] (token)
    curl -i http://localhost:3000/api/users/:id

- Create: `users/` [POST] (token)
    curl -i -d '{"username": "username", "firstname": "firstname", "lastname": "lastname", password": "password"}' http://localhost:3000/api/users

- Delete: `users/:id` [DELETE] (token)
    curl -i http://localhost:3000/api/users/:id

- Update: `users/:id` [PUT] (token)
    curl -i -X PUT -d '{"username": "username", "firstname": "firstname", "lastname": "lastname", "password": "password"}' http://localhost:3000/api/users/:id

- Login: `users/login` [POST]
    curl -i -d '{"username": "username", "password": "password"}' http://localhost:3000/api/users/login

### Products
- Index: `products` [GET]
    curl -i http://localhost:3000/api/products

- Show: `products/:id` [GET]
    curl -i http://localhost:3000/api/products/:id

- Create: `products` [POST] (token)
    curl -i -d '{"name": "name", "price": "price"}' http://localhost:3000/api/products

- Delete: `products/:id`  [DELETE]
    curl -i http://localhost:3000/api/products/:id

### Orders
- Index: `orders/:user_id` [GET] (token)
    curl -i http://localhost:3000/api/orders/:user_id

- Current Order by user: `orders/current/:user_id` [GET] (token)
    curl -i http://localhost:3000/api/orders/current/:user_id

- Active Orders by user: `orders/active/:user_id` [GET] (token)
    curl -i http://localhost:3000/api/orders/active/:user_id

- Create: `orders` [POST] (token)
    curl -i -d '{"user_id": "user_id","product_id":"product_id","status":"active"}' http://localhost:3000/api/products

- Update order's status: `order/:id` [PUT] (token)
    curl -i PUT http://localhost:3000/api/order/:id

- Delete: `orders/:id` [DELETE] (token)
    curl -i http://localhost:3000/api/orders/:id

## Data Shapes
### User
- id
- username
- firstname
- lastname
- password

### Product
- id
- name
- price

### Order
- id
- user_id
- status of order (active or complete)

### Order Products
- id
- quantity of each product in the order
- id of product in the order
- id of order

## Data Schemas
### User
```sql
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

### Product
```sql
CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INT NOT NULL
);
```

### Order
```sql
DROP TYPE IF EXISTS mood cascade;
CREATE TYPE mood AS ENUM('active', 'complete');
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  status mood NOT NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

### Order Products
```sql
CREATE TABLE order_products(
  id SERIAL PRIMARY KEY,
  quantity INT,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```