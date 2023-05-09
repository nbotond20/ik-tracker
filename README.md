# IK-Tracker

This is a progress tracker for students, studying compouter science at Eötvös Loránd University.

## Demo

You can try the app at https://www.iktracker.com.

## Getting Started

### Prerequisites

To use this project, you need to have the following software installed:

- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [pnpm](https://pnpm.io/installation) (v7 or higher)

### Installation

1. Clone the repository:

   ```bash
   https://github.com/nbotond20/szakdolgozat-t3.git
   ```

2. Create a `.env` file in the root directory of the project and add the following environment variables:

   ```bash
    DATABASE_URL=

    NEXTAUTH_URL=
    NEXTAUTH_SECRET=

    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=

    DISCORD_CLIENT_ID=
    DISCORD_CLIENT_SECRET=

    GOOGLE_CLIENT_SECRET=
    GOOGLE_CLIENT_ID=

    EMAIL_SERVER_USER=
    EMAIL_SERVER_PASSWORD=
    EMAIL_SERVER_HOST=
    EMAIL_SERVER_PORT=
    EMAIL_FROM=

    NEXT_PUBLIC_SOCKET_URL=
    NEXT_PUBLIC_FEATURE_FLAGS_URL=
    NEXT_PUBLIC_SOCKET_SECRET=
   ```

- The `DATABASE_URL` variable should contain the connection string to your database.
- The `NEXTAUTH_URL` variable should contain the URL of your application. (e.g. `http://localhost:3000`)
- The `NEXTAUTH_SECRET` variable should contain a random string.
- The `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` variables should contain the client ID and client secret of your GitHub OAuth application.
- The `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` variables should contain the client ID and client secret of your Discord OAuth application.
- The `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` variables should contain the client ID and client secret of your Google OAuth application.
- The `EMAIL_SERVER_USER` variable should contain the email address of the account that will be used to send emails.
- The `EMAIL_SERVER_PASSWORD` variable should contain the password of the account that will be used to send emails.
- The `EMAIL_SERVER_HOST` variable should contain the host of the email server.
- The `EMAIL_SERVER_PORT` variable should contain the port of the email server.
- The `EMAIL_FROM` variable should contain the email address that will be used to send emails.
- The `NEXT_PUBLIC_SOCKET_URL` variable should contain the URL of the socket server. (optional)
- The `NEXT_PUBLIC_FEATURE_FLAGS_URL` variable should contain the URL of the feature flags server. (optional)
- The `NEXT_PUBLIC_SOCKET_SECRET` variable should contain a random string. (optional)

3. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the App

To run the app in development mode, use the following command:

```bash
pnpm dev
```

This will start the server at http://localhost:3000.

## Project Structure (auto-generated)

![Visualization of the codebase](./diagram.svg)
