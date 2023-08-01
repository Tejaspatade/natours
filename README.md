# Natours - Tours Management API

![Natours Logo](<![logo-green](https://github.com/Tejaspatade/natours/assets/70337689/83574d6e-003b-47ac-901f-856da27d6bd6)>)

**Natours** is a backend application developed with Node.js, Express, MongoDB, and Mongoose. It provides a complete set of RESTful API routes for managing tours offered by a company. The application also implements JWT-based user authentication to ensure secure access to protected routes.

## Key Features

-   **Manage Tours**: Natours offers a robust set of API endpoints to create, read, update, and delete tours. Tour information such as name, description, price, duration, and location can be easily managed.

-   **User Authentication**: Secure your application with JWT-based user authentication. Users can sign up, log in, and receive a token for accessing protected routes.

-   **Authorization**: Ensure that only authenticated users with the appropriate permissions can access sensitive operations like creating, updating, or deleting tours.

-   **Validation**: Input data is carefully validated, and users receive appropriate error messages if they provide invalid or incomplete data.

-   **Error Handling**: The application handles errors gracefully and provides detailed error messages for debugging.

-   **Database Integration**: Natours uses MongoDB as its database, and Mongoose is used to model the data and interact with the database.

-   **GeoSpatial Queries**: The application supports geoSpatial queries, allowing users to find tours within a certain distance from a specified location.

-   **Advanced Filtering**: Users can filter tours based on various parameters like difficulty level, price range, duration, and more using some custom routes defined as a short-hand filter.

## Getting Started

### Prerequisites

-   Node.js (at least version 18.X.X)
-   MongoDB (at least version X.X.X)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Tejaspatade/natours.git
    ```

2. Change directory to the project folder:

    ```bash
    cd natours
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables: Create a `.env` file based on `.env.example` and configure your environment variables.

5. Start the application:
    ```bash
    npm start
    ```

### Deployed on AWS EC2

The Natours API is hosted on an AWS EC2 instance. You can access the API using the following URL:

[http://15.206.92.170:3000/api/v1/](http://15.206.92.170:3000/api/v1/)

### API Documentation

For API documentation and usage details, refer to the [API Documentation](https://documenter.getpostman.com/view/25621285/2s93mBwyri) file.

### Testing with Postman

I extensively used Postman for testing and configuring the API routes. The Postman collection and environment files are available in the repository. You can import these files into your Postman to interact with the API and test various endpoints.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, please feel free to submit a pull request.

-   Email: tjspatade@gmail.com
-   LinkedIn: linkedin.com/tejpatade

Thanks for visiting Natours! We hope you enjoy using Natours. Happy Touring!!😉
