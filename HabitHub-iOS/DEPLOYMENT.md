# HabitHub iOS - App Store Deployment Guide

Complete guide for deploying your iOS app to TestFlight and the App Store.

## Prerequisites

- ✅ Completed app development
- ✅ Apple Developer Program membership ($99/year)
- ✅ Backend API deployed on production server
- ✅ App tested on simulator and physical devices
- ✅ All features working correctly

## Phase 1: Pre-Deployment Checklist

### 1. Code Preparation

- [ ] All features implemented and tested
- [ ] No debug code or console logs
- [ ] API endpoint set to production URL
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Offline behavior handled gracefully

### 2. App Configuration

#### Update Info.plist

Ensure these are set:
- Bundle name: "HabitHub"
- Bundle identifier: Unique (e.g., `com.yourcompany.habithub`)
- Version: 1.0.0
- Build number: 1

#### Update APIClient.swift

```swift
// Set production URL
private let baseURL = "https://yourdomain.com/api"
```

#### App Icon

1. Create 1024x1024px icon
2. Use [App Icon Generator](https://www.appicon.co/)
3. Add all sizes to `Assets.xcassets/AppIcon.appiconset/`

Required sizes:
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad)
- 120x120 (iPhone)
- 87x87, 80x80, 76x76, etc.

### 3. Screenshots

Prepare screenshots for App Store:
- 6.7" Display (iPhone 15 Pro Max): 1290 x 2796
- 6.5" Display: 1242 x 2688
- 5.5" Display: 1242 x 2208
- 12.9" iPad Pro: 2048 x 2732

Capture at least 3-5 screenshots showing:
- Login/Registration screen
- Main habits list
- Habit creation
- Statistics view
- Category management

## Phase 2: Apple Developer Setup

### 1. Apple Developer Account

1. Go to [developer.apple.com](https://developer.apple.com)
2. Sign in with Apple ID
3. Enroll in Apple Developer Program ($99/year)
4. Complete enrollment (can take 24-48 hours)

### 2. App Store Connect Setup

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Sign in
3. Click "My Apps"
4. Click "+" → "New App"

Configure:
- **Platform**: iOS
- **Name**: HabitHub
- **Primary Language**: English
- **Bundle ID**: Select your bundle ID (must match Xcode)
- **SKU**: habithub-ios (unique identifier)
- **User Access**: Full Access

### 3. App Information

Fill out all required fields:

#### Privacy Policy

Required for App Store. Host at:
- Your website
- GitHub Pages
- Privacy policy generator

Template:
```
HabitHub Privacy Policy

Data Collection:
- Email address (for authentication)
- Habit data (stored on secure servers)
- Usage analytics (optional)

Data Usage:
- Authentication only
- No third-party sharing
- User can delete account anytime

Contact: [your email]
Last Updated: [date]
```

#### Categories

- Primary: Health & Fitness
- Secondary: Productivity

#### Age Rating

Complete questionnaire:
- Violence: None
- Realistic Violence: None
- Horror: None
- Medical/Treatment: None
- Gambling: None
- → Rating: 4+

## Phase 3: Build & Archive

### 1. Prepare for Archive

In Xcode:

1. Select "Any iOS Device (arm64)" as destination
2. Product → Scheme → Edit Scheme
3. Set Build Configuration to "Release"
4. Close scheme editor

### 2. Archive the App

1. Product → Clean Build Folder (**Shift + Cmd + K**)
2. Product → Archive (**Cmd + B** then archive)
3. Wait for archive to complete (can take several minutes)
4. Archive Organizer opens automatically

### 3. Validate Archive

Before uploading:

1. In Archive Organizer, select your archive
2. Click "Validate App"
3. Choose distribution method: "App Store Connect"
4. Select distribution options:
   - ✅ Upload app symbols
   - ✅ Manage version and build number
5. Click "Validate"
6. Fix any issues that appear
7. Repeat until validation succeeds

### 4. Upload to App Store Connect

1. Click "Distribute App"
2. Select "App Store Connect"
3. Distribution options:
   - ✅ Upload
   - ✅ Upload app symbols
4. Select signing method: "Automatically manage signing"
5. Review app content
6. Click "Upload"
7. Wait for upload to complete (can take 10-30 minutes)

You'll receive email when processing is complete.

## Phase 4: TestFlight Beta Testing

### 1. Configure TestFlight

1. Go to App Store Connect
2. Select your app
3. Go to "TestFlight" tab
4. Wait for build to appear (after processing)
5. Add "What to Test" notes:
   ```
   v1.0.0 - Initial Release

   Please test:
   - Registration and login
   - Creating and tracking habits
   - Statistics accuracy
   - Dark mode
   - Any bugs or crashes
   ```

### 2. Add Beta Testers

**Internal Testers** (up to 100):
1. TestFlight → Internal Testing
2. Add testers (requires App Store Connect access)
3. No review required

**External Testers** (up to 10,000):
1. TestFlight → External Testing
2. Create new group
3. Add testers via email
4. Submit for Beta App Review
5. Wait for approval (24-48 hours)

### 3. Send Invitations

1. Testers receive email invitation
2. They install TestFlight app
3. Accept invitation and install your app
4. Collect feedback

### 4. Iterate

1. Fix bugs based on feedback
2. Increment build number
3. Archive and upload new build
4. Add to existing TestFlight groups

## Phase 5: App Store Submission

### 1. Complete App Metadata

In App Store Connect → App Information:

**App Privacy**:
1. Go to "App Privacy"
2. Click "Get Started"
3. Answer questions about data collection:
   - Email: Yes (for authentication)
   - Name: Optional
   - Health data: No
   - etc.

**App Store Information**:
- **Promotional Text**: 150 characters
  ```
  Build better habits with HabitHub. Track daily progress, visualize streaks, and achieve your goals one day at a time.
  ```

- **Description**: Up to 4000 characters
  ```
  HabitHub - Your Personal Habit Tracker

  Build lasting habits with HabitHub, the beautiful and intuitive habit tracking app designed to help you achieve your goals.

  FEATURES:
  • Create unlimited habits
  • Track daily progress
  • Organize with categories
  • View statistics and streaks
  • Dark mode support
  • Clean, modern interface

  WHY HABITHUB?
  • Simple and intuitive
  • Beautiful, distraction-free design
  • Powerful analytics
  • Privacy-focused
  • No ads or subscriptions

  Start building better habits today!
  ```

- **Keywords**: Up to 100 characters
  ```
  habit,tracker,routine,goals,productivity,mindfulness,health,fitness
  ```

- **Support URL**: Your website or GitHub
- **Marketing URL**: Optional

**Screenshots**: Upload prepared screenshots

**App Review Information**:
- Demo account (if login required):
  - Username: demo@habithub.com
  - Password: DemoPassword123!

- Review notes:
  ```
  HabitHub is a habit tracking application.

  Demo account credentials:
  Email: demo@habithub.com
  Password: DemoPassword123!

  Please feel free to create habits and test all features.

  Backend API is hosted at: https://yourdomain.com
  ```

### 2. Pricing and Availability

1. Go to "Pricing and Availability"
2. Set price: Free (or choose price tier)
3. Select countries: All or specific
4. Pre-order: Optional

### 3. Prepare for Submission

**Create Release Version**:
1. In App Store Connect
2. Click "+" next to iOS App
3. Version: 1.0.0
4. Choose build from TestFlight
5. Fill all required fields

**Export Compliance**:
- Uses encryption? No (for basic app)
- If yes, complete encryption form

### 4. Submit for Review

1. Review all information
2. Click "Submit for Review"
3. Confirm submission

**Review Time**: Usually 24-48 hours (can be up to 1 week)

### 5. Review Process

Apple will review:
- App functionality
- User interface
- Content
- Privacy policy
- Metadata accuracy

You'll receive status updates via email:
- "Waiting for Review"
- "In Review"
- "Pending Developer Release" or "Ready for Sale"
- "Rejected" (if issues found)

## Phase 6: Post-Approval

### If Approved

1. **Automatic Release**: Goes live immediately
2. **Manual Release**: You choose when to publish

To release:
1. Go to App Store Connect
2. Click "Release this version"
3. App appears on App Store within hours

### If Rejected

1. Read rejection message carefully
2. Fix issues
3. Respond to reviewer or submit new build
4. Common rejection reasons:
   - Incomplete functionality
   - Bugs or crashes
   - Misleading metadata
   - Privacy policy issues
   - Design guideline violations

## Phase 7: Post-Launch

### Monitor App

1. **Analytics**:
   - App Store Connect → Analytics
   - Track downloads, sessions, crashes

2. **User Reviews**:
   - Respond to reviews
   - Address concerns
   - Thank users for feedback

3. **Crash Reports**:
   - Xcode → Window → Organizer → Crashes
   - Fix critical crashes quickly

### Release Updates

1. Fix bugs
2. Add features
3. Increment version (1.0.1, 1.1.0, etc.)
4. Archive and upload
5. Submit for review

## Versioning Guide

- **1.0.0** → Initial release
- **1.0.1** → Bug fixes
- **1.1.0** → Minor features
- **2.0.0** → Major redesign

## App Store Optimization (ASO)

### Improve Visibility

1. **Keywords**: Research and optimize
2. **Icon**: Eye-catching, clear at small sizes
3. **Screenshots**: Show key features
4. **Description**: Clear, benefit-focused
5. **Ratings**: Encourage happy users to rate

### Update Strategy

- Update regularly (every 2-4 weeks)
- Fix bugs quickly
- Add requested features
- Improve performance

## Monetization Options

### Free App Options

1. **Freemium**: Free with premium features
2. **In-App Purchases**: Extra features, themes
3. **Subscription**: Monthly premium tier
4. **Ads**: Display ads (not recommended for habits app)

### Implementation

Use StoreKit for in-app purchases:
```swift
import StoreKit

// Configure products
// Handle purchases
// Restore purchases
```

## Legal & Compliance

### Required Pages

- **Privacy Policy**: Data collection and usage
- **Terms of Service**: App usage terms
- **Support Page**: Contact information

### GDPR Compliance (if serving EU users)

- Allow data export
- Allow account deletion
- Clear consent for data collection
- Privacy policy must be accessible

## App Store Guidelines

Key rules to follow:

1. **1.1**: No offensive content
2. **2.1**: App must work as advertised
3. **2.3**: Accurate metadata
4. **4.0**: Clear UI design
5. **5.1**: Privacy policy required

Full guidelines: [developer.apple.com/app-store/review/guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Troubleshooting

### Common Submission Issues

**Issue**: Missing privacy policy
**Fix**: Add link to privacy policy in App Store listing

**Issue**: App crashes on launch
**Fix**: Test thoroughly before submission

**Issue**: Misleading screenshots
**Fix**: Use actual app screenshots, no mockups

**Issue**: Incomplete app information
**Fix**: Fill all required metadata fields

## Resources

- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

## Checklist Before Submission

- [ ] App tested on multiple devices
- [ ] All features working
- [ ] No crashes or critical bugs
- [ ] API endpoint is production
- [ ] App icon complete
- [ ] Screenshots prepared
- [ ] Privacy policy created
- [ ] Support URL set
- [ ] Demo account created
- [ ] Metadata complete
- [ ] Build validated
- [ ] Build uploaded to App Store Connect
- [ ] TestFlight testing complete

---

**Good luck with your App Store launch! 🚀**
