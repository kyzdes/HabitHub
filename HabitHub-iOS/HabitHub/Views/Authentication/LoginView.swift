import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authViewModel: AuthenticationViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false

    var body: some View {
        VStack(spacing: 20) {
            VStack(spacing: 15) {
                // Email Field
                HStack {
                    Image(systemName: "envelope.fill")
                        .foregroundColor(.gray)
                        .frame(width: 20)

                    TextField("Email", text: $email)
                        .textContentType(.emailAddress)
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)
                }
                .padding()
                .background(Color.white)
                .cornerRadius(12)

                // Password Field
                HStack {
                    Image(systemName: "lock.fill")
                        .foregroundColor(.gray)
                        .frame(width: 20)

                    SecureField("Password", text: $password)
                        .textContentType(.password)
                }
                .padding()
                .background(Color.white)
                .cornerRadius(12)
            }

            // Error Message
            if let error = authViewModel.errorMessage {
                Text(error)
                    .foregroundColor(.red)
                    .font(.caption)
                    .padding(.horizontal)
                    .multilineTextAlignment(.center)
            }

            // Login Button
            Button(action: login) {
                if isLoading {
                    ProgressView()
                        .tint(.white)
                } else {
                    Text("Sign In")
                        .fontWeight(.semibold)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.white)
            .foregroundColor(Color("PrimaryColor"))
            .cornerRadius(12)
            .disabled(isLoading || email.isEmpty || password.isEmpty)
            .opacity((isLoading || email.isEmpty || password.isEmpty) ? 0.6 : 1)
        }
        .padding(.horizontal, 30)
    }

    private func login() {
        isLoading = true
        Task {
            await authViewModel.login(email: email, password: password)
            isLoading = false
        }
    }
}

#Preview {
    LoginView()
        .environmentObject(AuthenticationViewModel())
        .background(Color.blue)
}
