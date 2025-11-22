import Foundation

struct UserStats: Codable {
    let totalHabits: Int
    let activeHabits: Int
    let completionsLast30Days: Int
    let currentStreak: Int
}
