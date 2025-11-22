import Foundation

@MainActor
class StatisticsViewModel: ObservableObject {
    @Published var stats: UserStats?
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let apiClient = APIClient.shared

    func loadStats(days: Int = 30) async {
        isLoading = true
        errorMessage = nil

        do {
            stats = try await apiClient.getStats(days: days)
        } catch {
            handleError(error)
        }

        isLoading = false
    }

    private func handleError(_ error: Error) {
        if let apiError = error as? APIError {
            errorMessage = apiError.localizedDescription
        } else {
            errorMessage = error.localizedDescription
        }
    }
}
