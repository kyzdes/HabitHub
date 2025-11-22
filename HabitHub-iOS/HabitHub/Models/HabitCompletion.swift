import Foundation

struct HabitCompletion: Codable, Identifiable, Hashable {
    let id: String
    let habitId: String
    let userId: String
    let completedAt: String
    let completedDate: String
    let notes: String?
    let createdAt: String

    var date: Date {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withFullDate]
        return formatter.date(from: completedDate) ?? Date()
    }
}

struct CompletionCreate: Encodable {
    let habitId: String
    let completedDate: String
    let notes: String?
}
