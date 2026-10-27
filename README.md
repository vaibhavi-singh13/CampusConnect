# CampusConnect 

## About the Project

CampusConnect is a college community platform designed to help students
connect, communicate, and share useful information in one place. It
brings together student discovery, community posts, academic resources,
and direct messaging in a single website.

## Problem Statement

College students often receive information through many different
channels, such as group chats, social media, classroom conversations,
and separate resource-sharing platforms. Important updates and
opportunities can get missed, and students may find it difficult to
discover peers with similar interests or find the resources they need.

CampusConnect addresses this problem by providing a centralized digital
space for students to interact, share information, and build connections
within their college community.

## Project Goals

-   Make it easier for students to discover and connect with other
    students.
-   Provide a place to share campus updates and useful posts.
-   Make academic resources easier to share and find.
-   Enable direct communication between students.
-   Offer a comfortable interface with dark mode and larger text.

## Key Features

### Student Registration and Login

Students can create an account and access the platform.

### Student Discovery

Students can browse and discover other members of the community, helping
them connect with peers.

### Student-to-Student Chat

Students can communicate directly with other students through the
website.

### Community Posts

Students can publish updates and information relevant to their campus
community.

### Academic Resource Sharing

Students can share and discover study materials and other helpful
learning resources.

### Dark Mode and Readability

The interface includes a dark mode and a larger-text option to make the
experience more comfortable and readable.

## Technologies Used

### Frontend

-   **React** --- builds the interactive user interface and reusable
    page components.
-   **Vite** --- supports frontend development and creates the
    production build.
-   **CSS** --- controls layout, styling, and the visual appearance of
    the interface.
-   **Axios** --- sends requests from the frontend to backend APIs and
    receives their responses.

### Backend

-   **Node.js** --- runs the server-side JavaScript application.
-   **Express.js** --- defines API routes and handles requests from the
    frontend.
-   **MongoDB** --- stores application data such as user information and
    community content.
-   **Mongoose** --- helps define data schemas and interact with
    MongoDB.
-   **JWT and bcrypt** --- support token-based authentication and
    password hashing where configured in the application.

### Deployment and Version Control

-   **Vercel** --- hosts the frontend website.
-   **Render** --- hosts the backend API.
-   **GitHub** --- stores the project's source code and tracks changes.

## How the Application Works

CampusConnect follows a client-server architecture.

1.  A student interacts with the website through the React interface.
2.  Axios sends the required HTTP request to the backend.
3.  Express receives the request and runs the relevant application
    logic.
4.  The backend validates the request and uses Mongoose to read or
    update data in MongoDB when needed.
5.  The backend sends a response to the frontend, which updates the page
    for the student.

This structure separates the user interface, application logic, and data
storage, making the project easier to maintain and extend.

## Project Architecture

**Student → React Frontend → Axios API Request → Express/Node.js Backend
→ Mongoose → MongoDB**

The frontend and backend are deployed separately: Vercel serves the
website, while Render runs the API.

## Live Project

-   **Website:** [https://campus-connect-puce-chi.vercel.app/](https://campus-connect-puce-chi.vercel.app/)
-   **Backend health check:**
    [https://campusconnect-api-ts7y.onrender.com/api/health](https://campusconnect-api-ts7y.onrender.com/)
-   **Source code:** [https://github.com/vaibhavi-singh13/CampusConnect](https://github.com/vaibhavi-singh13/CampusConnect/tree/main)
-   **Demo Video:** https://drive.google.com/file/d/1yBfNFUmoq2ZA-DE8pOzkNcoFSYV4ftT7/view?usp=sharing

## Benefits

-   Brings several student-community activities together in one place.
-   Helps students discover peers and communicate with them.
-   Encourages sharing of useful campus information and academic
    resources.
-   Provides a more convenient way to access community content.
-   Includes interface options intended to improve comfort and
    readability.

## Future Scope

CampusConnect could be extended with features such as real-time chat,
notifications, richer student profiles, interest-based communities,
event listings, and improved resource discovery.

## Conclusion

CampusConnect aims to make college life more connected by giving
students a shared online space to communicate, discover peers, and
exchange information. By combining a React frontend, an Express and
Node.js backend, and MongoDB for data storage, the project provides a
foundation that can be expanded with additional campus-focused features.
