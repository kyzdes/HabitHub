# HabitHub iOS App

A beautiful, native iOS application for tracking and building better habits.

## Features

✅ **User Authentication** - Secure login and registration
✅ **Habit Management** - Create, edit, and track habits
✅ **Categories** - Organize habits with custom categories
✅ **Daily Tracking** - Mark habits as completed each day
✅ **Statistics** - View progress, streaks, and analytics
✅ **Beautiful UI** - Modern SwiftUI interface with dark mode
✅ **Offline Ready** - Session-based authentication with cookies

## Requirements

- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+
- Backend API running (see main README.md)

## Project Structure

```
HabitHub-iOS/
└── HabitHub/
    ├── HabitHubApp.swift          # App entry point
    ├── ContentView.swift           # Root view
    ├── Models/                     # Data models
    │   ├── User.swift
    │   ├── Habit.swift
    │   ├── Category.swift
    │   ├── HabitCompletion.swift
    │   └── UserStats.swift
    ├── Views/                      # SwiftUI views
    │   ├── Authentication/
    │   ├── Habits/
    │   ├── Categories/
    │   ├── Statistics/
    │   └── Profile/
    ├── ViewModels/                 # State management
    │   ├── AuthenticationViewModel.swift
    │   ├── HabitsViewModel.swift
    │   ├── CategoriesViewModel.swift
    │   └── StatisticsViewModel.swift
    ├── Services/                   # API client
    │   └── APIClient.swift
    ├── Utilities/                  # Helper utilities
    │   ├── ThemeManager.swift
    │   └── Extensions.swift
    └── Resources/                  # Assets and configs
        ├── Assets.xcassets
        └── Info.plist
```

## Getting Started

### 1. Prerequisites

Ensure your backend API is running and accessible. See the main project README for backend setup.

### 2. Open in Xcode

```bash
cd HabitHub-iOS
open HabitHub.xcodeproj
```

Or simply double-click `HabitHub.xcodeproj` in Finder.

### 3. Configure API Endpoint

Open `HabitHub/Services/APIClient.swift` and update the `baseURL`:

```swift
// For production (after VPS deployment)
private let baseURL = "https://yourdomain.com/api"

// For local development
// private let baseURL = "http://localhost:5000/api"

// For testing on physical device with local backend
// private let baseURL = "http://YOUR_COMPUTER_IP:5000/api"
```

### 4. Build and Run

1. Select a simulator or connected device
2. Press `Cmd + R` or click the Play button
3. The app will build and launch

## Development

### Adding New Features

1. **Models**: Add data structures in `Models/`
2. **API Methods**: Extend `APIClient.swift` with new endpoints
3. **ViewModels**: Create state management in `ViewModels/`
4. **Views**: Build UI in `Views/`

### Testing on Physical Device

1. Connect your iPhone
2. Select your device in Xcode
3. Update the team signing in project settings
4. Update `baseURL` to use your computer's local IP
5. Build and run

### Debugging

- View console logs in Xcode's console (Cmd + Shift + Y)
- Use breakpoints for step-by-step debugging
- Network requests are logged automatically

## Architecture

The app follows the **MVVM (Model-View-ViewModel)** pattern:

- **Models**: Pure data structures matching backend schema
- **Views**: SwiftUI views for UI
- **ViewModels**: Observable objects managing state and business logic
- **Services**: API client for network requests

## Key Technologies

- **SwiftUI** - Modern declarative UI framework
- **Async/Await** - Modern concurrency for API calls
- **@Published/@StateObject** - Reactive state management
- **URLSession** - Native networking with cookie support
- **Codable** - JSON encoding/decoding

## API Integration

The app communicates with the backend via REST API:

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/user` - Get current user

### Habits
- `GET /api/habits` - Fetch all habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Categories
- `GET /api/categories` - Fetch categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Completions
- `GET /api/completions` - Fetch completions
- `POST /api/completions` - Mark complete
- `DELETE /api/completions/:id` - Unmark complete

### Statistics
- `GET /api/stats` - Get user statistics

## Customization

### Colors

Edit color assets in `Resources/Assets.xcassets/`:
- `PrimaryColor` - Main brand color (green)
- `SecondaryColor` - Accent color (peach)

### App Icon

Replace `AppIcon.appiconset/Icon-1024.png` with your 1024x1024 icon.

### Bundle Identifier

Update in Xcode project settings:
1. Select project in navigator
2. Go to "Signing & Capabilities"
3. Change "Bundle Identifier"

## Deployment

### TestFlight (Beta Testing)

1. Archive the app (Product → Archive)
2. Upload to App Store Connect
3. Add beta testers
4. Distribute via TestFlight

### App Store

1. Complete App Store Connect listing
2. Submit for review
3. Wait for approval
4. Release to App Store

## Troubleshooting

### Cannot Connect to Backend

- Verify backend is running
- Check `baseURL` in `APIClient.swift`
- Ensure device/simulator can reach the backend
- For physical device testing, use your computer's local IP

### Build Errors

- Clean build folder: Product → Clean Build Folder
- Delete derived data: Xcode → Preferences → Locations → Derived Data
- Update Xcode to latest version

### Authentication Issues

- Check backend session configuration
- Verify cookies are enabled in `URLSession`
- Check backend CORS settings for iOS app

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - See main project README

## Support

For issues:
- Check the main project documentation
- Review API endpoint configuration
- Verify backend is running correctly

---

**Built with ❤️ using SwiftUI**
