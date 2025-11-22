import Foundation
import SwiftUI

@MainActor
class AuthenticationViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isLoading = true
    @Published var currentUser: User?
    @Published var errorMessage: String?

    private let apiClient = APIClient.shared

    func checkAuthStatus() {
        Task {
            do {
                let user = try await apiClient.getCurrentUser()
                self.currentUser = user
                self.isAuthenticated = true
            } catch {
                self.isAuthenticated = false
                self.currentUser = nil
            }
            self.isLoading = false
        }
    }

    func register(email: String, password: String, firstName: String?, lastName: String?) async -> Bool {
        errorMessage = nil

        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = "Email and password are required"
            return false
        }

        guard password.count >= 8 else {
            errorMessage = "Password must be at least 8 characters"
            return false
        }

        do {
            let user = try await apiClient.register(
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            )
            self.currentUser = user
            self.isAuthenticated = true
            return true
        } catch {
            if let apiError = error as? APIError {
                errorMessage = apiError.localizedDescription
            } else {
                errorMessage = error.localizedDescription
            }
            return false
        }
    }

    func login(email: String, password: String) async -> Bool {
        errorMessage = nil

        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = "Email and password are required"
            return false
        }

        do {
            let user = try await apiClient.login(email: email, password: password)
            self.currentUser = user
            self.isAuthenticated = true
            return true
        } catch {
            if let apiError = error as? APIError {
                errorMessage = apiError.localizedDescription
            } else {
                errorMessage = error.localizedDescription
            }
            return false
        }
    }

    func logout() {
        Task {
            do {
                try await apiClient.logout()
            } catch {
                print("Logout error: \(error)")
            }
            self.currentUser = nil
            self.isAuthenticated = false
        }
    }
}
