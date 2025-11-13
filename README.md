# Full Portfolio Hub

A modern, full-stack portfolio website built with React, TypeScript, Express, and MongoDB. Features an admin dashboard for managing projects, certifications, hackathons, and about information.

## Features

- 🎨 Modern, responsive UI with dark theme
- 📱 Mobile-friendly design
- 🔐 Admin authentication system
- 📊 Admin dashboard for content management
- 🎯 Projects showcase
- 🏆 Certifications display
- 🎪 Hackathons timeline
- 📝 About section with skills and education
- 📧 Contact form
- ☁️ Cloudinary integration for image storage
- 🚀 Deployable on Vercel

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (with simple storage fallback)
- **Authentication**: Express Sessions
- **Deployment**: Vercel
- **Image Storage**: Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or use simple storage)
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/atharv_newwst-portfolio.git
cd atharv_newwst-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
STORAGE_TYPE=mongodb
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_random_secret_key
NODE_ENV=development
```

4. Create an admin user:
```bash
npm run create-admin-user
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── api/                 # Vercel serverless functions
├── client/             # React frontend application
│   └── src/
│       ├── components/ # React components
│       ├── pages/      # Page components
│       └── lib/        # Utility functions
├── server/             # Express server (for local development)
│   ├── routes.ts       # API routes
│   └── models/         # Database models
└── vercel.json         # Vercel configuration
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STORAGE_TYPE` | Storage type (`mongodb` or `simple`) | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes (if using MongoDB) |
| `SESSION_SECRET` | Secret key for sessions | Yes |
| `NODE_ENV` | Environment (`development` or `production`) | No |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:static` - Build static files for Vercel
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run create-admin-user` - Create admin user

## Admin Dashboard

Access the admin dashboard by clicking the admin icon in the navbar. Use your admin credentials to:

- Manage projects
- Manage certifications
- Manage hackathons
- Update about section
- Upload images to Cloudinary

## License

MIT

## Author

Atharv

