import Foundation
import SwiftUI

@MainActor
class CategoriesViewModel: ObservableObject {
    @Published var categories: [Category] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let apiClient = APIClient.shared

    func loadCategories() async {
        isLoading = true
        errorMessage = nil

        do {
            categories = try await apiClient.getCategories()
            categories.sort { $0.order < $1.order }
        } catch {
            handleError(error)
        }

        isLoading = false
    }

    func createCategory(name: String, color: String, icon: String?) async -> Bool {
        errorMessage = nil

        let category = CategoryCreate(
            name: name,
            color: color,
            icon: icon,
            order: categories.count
        )

        do {
            let newCategory = try await apiClient.createCategory(category)
            categories.append(newCategory)
            categories.sort { $0.order < $1.order }
            return true
        } catch {
            handleError(error)
            return false
        }
    }

    func updateCategory(id: String, name: String?, color: String?, icon: String?) async -> Bool {
        errorMessage = nil

        let update = CategoryUpdate(name: name, color: color, icon: icon, order: nil)

        do {
            let updated = try await apiClient.updateCategory(id: id, update: update)
            if let index = categories.firstIndex(where: { $0.id == id }) {
                categories[index] = updated
            }
            return true
        } catch {
            handleError(error)
            return false
        }
    }

    func deleteCategory(id: String) async -> Bool {
        errorMessage = nil

        do {
            try await apiClient.deleteCategory(id: id)
            categories.removeAll { $0.id == id }
            return true
        } catch {
            handleError(error)
            return false
        }
    }

    func getCategoryName(id: String?) -> String {
        guard let id = id else { return "No Category" }
        return categories.first(where: { $0.id == id })?.name ?? "Unknown"
    }

    func getCategoryColor(id: String?) -> Color {
        guard let id = id else { return .gray }
        return categories.first(where: { $0.id == id })?.swiftUIColor ?? .blue
    }

    private func handleError(_ error: Error) {
        if let apiError = error as? APIError {
            errorMessage = apiError.localizedDescription
        } else {
            errorMessage = error.localizedDescription
        }
    }
}
