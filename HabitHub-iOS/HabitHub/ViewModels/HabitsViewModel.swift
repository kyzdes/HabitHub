import Foundation
import SwiftUI

@MainActor
class HabitsViewModel: ObservableObject {
    @Published var habits: [Habit] = []
    @Published var completions: [HabitCompletion] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let apiClient = APIClient.shared

    func loadHabits() async {
        isLoading = true
        errorMessage = nil

        do {
            habits = try await apiClient.getHabits(includeArchived: false)
        } catch {
            handleError(error)
        }

        isLoading = false
    }

    func loadCompletions() async {
        do {
            // Load last 30 days of completions
            let endDate = Date()
            let startDate = Calendar.current.date(byAdding: .day, value: -30, to: endDate)
            completions = try await apiClient.getCompletions(startDate: startDate, endDate: endDate)
        } catch {
            handleError(error)
        }
    }

    func createHabit(
        name: String,
        description: String?,
        categoryId: String?,
        icon: String?,
        color: String?,
        frequency: String = "daily"
    ) async -> Bool {
        errorMessage = nil

        let habit = HabitCreate(
            name: name,
            description: description,
            categoryId: categoryId,
            icon: icon,
            color: color,
            frequency: frequency,
            targetDays: nil,
            targetCount: 1,
            reminderTime: nil,
            reminderEnabled: false,
            order: habits.count
        )

        do {
            let newHabit = try await apiClient.createHabit(habit)
            habits.append(newHabit)
            habits.sort { $0.order < $1.order }
            return true
        } catch {
            handleError(error)
            return false
        }
    }

    func updateHabit(
        id: String,
        name: String?,
        description: String?,
        categoryId: String?,
        icon: String?,
        color: String?
    ) async -> Bool {
        errorMessage = nil

        let update = HabitUpdate(
            name: name,
            description: description,
            categoryId: categoryId,
            icon: icon,
            color: color,
            frequency: nil,
            targetDays: nil,
            targetCount: nil,
            reminderTime: nil,
            reminderEnabled: nil,
            order: nil,
            archived: nil
        )

        do {
            let updated = try await apiClient.updateHabit(id: id, update: update)
            if let index = habits.firstIndex(where: { $0.id == id }) {
                habits[index] = updated
            }
            return true
        } catch {
            handleError(error)
            return false
        }
    }

    func deleteHabit(id: String) async -> Bool {
        errorMessage = nil

        do {
            try await apiClient.deleteHabit(id: id)
            habits.removeAll { $0.id == id }
            return true
        } catch {
            handleError(error)
            return false
        }
    }

    func toggleCompletion(habitId: String, date: Date = Date()) async {
        let dateString = date.ISO8601Format().split(separator: "T")[0].description

        // Check if already completed
        if let existingCompletion = completions.first(where: {
            $0.habitId == habitId && $0.completedDate == dateString
        }) {
            // Delete completion
            do {
                try await apiClient.deleteCompletion(id: existingCompletion.id)
                completions.removeAll { $0.id == existingCompletion.id }
            } catch {
                handleError(error)
            }
        } else {
            // Create completion
            do {
                let completion = try await apiClient.createCompletion(
                    habitId: habitId,
                    date: date,
                    notes: nil
                )
                completions.append(completion)
            } catch {
                handleError(error)
            }
        }
    }

    func isHabitCompleted(habitId: String, date: Date = Date()) -> Bool {
        let dateString = date.ISO8601Format().split(separator: "T")[0].description
        return completions.contains { $0.habitId == habitId && $0.completedDate == dateString }
    }

    func getCompletionCount(habitId: String, days: Int = 7) -> Int {
        let endDate = Date()
        guard let startDate = Calendar.current.date(byAdding: .day, value: -days, to: endDate) else {
            return 0
        }

        return completions.filter {
            $0.habitId == habitId &&
            $0.date >= startDate &&
            $0.date <= endDate
        }.count
    }

    private func handleError(_ error: Error) {
        if let apiError = error as? APIError {
            errorMessage = apiError.localizedDescription
        } else {
            errorMessage = error.localizedDescription
        }
    }
}
