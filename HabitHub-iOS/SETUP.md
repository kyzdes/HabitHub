# HabitHub iOS - Complete Setup Guide

This guide will help you set up the iOS app in Xcode from the source files provided.

## Prerequisites

- macOS 14.0 (Sonoma) or later
- Xcode 15.0 or later
- Apple Developer account (for device testing)
- Backend API deployed and running

## Step 1: Create Xcode Project

### Option A: Manual Project Creation (Recommended)

1. **Open Xcode**
   - Launch Xcode from Applications

2. **Create New Project**
   - Click "Create a new Xcode project"
   - Select "iOS" → "App"
   - Click "Next"

3. **Project Settings**
   - Product Name: `HabitHub`
   - Team: Select your team
   - Organization Identifier: `com.yourcompany` (or your identifier)
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Storage: None (uncheck Core Data)
   - Include Tests: Optional
   - Click "Next"

4. **Save Location**
   - Navigate to the `HabitHub-iOS` directory
   - Click "Create"

### Option B: Use Provided Files

If you've already created the project structure:

1. Open Xcode
2. File → New → Project
3. Follow steps above
4. Replace the generated files with the provided source files

## Step 2: Configure Project Structure

### 1. Add Files to Project

Drag these folders into your Xcode project navigator:

```
HabitHub/
├── Models/
├── Views/
├── ViewModels/
├── Services/
├── Utilities/
└── Resources/
```

**Important**: When adding, ensure:
- ✅ "Copy items if needed" is checked
- ✅ "Create groups" is selected
- ✅ Target "HabitHub" is checked

### 2. Replace Generated Files

Delete these Xcode-generated files and use our versions:
- Delete: `HabitHubApp.swift` → Use our version
- Delete: `ContentView.swift` → Use our version
- Delete: `Assets.xcassets` → Use our `Resources/Assets.xcassets`

## Step 3: Project Settings

### 1. General Settings

1. Select project in navigator
2. Select "HabitHub" target
3. Go to "General" tab

Configure:
- **Display Name**: HabitHub
- **Bundle Identifier**: `com.yourcompany.HabitHub`
- **Version**: 1.0.0
- **Build**: 1
- **Minimum Deployments**: iOS 16.0

### 2. Signing & Capabilities

1. Go to "Signing & Capabilities" tab
2. Enable "Automatically manage signing"
3. Select your Team
4. Xcode will generate provisioning profile

### 3. Build Settings

1. Go to "Build Settings" tab
2. Search for "Swift Language Version"
3. Ensure it's set to "Swift 5"

## Step 4: Configure API Endpoint

Open `Services/APIClient.swift` and update the base URL:

```swift
// PRODUCTION (after backend deployment)
private let baseURL = "https://yourdomain.com/api"

// LOCAL DEVELOPMENT (backend on localhost)
// private let baseURL = "http://localhost:5000/api"

// PHYSICAL DEVICE TESTING (replace with your computer's IP)
// private let baseURL = "http://192.168.1.XXX:5000/api"
```

### Finding Your Computer's IP (for device testing)

**macOS**:
```bash
ipconfig getifaddr en0
```

**Or**: System Settings → Network → Your Connection → Details

## Step 5: App Transport Security (ATS)

The `Info.plist` is already configured to allow localhost for development.

For production with HTTPS, no changes needed.

For custom development servers:
1. Open `Info.plist`
2. Add your domain to `NSExceptionDomains` if needed

## Step 6: Build and Run

### Simulator

1. Select a simulator (e.g., "iPhone 15 Pro")
2. Press **Cmd + R** or click ▶ Play button
3. Wait for build to complete
4. App launches in simulator

### Physical Device

1. Connect iPhone via USB
2. Trust computer on iPhone
3. Select your device in Xcode
4. Press **Cmd + R**
5. If prompted, trust developer on iPhone:
   - Settings → General → VPN & Device Management
   - Trust your developer certificate

## Step 7: Testing

### Test Authentication

1. Launch app
2. Tap "Sign Up"
3. Create test account
4. Should navigate to main app

### Test Features

- ✅ Create a habit
- ✅ Mark habit as complete
- ✅ View statistics
- ✅ Create category
- ✅ Dark mode toggle

## Common Issues & Solutions

### Build Errors

**Issue**: "No such module 'SwiftUI'"
**Solution**: Ensure deployment target is iOS 16.0+

**Issue**: Signing errors
**Solution**:
- Select your team in Signing & Capabilities
- Change bundle identifier if needed

**Issue**: Files not found
**Solution**:
- Verify all files are added to project
- Check target membership for each file

### Runtime Errors

**Issue**: "Cannot connect to server"
**Solutions**:
1. Verify backend is running
2. Check API URL in `APIClient.swift`
3. For simulator: use `localhost`
4. For device: use computer's local IP
5. Ensure firewall allows connections

**Issue**: "Connection timed out"
**Solution**:
- Verify device and computer on same network
- Check backend is bound to 0.0.0.0 not 127.0.0.1
- Disable VPN if active

**Issue**: Authentication fails
**Solution**:
- Check backend session configuration
- Verify cookies are working
- Check backend logs

### UI Issues

**Issue**: Colors not showing
**Solution**: Verify `Assets.xcassets` is in project

**Issue**: App icon not showing
**Solution**: Add 1024x1024 PNG to `AppIcon.appiconset`

## Development Workflow

### Making Changes

1. Edit files in Xcode
2. **Cmd + B** to build
3. **Cmd + R** to run
4. Use **Cmd + Shift + K** to clean build

### Debugging

- **Breakpoints**: Click line number to add breakpoint
- **Console**: **Cmd + Shift + Y** to show console
- **Print**: Use `print()` for logging
- **View Hierarchy**: Debug → View Debugging → Capture View Hierarchy

### Hot Reload

SwiftUI supports live previews:
1. Open any View file
2. Click "Resume" in preview pane (right side)
3. Changes appear instantly in preview

## Project Organization Best Practices

### File Structure

```
Models/          → Data structures only
Views/           → SwiftUI views
ViewModels/      → Business logic & state
Services/        → API & networking
Utilities/       → Helpers & extensions
Resources/       → Assets, configs
```

### Naming Conventions

- Views: `HabitCardView.swift`
- ViewModels: `HabitsViewModel.swift`
- Models: `Habit.swift`
- Services: `APIClient.swift`

## Advanced Configuration

### Custom Schemes

For different environments:

1. Product → Scheme → Edit Scheme
2. Add new scheme for Development/Staging/Production
3. Set environment variables for each

### Build Configurations

1. Project settings → Configurations
2. Duplicate "Debug" → "Development"
3. Set different API URLs per configuration

## Next Steps

### App Icon

1. Design 1024x1024 icon
2. Use [appicon.co](https://appicon.co) to generate all sizes
3. Drag generated icons to `AppIcon.appiconset`

### Launch Screen

1. File → New → File → Storyboard
2. Design launch screen
3. Set in project settings

### TestFlight

1. Archive app: Product → Archive
2. Upload to App Store Connect
3. Add testers
4. Distribute

## Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## Troubleshooting Commands

```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reset simulator
xcrun simctl erase all

# List available simulators
xcrun simctl list devices

# View crash logs
~/Library/Logs/DiagnosticReports
```

## Getting Help

If you encounter issues:

1. Check this guide
2. Review Xcode console for errors
3. Check backend logs
4. Verify API connectivity
5. Review main project documentation

---

**Happy coding! Build amazing habits! 🚀**
