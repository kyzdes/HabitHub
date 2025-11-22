# HabitHub iOS - Quick Start Guide

Get up and running with the iOS app in 5 minutes!

## 🚀 Quick Setup

### 1. Prerequisites

- ✅ Xcode 15.0+ installed
- ✅ macOS 14.0+ (Sonoma)
- ✅ Backend API running (see main README)

### 2. Create Xcode Project

```bash
# Open Xcode
open -a Xcode

# Create new project:
# - Choose: iOS → App
# - Product Name: HabitHub
# - Interface: SwiftUI
# - Language: Swift
```

### 3. Add Source Files

Drag the entire `HabitHub` folder into your Xcode project:

- Select: "Copy items if needed"
- Select: "Create groups"
- Target: HabitHub

### 4. Configure API

Open `Services/APIClient.swift`:

```swift
// Update this line:
private let baseURL = "https://yourdomain.com/api"

// For local testing:
private let baseURL = "http://localhost:5000/api"
```

### 5. Build & Run

```
Press: Cmd + R
```

That's it! 🎉

## 📱 Testing

### Simulator

1. Select "iPhone 15 Pro" from device menu
2. Press Cmd + R
3. App launches in simulator

### Physical Device

1. Connect iPhone
2. Select your iPhone from device menu
3. Update baseURL to use your computer's local IP
4. Press Cmd + R

## 🐛 Common Issues

**"No such module SwiftUI"**
→ Set Deployment Target to iOS 16.0+

**"Cannot connect to server"**
→ Check backend is running and API URL is correct

**Signing error**
→ Select your team in Signing & Capabilities

## 📚 Full Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - App Store deployment guide
- **[README.md](./README.md)** - Full documentation

## 🎯 Next Steps

1. ✅ Test all features
2. ✅ Customize colors in Assets.xcassets
3. ✅ Add your app icon
4. ✅ Deploy to TestFlight
5. ✅ Publish to App Store

## 💡 Pro Tips

- Use **Cmd + Shift + K** to clean build
- Use **Cmd + .** to stop running app
- Press **Resume** in preview pane for live previews
- Use breakpoints for debugging

## 🆘 Need Help?

Check the detailed guides:
- [SETUP.md](./SETUP.md) - Detailed setup
- Main project [README.md](../README.md) - Backend setup

---

**Happy coding! Build amazing habits! 💪**
