import SwiftUI

struct AuthenticationView: View {
    @State private var isLoginMode = true

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color("PrimaryColor"), Color("SecondaryColor")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 30) {
                // Logo and Title
                VStack(spacing: 15) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 70))
                        .foregroundColor(.white)

                    Text("HabitHub")
                        .font(.system(size: 40, weight: .bold))
                        .foregroundColor(.white)

                    Text("Build better habits, one day at a time")
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.9))
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 60)

                Spacer()

                // Auth Form
                if isLoginMode {
                    LoginView()
                } else {
                    RegisterView()
                }

                // Toggle between login and register
                Button(action: {
                    withAnimation {
                        isLoginMode.toggle()
                    }
                }) {
                    HStack(spacing: 4) {
                        Text(isLoginMode ? "Don't have an account?" : "Already have an account?")
                            .foregroundColor(.white.opacity(0.8))
                        Text(isLoginMode ? "Sign Up" : "Sign In")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                    }
                    .font(.subheadline)
                }
                .padding(.bottom, 40)
            }
        }
    }
}

#Preview {
    AuthenticationView()
        .environmentObject(AuthenticationViewModel())
}
