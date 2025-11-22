import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var authViewModel: AuthenticationViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var isLoading = false
    @State private var localError: String?

    var body: some View {
        VStack(spacing: 20) {
            VStack(spacing: 15) {
                // First Name
                HStack {
                    Image(systemName: "person.fill")
                        .foregroundColor(.gray)
                        .frame(width: 20)

                    TextField("First Name (Optional)", text: $firstName)
                        .textContentType(.givenName)
                }
                .padding()
                .background(Color.white)
                .cornerRadius(12)

                // Last Name
                HStack {
                    Image(systemName: "person.fill")
                        .foregroundColor(.gray)
                        .frame(width: 20)

                    TextField("Last Name (Optional)", text: $lastName)
                        .textContentType(.familyName)
                }
                .padding()
                .background(Color.white)
                .cornerRadius(12)

                // Email
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

                // Password
                HStack {
                    Image(systemName: "lock.fill")
                        .foregroundColor(.gray)
                        .frame(width: 20)

                    SecureField("Password (min 8 characters)", text: $password)
                        .textContentType(.newPassword)
                }
                .padding()
                .background(Color.white)
                .cornerRadius(12)

                // Confirm Password
                HStack {
                    Image(systemName: "lock.fill")
                        .foregroundColor(.gray)
                        .frame(width: 20)

                    SecureField("Confirm Password", text: $confirmPassword)
                        .textContentType(.newPassword)
                }
                .padding()
                .background(Color.white)
                .cornerRadius(12)
            }

            // Error Message
            if let error = localError ?? authViewModel.errorMessage {
                Text(error)
                    .foregroundColor(.red)
                    .font(.caption)
                    .padding(.horizontal)
                    .multilineTextAlignment(.center)
            }

            // Register Button
            Button(action: register) {
                if isLoading {
                    ProgressView()
                        .tint(.white)
                } else {
                    Text("Create Account")
                        .fontWeight(.semibold)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.white)
            .foregroundColor(Color("PrimaryColor"))
            .cornerRadius(12)
            .disabled(isLoading || !isFormValid)
            .opacity((isLoading || !isFormValid) ? 0.6 : 1)
        }
        .padding(.horizontal, 30)
    }

    private var isFormValid: Bool {
        !email.isEmpty && password.count >= 8 && password == confirmPassword
    }

    private func register() {
        localError = nil

        guard password == confirmPassword else {
            localError = "Passwords do not match"
            return
        }

        isLoading = true
        Task {
            let firstNameValue = firstName.isEmpty ? nil : firstName
            let lastNameValue = lastName.isEmpty ? nil : lastName

            await authViewModel.register(
                email: email,
                password: password,
                firstName: firstNameValue,
                lastName: lastNameValue
            )
            isLoading = false
        }
    }
}

#Preview {
    RegisterView()
        .environmentObject(AuthenticationViewModel())
        .background(Color.blue)
}
