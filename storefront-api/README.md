# Storefront Backend Project

## Setup

1. 'npm install' to install all the required dependecies.

2. 'npm run start' to build and start the app at the backend port

3. Create a .env file and fill it with the appropriate variables as shown in the .env-example

4.  In psql run the following commands:
    - To connect to the default postgres database as the server's root user 
      psql -U postgres
    - To create databases
      CREATE DATABASE storefront_api_dev;
      CREATE DATABASE storefront_api_test;
    - To create a user
      CREATE USER storefront_api_user WITH PASSWORD 'password123';
    - To connect to the databases and grant all privileges
       For dev database
        \c storefront_api_dev
        GRANT ALL PRIVILEGES ON DATABASE storefront_api_dev TO storefront_api_user;
        GRANT ALL ON SCHEMA public TO storefront_api_user;
      For test database
        \c storefront_api_test
        GRANT ALL PRIVILEGES ON DATABASE storefront_api_test TO storefront_api_user;
        GRANT ALL ON SCHEMA public TO storefront_api_user;

5. Migrations
    - To Migrate the tables up
        npm run db:up
    - To Migrate the tables down
        npm run db:down

## Ports

- Backend at http://localhost:3000

- Database at http://localhost:5432