# HabitHub - Personal Habit Tracker

A modern, full-stack habit tracking application built with React, Express, PostgreSQL, and TypeScript.

## Features

- 🎯 **Habit Management** - Create, track, and organize habits
- 📊 **Visual Analytics** - Track your progress with charts and heatmaps
- 🏷️ **Categories** - Organize habits into custom categories
- ✅ **Daily Tracking** - Mark habits as completed each day
- 📈 **Streak Tracking** - Monitor your consistency
- 🎨 **Modern UI** - Beautiful interface with dark mode support
- 🔐 **Secure Authentication** - Email/password authentication with sessions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast builds
- TailwindCSS for styling
- shadcn/ui component library
- TanStack React Query for state management
- Wouter for routing
- Recharts for data visualization

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- Drizzle ORM
- Passport.js for authentication
- Express Session with PostgreSQL store

### Security
- Helmet for security headers
- Rate limiting
- bcryptjs for password hashing
- CORS protection
- Input validation with Zod

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd HabitHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   nano .env
   ```

   Required variables:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/habithub
   SESSION_SECRET=your-secure-random-string
   NODE_ENV=development
   PORT=5000
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Production Deployment

For detailed production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment to VPS

1. **Prepare your VPS**
   - Ubuntu 20.04+ recommended
   - Point your domain to the VPS IP
   - Set up Cloudflare DNS

2. **Upload code to VPS**
   ```bash
   scp -r /path/to/HabitHub root@your-vps-ip:/tmp/
   ```

3. **Run deployment script**
   ```bash
   ssh root@your-vps-ip
   cd /tmp/HabitHub
   chmod +x deploy.sh
   sudo ./deploy.sh
   ```

4. **Configure SSL with Cloudflare** (see DEPLOYMENT.md for details)

## Project Structure

```
HabitHub/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── contexts/    # React Context providers
│   │   └── lib/         # Utility functions
│   └── public/          # Static assets
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── auth.ts          # Authentication logic
│   ├── storage.ts       # Database operations
│   └── db.ts            # Database connection
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema
├── .env.example         # Environment variables template
├── nginx.conf           # Nginx configuration
├── ecosystem.config.js  # PM2 configuration
├── deploy.sh            # Deployment script
└── DEPLOYMENT.md        # Deployment guide
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in
- `POST /api/auth/logout` - Log out
- `GET /api/auth/user` - Get current user

### Habit Endpoints

- `GET /api/habits` - Get all habits
- `GET /api/habits/:id` - Get a specific habit
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/:id` - Update a habit
- `DELETE /api/habits/:id` - Delete a habit
- `POST /api/habits/:id/archive` - Archive a habit
- `POST /api/habits/:id/unarchive` - Unarchive a habit

### Category Endpoints

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Completion Endpoints

- `GET /api/completions` - Get all completions
- `GET /api/habits/:id/completions` - Get completions for a habit
- `POST /api/completions` - Mark habit as completed
- `DELETE /api/completions/:id` - Delete a completion

### Statistics Endpoints

- `GET /api/stats` - Get user statistics

## Database Schema

### Users Table
- Email/password authentication
- Profile information
- Created/updated timestamps

### Categories Table
- Custom habit categories
- Color and icon customization
- User-specific

### Habits Table
- Habit name and description
- Frequency settings (daily/weekly)
- Category association
- Archive functionality

### Habit Completions Table
- Track daily completions
- Notes for each completion
- Unique constraint per habit per day

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push schema changes to database

### Database Migrations

When you make changes to the schema:

```bash
npm run db:push
```

This will synchronize your database with the schema defined in `shared/schema.ts`.

### Testing Locally

1. Set up a local PostgreSQL database:
   ```bash
   createdb habithub
   ```

2. Update `.env` with local database URL:
   ```env
   DATABASE_URL=postgresql://localhost:5432/habithub
   ```

3. Push schema:
   ```bash
   npm run db:push
   ```

4. Start dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `SESSION_SECRET` | Secret for signing sessions | Yes | - |
| `NODE_ENV` | Environment (development/production) | No | development |
| `PORT` | Server port | No | 5000 |
| `APP_URL` | Application URL | No | http://localhost:5000 |

## Security Features

- ✅ Password hashing with bcrypt
- ✅ Secure session management
- ✅ Rate limiting on API endpoints
- ✅ Security headers with Helmet
- ✅ Input validation with Zod
- ✅ SQL injection protection with Drizzle ORM
- ✅ XSS protection
- ✅ CSRF protection via SameSite cookies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Database connection errors**
- Verify DATABASE_URL is correct
- Ensure database server is running
- Check firewall rules

**Build errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`

**Authentication issues**
- Verify SESSION_SECRET is set
- Check cookie settings in browser
- Ensure HTTPS in production

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md).

For bugs or feature requests, please open an issue on GitHub.

---

**Built with ❤️ using modern web technologies**
