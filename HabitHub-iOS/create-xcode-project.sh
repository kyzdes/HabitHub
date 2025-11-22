#!/bin/bash

# HabitHub iOS - Xcode Project Generator
# This script creates a complete Xcode project with all files properly configured

set -e

echo "🚀 HabitHub iOS Project Generator"
echo "================================"
echo ""

# Configuration
PROJECT_NAME="HabitHub"
BUNDLE_ID="com.habithub.app"
IOS_DIR="$(pwd)/HabitHub-iOS"
PROJECT_DIR="$IOS_DIR/$PROJECT_NAME"

# Check if we're in the right directory
if [ ! -d "$IOS_DIR" ]; then
    echo "❌ Error: HabitHub-iOS directory not found"
    echo "Please run this script from the HabitHub root directory"
    exit 1
fi

echo "📁 Creating Xcode project structure..."

# Create project directory
mkdir -p "$PROJECT_DIR"

# Create the .xcodeproj directory structure
XCODEPROJ="$IOS_DIR/$PROJECT_NAME.xcodeproj"
mkdir -p "$XCODEPROJ"

echo "📝 Generating project.pbxproj file..."

# Create a minimal but functional project.pbxproj
cat > "$XCODEPROJ/project.pbxproj" << 'EOF'
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {

/* Begin PBXBuildFile section */
		001 /* HabitHubApp.swift in Sources */ = {isa = PBXBuildFile; fileRef = 002; };
		003 /* ContentView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 004; };
		005 /* Assets.xcassets in Resources */ = {isa = PBXBuildFile; };

		100 /* User.swift in Sources */ = {isa = PBXBuildFile; fileRef = 101; };
		102 /* Habit.swift in Sources */ = {isa = PBXBuildFile; fileRef = 103; };
		104 /* Category.swift in Sources */ = {isa = PBXBuildFile; fileRef = 105; };
		106 /* HabitCompletion.swift in Sources */ = {isa = PBXBuildFile; fileRef = 107; };
		108 /* UserStats.swift in Sources */ = {isa = PBXBuildFile; fileRef = 109; };

		200 /* AuthenticationViewModel.swift in Sources */ = {isa = PBXBuildFile; fileRef = 201; };
		202 /* HabitsViewModel.swift in Sources */ = {isa = PBXBuildFile; fileRef = 203; };
		204 /* CategoriesViewModel.swift in Sources */ = {isa = PBXBuildFile; fileRef = 205; };
		206 /* StatisticsViewModel.swift in Sources */ = {isa = PBXBuildFile; fileRef = 207; };

		300 /* APIClient.swift in Sources */ = {isa = PBXBuildFile; fileRef = 301; };

		400 /* ThemeManager.swift in Sources */ = {isa = PBXBuildFile; fileRef = 401; };
		402 /* Extensions.swift in Sources */ = {isa = PBXBuildFile; fileRef = 403; };

		500 /* AuthenticationView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 501; };
		502 /* LoginView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 503; };
		504 /* RegisterView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 505; };
		506 /* MainTabView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 507; };
		508 /* HabitsListView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 509; };
		510 /* HabitCardView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 511; };
		512 /* AddHabitView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 513; };
		514 /* HabitDetailView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 515; };
		516 /* CategoriesView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 517; };
		518 /* AddCategoryView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 519; };
		520 /* StatisticsView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 521; };
		522 /* ProfileView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 523; };
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
		000 /* HabitHub.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = HabitHub.app; sourceTree = BUILT_PRODUCTS_DIR; };
		002 /* HabitHubApp.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = HabitHubApp.swift; sourceTree = "<group>"; };
		004 /* ContentView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ContentView.swift; sourceTree = "<group>"; };
		006 /* Assets.xcassets */ = {isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = Assets.xcassets; sourceTree = "<group>"; };

		101 /* User.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = User.swift; sourceTree = "<group>"; };
		103 /* Habit.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = Habit.swift; sourceTree = "<group>"; };
		105 /* Category.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = Category.swift; sourceTree = "<group>"; };
		107 /* HabitCompletion.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = HabitCompletion.swift; sourceTree = "<group>"; };
		109 /* UserStats.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = UserStats.swift; sourceTree = "<group>"; };

		201 /* AuthenticationViewModel.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = AuthenticationViewModel.swift; sourceTree = "<group>"; };
		203 /* HabitsViewModel.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = HabitsViewModel.swift; sourceTree = "<group>"; };
		205 /* CategoriesViewModel.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = CategoriesViewModel.swift; sourceTree = "<group>"; };
		207 /* StatisticsViewModel.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = StatisticsViewModel.swift; sourceTree = "<group>"; };

		301 /* APIClient.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = APIClient.swift; sourceTree = "<group>"; };

		401 /* ThemeManager.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ThemeManager.swift; sourceTree = "<group>"; };
		403 /* Extensions.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = Extensions.swift; sourceTree = "<group>"; };

		501 /* AuthenticationView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = AuthenticationView.swift; sourceTree = "<group>"; };
		503 /* LoginView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = LoginView.swift; sourceTree = "<group>"; };
		505 /* RegisterView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = RegisterView.swift; sourceTree = "<group>"; };
		507 /* MainTabView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = MainTabView.swift; sourceTree = "<group>"; };
		509 /* HabitsListView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = HabitsListView.swift; sourceTree = "<group>"; };
		511 /* HabitCardView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = HabitCardView.swift; sourceTree = "<group>"; };
		513 /* AddHabitView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = AddHabitView.swift; sourceTree = "<group>"; };
		515 /* HabitDetailView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = HabitDetailView.swift; sourceTree = "<group>"; };
		517 /* CategoriesView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = CategoriesView.swift; sourceTree = "<group>"; };
		519 /* AddCategoryView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = AddCategoryView.swift; sourceTree = "<group>"; };
		521 /* StatisticsView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = StatisticsView.swift; sourceTree = "<group>"; };
		523 /* ProfileView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ProfileView.swift; sourceTree = "<group>"; };
/* End PBXFileReference section */

/* Begin PBXFrameworksBuildPhase section */
		FFF /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
		ROOT = {
			isa = PBXGroup;
			children = (
				001_GROUP /* HabitHub */,
				PRODUCTS,
			);
			sourceTree = "<group>";
		};
		PRODUCTS = {
			isa = PBXGroup;
			children = (
				000 /* HabitHub.app */,
			);
			name = Products;
			sourceTree = "<group>";
		};
		001_GROUP /* HabitHub */ = {
			isa = PBXGroup;
			children = (
				002 /* HabitHubApp.swift */,
				004 /* ContentView.swift */,
				100_GROUP /* Models */,
				200_GROUP /* ViewModels */,
				300_GROUP /* Services */,
				400_GROUP /* Utilities */,
				500_GROUP /* Views */,
				600_GROUP /* Resources */,
			);
			path = HabitHub;
			sourceTree = "<group>";
		};
		100_GROUP /* Models */ = {
			isa = PBXGroup;
			children = (
				101 /* User.swift */,
				103 /* Habit.swift */,
				105 /* Category.swift */,
				107 /* HabitCompletion.swift */,
				109 /* UserStats.swift */,
			);
			path = Models;
			sourceTree = "<group>";
		};
		200_GROUP /* ViewModels */ = {
			isa = PBXGroup;
			children = (
				201 /* AuthenticationViewModel.swift */,
				203 /* HabitsViewModel.swift */,
				205 /* CategoriesViewModel.swift */,
				207 /* StatisticsViewModel.swift */,
			);
			path = ViewModels;
			sourceTree = "<group>";
		};
		300_GROUP /* Services */ = {
			isa = PBXGroup;
			children = (
				301 /* APIClient.swift */,
			);
			path = Services;
			sourceTree = "<group>";
		};
		400_GROUP /* Utilities */ = {
			isa = PBXGroup;
			children = (
				401 /* ThemeManager.swift */,
				403 /* Extensions.swift */,
			);
			path = Utilities;
			sourceTree = "<group>";
		};
		500_GROUP /* Views */ = {
			isa = PBXGroup;
			children = (
				507 /* MainTabView.swift */,
				501_GROUP /* Authentication */,
				502_GROUP /* Habits */,
				503_GROUP /* Categories */,
				504_GROUP /* Statistics */,
				505_GROUP /* Profile */,
			);
			path = Views;
			sourceTree = "<group>";
		};
		501_GROUP /* Authentication */ = {
			isa = PBXGroup;
			children = (
				501 /* AuthenticationView.swift */,
				503 /* LoginView.swift */,
				505 /* RegisterView.swift */,
			);
			path = Authentication;
			sourceTree = "<group>";
		};
		502_GROUP /* Habits */ = {
			isa = PBXGroup;
			children = (
				509 /* HabitsListView.swift */,
				511 /* HabitCardView.swift */,
				513 /* AddHabitView.swift */,
				515 /* HabitDetailView.swift */,
			);
			path = Habits;
			sourceTree = "<group>";
		};
		503_GROUP /* Categories */ = {
			isa = PBXGroup;
			children = (
				517 /* CategoriesView.swift */,
				519 /* AddCategoryView.swift */,
			);
			path = Categories;
			sourceTree = "<group>";
		};
		504_GROUP /* Statistics */ = {
			isa = PBXGroup;
			children = (
				521 /* StatisticsView.swift */,
			);
			path = Statistics;
			sourceTree = "<group>";
		};
		505_GROUP /* Profile */ = {
			isa = PBXGroup;
			children = (
				523 /* ProfileView.swift */,
			);
			path = Profile;
			sourceTree = "<group>";
		};
		600_GROUP /* Resources */ = {
			isa = PBXGroup;
			children = (
				006 /* Assets.xcassets */,
			);
			path = Resources;
			sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		TARGET /* HabitHub */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = BUILD_CONFIG_LIST;
			buildPhases = (
				SOURCES_PHASE,
				FFF /* Frameworks */,
				RESOURCES_PHASE,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = HabitHub;
			productName = HabitHub;
			productReference = 000 /* HabitHub.app */;
			productType = "com.apple.product-type.application";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		PROJECT /* Project object */ = {
			isa = PBXProject;
			attributes = {
				BuildIndependentTargetsInParallel = 1;
				LastSwiftUpdateCheck = 1500;
				LastUpgradeCheck = 1500;
			};
			buildConfigurationList = PROJECT_BUILD_CONFIG_LIST;
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
			);
			mainGroup = ROOT;
			productRefGroup = PRODUCTS;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				TARGET /* HabitHub */,
			);
		};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		RESOURCES_PHASE = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				005 /* Assets.xcassets in Resources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		SOURCES_PHASE = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				001 /* HabitHubApp.swift in Sources */,
				003 /* ContentView.swift in Sources */,
				100 /* User.swift in Sources */,
				102 /* Habit.swift in Sources */,
				104 /* Category.swift in Sources */,
				106 /* HabitCompletion.swift in Sources */,
				108 /* UserStats.swift in Sources */,
				200 /* AuthenticationViewModel.swift in Sources */,
				202 /* HabitsViewModel.swift in Sources */,
				204 /* CategoriesViewModel.swift in Sources */,
				206 /* StatisticsViewModel.swift in Sources */,
				300 /* APIClient.swift in Sources */,
				400 /* ThemeManager.swift in Sources */,
				402 /* Extensions.swift in Sources */,
				500 /* AuthenticationView.swift in Sources */,
				502 /* LoginView.swift in Sources */,
				504 /* RegisterView.swift in Sources */,
				506 /* MainTabView.swift in Sources */,
				508 /* HabitsListView.swift in Sources */,
				510 /* HabitCardView.swift in Sources */,
				512 /* AddHabitView.swift in Sources */,
				514 /* HabitDetailView.swift in Sources */,
				516 /* CategoriesView.swift in Sources */,
				518 /* AddCategoryView.swift in Sources */,
				520 /* StatisticsView.swift in Sources */,
				522 /* ProfileView.swift in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		DEBUG_CONFIG /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS = YES;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_ENABLE_OBJC_WEAK = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_TESTABILITY = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = (
					"DEBUG=1",
					"$(inherited)",
				);
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				LOCALIZATION_PREFERS_STRING_CATALOGS = YES;
				MTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;
				MTL_FAST_MATH = YES;
				ONLY_ACTIVE_ARCH = YES;
				SDKROOT = iphoneos;
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = "DEBUG $(inherited)";
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
			};
			name = Debug;
		};
		RELEASE_CONFIG /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS = YES;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_ENABLE_OBJC_WEAK = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				LOCALIZATION_PREFERS_STRING_CATALOGS = YES;
				MTL_ENABLE_DEBUG_INFO = NO;
				MTL_FAST_MATH = YES;
				SDKROOT = iphoneos;
				SWIFT_COMPILATION_MODE = wholemodule;
				VALIDATE_PRODUCT = YES;
			};
			name = Release;
		};
		TARGET_DEBUG /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				DEVELOPMENT_TEAM = "";
				ENABLE_PREVIEWS = YES;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = HabitHub/Info.plist;
				INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchScreen_Generation = YES;
				INFOPLIST_KEY_UISupportedInterfaceOrientations = "UIInterfaceOrientationPortrait UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "UIInterfaceOrientationPortrait UIInterfaceOrientationPortraitUpsideDown UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0;
				PRODUCT_BUNDLE_IDENTIFIER = com.habithub.app;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Debug;
		};
		TARGET_RELEASE /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				DEVELOPMENT_TEAM = "";
				ENABLE_PREVIEWS = YES;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = HabitHub/Info.plist;
				INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchScreen_Generation = YES;
				INFOPLIST_KEY_UISupportedInterfaceOrientations = "UIInterfaceOrientationPortrait UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "UIInterfaceOrientationPortrait UIInterfaceOrientationPortraitUpsideDown UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				IPHONEOS_DEPLOYMENT_TARGET = 16.0;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0;
				PRODUCT_BUNDLE_IDENTIFIER = com.habithub.app;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		PROJECT_BUILD_CONFIG_LIST = {
			isa = XCConfigurationList;
			buildConfigurations = (
				DEBUG_CONFIG /* Debug */,
				RELEASE_CONFIG /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		BUILD_CONFIG_LIST = {
			isa = XCConfigurationList;
			buildConfigurations = (
				TARGET_DEBUG /* Debug */,
				TARGET_RELEASE /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = PROJECT /* Project object */;
}
EOF

echo "✅ Project file created"

echo ""
echo "🎉 Done! Your Xcode project has been generated!"
echo ""
echo "📂 Location: $XCODEPROJ"
echo ""
echo "Next steps:"
echo "1. Open the project:"
echo "   cd HabitHub-iOS"
echo "   open HabitHub.xcodeproj"
echo ""
echo "2. In Xcode:"
echo "   - Select your development team in Signing & Capabilities"
echo "   - Build and run (Cmd + R)"
echo ""
EOF

chmod +x "$IOS_DIR/create-xcode-project.sh"

echo "✅ Script created at: HabitHub-iOS/create-xcode-project.sh"
