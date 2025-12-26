# Full Stack Quick-commerce Application

A full-stack Quick-commerce application inspired by BlinkIt, developed using **Node.js**, **Express.js**, **MongoDB Atlas**, and **React.js**. This project demonstrates a functional online grocery delivery platform with features like user authentication, product listing, cart management, and order processing.

---

## Table of Contents

- [Features](#features)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Tech Stack](#tech-stack)
<!-- - [Screenshots](#screenshots) -->
<!-- - [License](#license) -->

---

## Features

- **User Authentication**: Secure login and signup functionality using JWT.
- **Product Management**: Browse, search, and manage groceries.
- **Image Upload**: Product images uploaded and stored in **Cloudinary**.
- **Email Notifications**: User notifications via **Resend**.
- **File Handling**: Efficient image/file uploads with **Multer**.
- **Cart Management**: Add, update, or remove items in the cart.
- **Order Processing**: Place orders and view order history.
- **Admin Dashboard**: Manage products add and remove them.
- **Responsive Design**: Styled using **Tailwind CSS** for a modern and consistent UI.

---

## Tech Stack

### Frontend

- **React.js**
- **Tailwind CSS**
- **Axios**

### Backend

- **Node.js**
- **Express.js**

### Database

- **MongoDB Atlas**

### Other Tools

- **Cloudinary**: Image storage and management
- **Resend**: Email notifications
- **Multer**: File uploads
- **JWT**: Authentication

---

## Demo

![Demo 1](./Demo%201.gif)
<br/>
![Demo 2](./Demo%202.gif)

---

## Installation and Setup

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud Database)
- A package manager: `npm`
- Git

### Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/sspabhishek/quick_commerce.git
    ```

2. **Install Backend Dependencies**  
   Navigate to the `backend` folder and install the dependencies.  
    ```bash
    cd server
    npm install
    ```

3. **Install Frontend Dependencies**  
   Navigate to the `frontend` folder and install the dependencies.  
    ```bash
    cd client
    npm install
    ```

4. **Setup MongoDB Atlas**  
   - Create a MongoDB Atlas cluster and connect it to the application.
   - Configure your database connection string in the `.env` file (see below).

---

## Environment Variables

### Backend

Create a `.env` file in the `server` directory and configure the following variables:

```env
FRONTEND_URL=""
MONGO_URI=<Your MongoDB Atlas URI>
SECRET_KEY_ACCESS_TOKEN=<Your Access Token Secret>
SECRET_KEY_REFRESH_TOKEN=<Your Refresh Token Secret>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
RESEND_API_KEY=<Your Resend API Key>
STRIPE_SECRET_KEY=<Your Stripe Secret Key>
```

### Frontend

Create a `.env` file in the `client` directory and configure the following variables:

```env
VITE_API_URL=<Your Backend API URL>
VITE_STRIPE_PUBLIC_KEY=<Your Stripe Public Key>
```

## Test Credentials

For testing payments, you can use the following test card details:

- **Card Number**: `4242424242424242`
- **Expiry Date**: `01/2028`
- **CVV**: `789`

## Future Enhancements
- Enhance the admin dashboard with analytics.
- Optimize for mobile devices.
- Add real-time order tracking with WebSockets.


## Contributing
Contributions are welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch**
   ```bash
      git checkout -b feature-branch
   ```
3. **Commit your changes**
   ```bash
      git commit -m "Add new feature"
   ```
4. **Push to the branch**
   ```bash
      git push origin feature-branch
   ```
5. **Open a pull request.**

