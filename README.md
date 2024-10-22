# MERN GraphQL SocialAuth

**MERN-GraphQL-SocialAuth** is a project that adds social authentication to a MERN stack application using **Passport.js**. It integrates **Node.js**, **MongoDB**, **TypeORM**, **TypeGraphQL**, and **React.js** to provide a full-stack solution for social login (Google, Facebook, etc.).

## Features

- **MERN Stack**:
  - **MongoDB**: Database for storing user information.
  - **Express.js & Node.js**: Backend server and API routes.
  - **React.js**: Frontend for a seamless user interface.
  - **GraphQL**: Type-safe queries and mutations via **TypeGraphQL**.
  - **TypeORM**: Object-Relational Mapping for managing MongoDB.

- **Social Authentication**:
  - Social login via **Passport.js** for providers like Google, Facebook, etc.
  - Token-based authentication for secure access.

- **GraphQL API**:
  - Built with **TypeGraphQL**.
  - Full CRUD support for user authentication.
  - Secured endpoints requiring social login.

- **Frontend**:
  - React-based UI for login and registration.
  - Integration with **Apollo Client** for GraphQL queries and mutations.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) (or npm)
- A social authentication provider (e.g., Google, Facebook)

## Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/mern-graphql-socialauth.git
cd mern-graphql-socialauth

### 2. Install Dependencies:

```bash
# Install server dependencies
cd server
yarn install

# Install client dependencies
cd ../client
yarn install

### 3. Set up environment variables:

Create a `.env` file in the `server` directory and add the following:

```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/socialauth-db
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

### 4. Run the development servers:

#### Backend:

```bash
cd server
yarn dev
```

#### Frontend:

```bash
cd client
yarn start
```

### 5. Access the app:

Open your browser and go to `http://localhost:3000`.
