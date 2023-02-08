# Image-processing-api

## Tech used:

> Frontend

- Html
- Css
- Javascript

> Backend

- Node
- Express
- Jasmine
- Supertest

> Tools

- Eslint
- Prettier
- Sharp

## URLs

> Dev server

- http://localhost:3000

> Images api

- Base_url: /api/images

- Full_image: /api/images?filename={image_name}
              e.g: /api/images?filename=fjord&full=true
- Resized_image: /api/images?filename={image_name}&width={image_width}&height={{image_height}} 
              e.g: /api/images?filename=fjord&width=250&height=250
              
## How to run

- npm run dev - Starts dev server

- npm run build - Builds/Compiles Typescript to Javascript

- npm run lint - Lints all files inside src/ dir

- npm run format - Formats all typescript files inside src/ dir

- npm run test - Run all tests of utils/ and routes/ dirs

## Credit

> Inspired by Udacity
