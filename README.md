<h1 align="center">Natours - Tours App API</h1>

<p align="center">
  <img src="https://github.com/Tejaspatade/natours/assets/70337689/c8f92c47-979c-4002-a44e-5c3baae96846" alt="Natours Logo">
</p>

---

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

The Natours API is hosted on an **AWS EC2** instance from this repository. You can access the API using the following URL:

[https://free.natours.live/api/v1/](https://free.natours.live/api/v1/)

Note: Also comprises of **NGINX** serving as a proxy server relaying the HTTP Requests to the backend runnning behind this proxy firewall. Also configured to a **custom domain**, and **SSL encrypted certificate** for access over **HTTPS**.

### API Documentation

For API documentation and usage details, refer to the [API Documentation](https://documenter.getpostman.com/view/25621285/2s93mBwyri) file.

### Testing with Postman

I extensively used Postman for testing and configuring the API routes. The Postman collection and environment files are available in the repository. You can import these files into your Postman to interact with the API and test various endpoints.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, please feel free to submit a pull request.

-   Email: tjspatade@gmail.com
-   LinkedIn: linkedin.com/tejpatade

Thanks for visiting Natours! We hope you enjoy using Natours. Happy Touring!!😉
