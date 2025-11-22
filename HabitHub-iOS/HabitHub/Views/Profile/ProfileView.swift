import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authViewModel: AuthenticationViewModel
    @EnvironmentObject var themeManager: ThemeManager
    @State private var showingLogoutAlert = false

    var body: some View {
        NavigationView {
            List {
                // User Info Section
                Section {
                    HStack(spacing: 15) {
                        // Avatar
                        ZStack {
                            Circle()
                                .fill(LinearGradient(
                                    colors: [Color("PrimaryColor"), Color("SecondaryColor")],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ))
                                .frame(width: 70, height: 70)

                            Text(authViewModel.currentUser?.initials ?? "?")
                                .font(.title)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                        }

                        VStack(alignment: .leading, spacing: 4) {
                            Text(authViewModel.currentUser?.displayName ?? "User")
                                .font(.headline)

                            Text(authViewModel.currentUser?.email ?? "")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 8)
                }

                // Appearance Section
                Section("Appearance") {
                    HStack {
                        Image(systemName: "moon.fill")
                            .foregroundColor(.purple)
                            .frame(width: 24)

                        Text("Dark Mode")

                        Spacer()

                        Toggle("", isOn: $themeManager.isDarkMode)
                    }
                }

                // App Information
                Section("About") {
                    HStack {
                        Image(systemName: "info.circle.fill")
                            .foregroundColor(.blue)
                            .frame(width: 24)

                        Text("Version")

                        Spacer()

                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }

                    Link(destination: URL(string: "https://github.com/yourusername/HabitHub")!) {
                        HStack {
                            Image(systemName: "link")
                                .foregroundColor(.green)
                                .frame(width: 24)

                            Text("GitHub Repository")

                            Spacer()

                            Image(systemName: "arrow.up.right")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }

                // Account Actions
                Section {
                    Button(action: { showingLogoutAlert = true }) {
                        HStack {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                                .foregroundColor(.red)
                                .frame(width: 24)

                            Text("Log Out")
                                .foregroundColor(.red)
                        }
                    }
                }
            }
            .navigationTitle("Profile")
            .alert("Log Out", isPresented: $showingLogoutAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Log Out", role: .destructive) {
                    authViewModel.logout()
                }
            } message: {
                Text("Are you sure you want to log out?")
            }
        }
    }
}

#Preview {
    ProfileView()
        .environmentObject(AuthenticationViewModel())
        .environmentObject(ThemeManager())
}
