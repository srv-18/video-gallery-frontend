# Video Gallery App Frontend

A modern, responsive frontend for the Video Gallery application built with React, TypeScript, and Vite.

## Features

- 🎨 Modern UI with Tailwind CSS
- 📱 Fully Responsive Design
- 🎥 Video Playback with React Player
- 🔐 Protected Routes
- 📤 Video Upload with Preview
- ✏️ Edit Video Details
- 🗑️ Delete Videos
- 👤 User Profile Management
- 🔍 Search Videos
- 📦 State Management with Zustand

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **HTTP Client**: Axios
- **Video Player**: React Player
- **Icons**: Lucide React
- **UI Components**: Custom components with Tailwind

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd video-gallery-app-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
VITE_BACKEND_URL=http://localhost:3000/api/v1
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   └── layout/         # Layout components
├── pages/              # Page components
│   ├── Auth/          # Authentication pages
│   ├── Dashboard/     # Main dashboard
│   └── Home/          # Landing page
├── store/              # Zustand store
│   ├── authStore.ts   # Authentication state
│   └── videoStore.ts  # Video state
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Key Components

### Authentication
- Sign In
- Sign Up
- Protected Routes

### Dashboard
- Video Grid
- Video Upload Form
- User Profile
- Video Management (Edit/Delete)

### Video Player
- Custom video controls
- Thumbnail preview
- Responsive layout

## State Management

The application uses Zustand for state management with two main stores:

### Auth Store
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}
```

### Video Store
```typescript
interface VideoState {
  videos: Video[];
  userVideos: Video[];
  setVideos: (videos: Video[]) => void;
  addVideo: (video: Video) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
}
```

## API Integration

The frontend communicates with the backend through the following endpoints:

- Authentication
  - `POST /auth/signin`
  - `POST /auth/signup`
  - `POST /auth/signout`

- Videos
  - `GET /video` - Get all videos
  - `POST /video/upload` - Upload video
  - `PUT /video/:id` - Update video
  - `DELETE /video/:id` - Delete video
  - `POST /video/search` - Search videos

- User
  - `GET /user/video` - Get user's videos
  - `PUT /user` - Update user profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
