🌱 CareConnect — Social Development Events Platform

CareConnect is a community-driven social development and event management platform that connects people with meaningful community service opportunities. It enables users to discover upcoming events, organize social initiatives, participate in community programs, and contribute to building a better society.

From winter clothes distribution and blanket donations to community cleanups and tree plantation campaigns, CareConnect makes it easier for people to connect, collaborate, and create a positive social impact.

🌐 Live Website

- Live Site: [Add Your Deployed Website URL]
- Client Repository: [Add Your Client GitHub Repository URL]
- Server Repository: [Add Your Server GitHub Repository URL]

🎯 Project Purpose

The main objective of CareConnect is to encourage social responsibility by making community service opportunities easier to discover and manage.

The platform provides a convenient way for event organizers to publish social development events and for community members to join activities that make a meaningful difference.

✨ Key Features

- User Authentication: Register and log in using email and password, with Google or GitHub authentication if configured.
- Community Event Creation: Authenticated users can create events with a title, description, event type, thumbnail image URL, location, and event date.
- Upcoming Events: Browse upcoming community events dynamically retrieved from the database.
- Event Details: View complete event information before deciding to participate.
- Join Events: Authenticated users can join available events, with participation information stored in the database.
- Manage Events: Organizers can view, update, and delete events they have created.
- Joined Events: View events joined by the logged-in user, organized by event date.
- Protected Routes: Restrict access to private pages such as Create Event, Manage Events, and Joined Events.
- Form Validation: Validate authentication, event creation, and event update forms.
- Profile Management: Access the profile page to manage personal information, if implemented.
- Responsive Design: Optimized layouts for mobile phones, tablets, laptops, and desktop computers.
- Light and Dark Themes: Switch between light and dark modes if enabled in the application.
- Community Gallery: Showcase photographs of community service and social development activities.
- Newsletter Section: Provide a dedicated section for community updates and announcements.
- User Feedback: Display meaningful success and error messages for important actions.

🛠️ Technology Stack

Frontend

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- UI components and libraries configured in the project

Authentication

- Better Auth
- Email and password authentication
- Google or GitHub OAuth, if configured

Backend and Database

- Node.js
- Express.js
- MongoDB
- JSON Web Token (JWT)

Tools and Deployment

- Git and GitHub
- Vercel for frontend deployment
- Render for backend deployment

Only technologies actually used in the project should be retained in this section.

📄 Application Pages

Public Pages

- Home Page ("/"): Introduces CareConnect and showcases the banner, features, recent upcoming events, gallery, and newsletter.
- Login ("/login"): Provides the user sign-in interface.
- Sign Up ("/signup"): Allows new users to register.
- Events ("/events"): Event-related page and functionality.
- Upcoming Events ("/upcoming-events"): Displays upcoming community events.

Protected Pages

- Create Event ("/create-event"): Allows authenticated users to create community events.
- Manage Events ("/manage-events"): Allows users to manage their own created events.
- Joined Events ("/joined-events"): Displays events joined by the authenticated user.
- Profile ("/profile"): Provides access to the user's profile functionality.

Dynamic Pages

Event details and other dynamic routes may be implemented within the "events" route directory. Refer to the actual route files for the exact URL patterns.

🗂️ Project Structure

The following structure is based on the project files and folders identified in the development environment.

assignment-8/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── create-event/
│   │   ├── events/
│   │   ├── joined-events/
│   │   ├── login/
│   │   ├── manage-events/
│   │   ├── profile/
│   │   ├── signup/
│   │   ├── upcoming-events/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── Banner.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx
│   │   ├── Navbar.tsx
│   │   ├── Newsletter.tsx
│   │   ├── RecentUpcomingEvents.tsx
│   │   └── UpcomingEvents.tsx
├── .env.local
├── .gitignore
├── AGENTS.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo

🔐 Security and Validation

CareConnect is designed to support secure access to community event management features.

- Private pages should require authentication.
- Users should only be able to update or delete events they created.
- Protected backend APIs should validate JWTs where required.
- Authentication forms should validate required fields and password requirements.
- Event creation and update forms should validate their inputs.
- Event dates must be in the future when creating or updating events.
- Joining an event should require authentication, while viewing public event details should remain accessible to visitors.

📱 Responsive User Experience

CareConnect aims to provide a consistent experience across different screen sizes.

- Mobile: Compact navigation and readable, accessible content.
- Tablet: Flexible layouts and balanced spacing.
- Desktop: Structured event grids and clear visual hierarchy.

Consistent typography, button styles, image dimensions, spacing, and alignment help maintain a unified design throughout the application.

🚀 Getting Started

Prerequisites

Make sure the following tools and services are available:

- Node.js
- npm
- Git
- Access to the required backend API
- MongoDB and authentication configuration, as required by the application

Installation

1. Clone the client repository

git clone YOUR_CLIENT_GITHUB_REPOSITORY_URL

2. Navigate to the project directory

cd assignment-8

3. Install dependencies

npm install

4. Configure environment variables

Create a ".env.local" file in the project root and configure the environment variables required by the application.

For example, if your application uses a backend API URL:

NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL

Use the exact variable names expected by your application. Configure authentication and other required settings as needed. Never commit actual secrets, database credentials, or private OAuth keys to GitHub.

5. Start the development server

npm run dev

6. Open the application

Visit:

http://localhost:3000

🌍 Community Impact

CareConnect supports initiatives such as:

- Winter clothes and blanket distribution
- Tree plantation campaigns
- Neighborhood cleaning programs
- Food and essential-item donations
- Community awareness programs
- Other local social welfare activities

By connecting event organizers with participants, CareConnect helps make community service more accessible and collaborative.

🔮 Future Enhancements

Potential improvements include:

- Event search and category filtering
- Volunteer participation statistics
- Notifications for upcoming joined events
- Improved event recommendations
- Volunteer activity tracking

👨‍💻 Developer

Name: Mahbubur Rahman Munna

Assignment: B14-A08 — Social Development Events Platform

📜 License

This project was developed for educational purposes as part of the B14-A08 assignment.

---

CareConnect — Connect with your community. Care for a better tomorrow. 🌱