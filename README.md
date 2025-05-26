# 🌱📈🎯 Growth Tracker App

Welcome to the Growth Tracker App! This project is a comprehensive personal growth and productivity platform designed to empower users to set meaningful goals, cultivate positive habits, efficiently manage tasks, and connect with a supportive community. By integrating elements of gamification and social interaction, the app aims to make personal development engaging and rewarding. Whether you're looking to build new routines, achieve ambitious targets, or simply stay organized, the Growth Tracker App provides the tools and insights you need to succeed.

The Growth Tracker App is more than just a simple tracker; it's a holistic platform built to support your journey towards self-improvement. It provides a centralized place to define what success means to you, break down large aspirations into manageable steps, and build consistent routines that lead to lasting change. The gamified elements, such as achievements and leaderboards, add a layer of motivation and friendly competition, while the social features allow you to share your progress and draw inspiration from others. The integrated analytics provide valuable insights into your patterns and progress, helping you make informed decisions about your personal development strategy.

Built with a modern and robust tech stack, the application leverages the power of Next.js for a fast and scalable frontend, tRPC for type-safe API interactions, Supabase for authentication and database management, and Convex for real-time data synchronization and backend logic. This combination ensures a performant, secure, and highly interactive user experience.

## ✨ Features

The Growth Tracker App comes packed with features to support your personal development journey:

-   **🎯 Goal Setting & Tracking:**
    -   Define SMART goals with customizable categories (e.g., Health, Career, Learning).
    -   Break down large goals into smaller, actionable milestones.
    -   Track progress towards your goals with visual indicators and completion percentages.
    -   Receive personalized insights and recommendations based on your goal progress and historical data.
-   **✅ Habit Tracking:**
    -   Create and monitor daily, weekly, or custom habits (e.g., Exercise, Reading, Meditation).
    -   Set reminders and schedule habits for specific times.
    -   Visualize habit consistency with a built-in calendar view and streak counter.
    -   Analyze habit statistics to understand your consistency and identify areas for improvement.
-   **📅 Task Management:**
    -   Organize tasks with due dates, priorities, and tags.
    -   Create daily task lists and manage your workload effectively.
    -   Integrate tasks with your goals and habits for a unified workflow, ensuring your daily actions contribute to your larger objectives.
-   **🏆 Gamification:**
    -   Earn achievements and badges for completing goals, maintaining habits, and reaching milestones.
    -   Compete with friends and other users on leaderboards based on various metrics (e.g., habits completed, goals achieved).
    -   Unlock rewards and virtual items as you progress through the app.
-   **🤝 Social Features:**
    -   Connect with friends and see their progress and achievements in a dynamic activity feed.
    -   Participate in upcoming challenges with the community to stay motivated and engaged.
    -   Share your achievements and milestones with friends to celebrate successes and inspire others.
-   **📊 Analytics:**
    -   Detailed dashboards showing your overall progress overview, including completed goals, habit streaks, and task completion rates.
    -   Category breakdowns of goals and tasks to understand where you're focusing your energy.
    -   Cohort analysis and conversion funnels (Admin view) to track user engagement and feature adoption.
    -   In-depth reports on goal completion rates and habit consistency over time.
    -   Analysis of productivity trends and user engagement metrics to identify patterns and optimize your routine.
-   **� Notifications:**
    -   Receive timely reminders for upcoming tasks and scheduled habits.
    -   Get notified about social interactions, such as friend requests, likes, and comments.
    -   Secure user registration and login powered by Supabase Auth.
    -   Password reset functionality.
-   **⚙️ Admin Panel:**
    -   Tools for administrators to manage users, achievements, and challenges.
    -   View overall platform statistics and user engagement data.
-   **📱 Progressive Web App (PWA):**
    -   Installable on various devices for a native-like experience.
    -   Offline sync capabilities.
    -   Push notifications.

## 📁 File Structure

The project follows a standard Next.js App Router structure with clear separation of concerns:

```
.
├── app/                  # Next.js App Router pages, API routes, and server actions
│   ├── api/              # Backend API endpoints (tRPC, cron jobs, push subscriptions)
│   ├── actions/          # Server-side functions for data mutations
│   ├── (auth)/           # Pages related to authentication (login, reset password)
│   ├── (main)/           # Core application pages (dashboard, goals, habits, social, etc.)
│   ├── admin/            # Admin panel pages
│   ├── analytics/        # Analytics dashboard pages
│   ├── onboarding/       # User onboarding flow pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   ├── manifest.ts       # PWA manifest file
│   ├── page.tsx          # Homepage
│   └── sw.ts             # Service worker registration
├── components/           # Reusable React components
│   ├── achievements/     # Components for achievements features
│   ├── admin/            # Components for the admin panel
│   ├── analytics/        # Components for analytics dashboards
│   ├── auth/             # Components for authentication UI
│   ├── challenges/       # Components for challenges features
│   ├── convex/           # Convex-related components/providers
│   ├── dashboard/        # Components for the user dashboard
│   ├── gamification/     # Components for gamification elements (badges, etc.)
│   ├── goals/            # Components for goal setting and tracking
│   ├── habits/           # Components for habit tracking
│   ├── mobile/           # Components specific to mobile view (bottom nav, sidebar)
│   ├── notifications/    # Components for notifications
│   ├── onboarding/       # Components for the onboarding flow
│   ├── progress/         # Components for progress visualization
│   ├── settings/         # Components for user settings
│   ├── social/           # Components for social features
│   ├── tasks/            # Components for task management
│   ├── ui/               # Shared UI components (likely Shadcn/ui)
│   ├── providers.tsx     # Context providers
│   ├── sidebar.tsx       # Main application sidebar
│   ├── theme-customizer.tsx # Theme customization component
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx  # Theme toggle button
├── convex/               # Convex backend deployment and functions
│   └── _generated/       # Automatically generated Convex code
├── hooks/                # Custom React hooks used across the application
│   ├── use-mobile.tsx    # Hook to detect mobile view
│   ├── use-offline-sync.ts # Hook for PWA offline data synchronization
│   └── use-push-notifications.ts # Hook for handling push notifications
├── lib/                  # Utility functions, database interactions, and API logic
│   ├── actions/          # Shared server action functions
│   ├── hooks/            # Shared custom hooks
│   ├── schemas/          # Zod schemas for data validation
│   ├── supabase/         # Supabase client, server, and database types setup
│   ├── trpc/             # tRPC client, context, and router definitions
│   ├── utils/            # SQL utility files (database functions, schema)
│   └── utils.ts          # General utility functions
├── public/               # Static assets served directly (images, service worker file)
├── styles/               # Additional style files (if any)
├── .env                  # Environment variable template
├── .env.local            # Local environment variables (ignored in git)
├── .gitignore            # Specifies intentionally untracked files
├── bun.lock              # Bun package manager lock file
├── components.json       # Configuration for UI components (e.g., Shadcn/ui)
├── middleware.ts         # Next.js middleware
├── next-env.d.ts         # TypeScript environment definitions for Next.js
├── next.config.mjs       # Next.js configuration file
├── package.json          # Project dependencies and scripts
├── pnpm-lock.yaml        # PNPM package manager lock file (might be vestigial if using bun)
├── postcss.config.mjs    # PostCSS configuration
└── README.md             # Project README file
```

## 🛠️ Setup

To get the Growth Tracker App running locally, follow these steps:

1.  **Clone the repository:**
    If you haven't already, clone the project repository to your local machine.
    ```bash
    git clone [repository_url]
    cd system-sl
    ```
    *(Note: You are currently in the workspace directory `/Users/thraize/Documents/Programming/system-sl`)*

2.  **Install dependencies:**
    The project uses `bun` as the package manager. Ensure you have `bun` installed.
    ```bash
    bun install
    ```
    *(Note: `pnpm-lock.yaml` is present, but `bun.lock` suggests `bun` is the primary package manager)*

3.  **Set up environment variables:**
    Copy the `.env` file to `.env.local` and update the values with your specific credentials for Supabase and Convex.
    ```bash
    cp .env .env.local
    ```
    Edit the `.env.local` file:
    ```
    # Example .env.local content (replace with actual variables)
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
    CONVEX_DEPLOYMENT_URL=YOUR_CONVEX_DEPLOYMENT_URL
    # Add any other necessary environment variables
    ```

4.  **Set up Supabase:**
    -   Create a new project in your Supabase account.
    -   Configure authentication providers as needed.
    -   Apply the database schema. You might find relevant SQL files in `lib/utils/` (e.g., `notifications-table.sql`, `rpc-functions.sql`) that need to be executed in your Supabase SQL editor.
    -   Obtain your Supabase URL and keys and add them to your `.env.local` file.

5.  **Set up Convex:**
    -   Create a new project in your Convex account.
    -   Deploy your Convex functions (located in the `convex/` directory). Refer to the Convex documentation for deployment instructions.
    -   Obtain your Convex deployment URL and add it to your `.env.local` file.

## 🚀 Running the App

To run the application in development mode:

```bash
bun dev
```

This will start the Next.js development server. The app will be accessible at `http://localhost:3000`.

To build the application for production:

```bash
bun run build
```

To start the production server after building:

```bash
bun run start
```

## 🤝 Contributing

We welcome contributions to the Growth Tracker App! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure they adhere to the project's coding standards.
4.  Write tests for your changes (if applicable).
5.  Submit a pull request with a clear description of your changes.

Please refer to the `CONTRIBUTING.md` file (if available) for more detailed contribution guidelines.

## 📄 License

This project is licensed under the [License Name] License. See the `LICENSE` file (if available) for details.

---

Thank you for checking out the Growth Tracker App! We hope it helps you on your personal growth journey.