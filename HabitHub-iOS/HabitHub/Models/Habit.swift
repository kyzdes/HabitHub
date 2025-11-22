import Foundation
import SwiftUI

struct Habit: Codable, Identifiable, Hashable {
    let id: String
    let userId: String
    let categoryId: String?
    let name: String
    let description: String?
    let icon: String?
    let color: String?
    let frequency: String
    let targetDays: [Int]?
    let targetCount: Int
    let reminderTime: String?
    let reminderEnabled: Bool
    let order: Int
    let archived: Bool
    let createdAt: String
    let updatedAt: String

    var swiftUIColor: Color {
        if let color = color {
            return Color(hex: color) ?? .blue
        }
        return .blue
    }

    var iconName: String {
        icon ?? "checkmark.circle.fill"
    }

    var frequencyDisplay: String {
        switch frequency {
        case "daily":
            return "Daily"
        case "weekly":
            return "Weekly"
        default:
            return frequency.capitalized
        }
    }
}

struct HabitCreate: Encodable {
    let name: String
    let description: String?
    let categoryId: String?
    let icon: String?
    let color: String?
    let frequency: String
    let targetDays: [Int]?
    let targetCount: Int?
    let reminderTime: String?
    let reminderEnabled: Bool?
    let order: Int?
}

struct HabitUpdate: Encodable {
    let name: String?
    let description: String?
    let categoryId: String?
    let icon: String?
    let color: String?
    let frequency: String?
    let targetDays: [Int]?
    let targetCount: Int?
    let reminderTime: String?
    let reminderEnabled: Bool?
    let order: Int?
    let archived: Bool?
}
