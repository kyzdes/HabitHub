import Foundation
import SwiftUI

struct Category: Codable, Identifiable, Hashable {
    let id: String
    let userId: String
    let name: String
    let color: String
    let icon: String?
    let order: Int
    let createdAt: String
    let updatedAt: String

    var swiftUIColor: Color {
        Color(hex: color) ?? .blue
    }
}

struct CategoryCreate: Encodable {
    let name: String
    let color: String
    let icon: String?
    let order: Int?
}

struct CategoryUpdate: Encodable {
    let name: String?
    let color: String?
    let icon: String?
    let order: Int?
}

// MARK: - Default Categories
extension Category {
    static let presetCategories: [(name: String, color: String, icon: String)] = [
        ("Health", "#10B981", "heart.fill"),
        ("Fitness", "#EF4444", "figure.run"),
        ("Mindfulness", "#8B5CF6", "brain.head.profile"),
        ("Productivity", "#F59E0B", "chart.line.uptrend.xyaxis"),
        ("Learning", "#3B82F6", "book.fill"),
        ("Social", "#EC4899", "person.2.fill"),
        ("Creativity", "#F97316", "paintpalette.fill"),
        ("Finance", "#14B8A6", "dollarsign.circle.fill")
    ]
}
