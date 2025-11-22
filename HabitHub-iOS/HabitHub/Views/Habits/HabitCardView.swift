import SwiftUI

struct HabitCardView: View {
    let habit: Habit
    let isCompleted: Bool
    let onToggle: () -> Void
    let onTap: () -> Void

    @EnvironmentObject var habitsViewModel: HabitsViewModel

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 15) {
                // Completion Button
                Button(action: onToggle) {
                    ZStack {
                        Circle()
                            .stroke(habit.swiftUIColor, lineWidth: 2.5)
                            .frame(width: 50, height: 50)

                        if isCompleted {
                            Circle()
                                .fill(habit.swiftUIColor)
                                .frame(width: 50, height: 50)

                            Image(systemName: "checkmark")
                                .font(.title3)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                        }
                    }
                }
                .buttonStyle(PlainButtonStyle())

                // Habit Info
                VStack(alignment: .leading, spacing: 6) {
                    Text(habit.name)
                        .font(.headline)
                        .foregroundColor(.primary)

                    if let description = habit.description, !description.isEmpty {
                        Text(description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                    }

                    HStack(spacing: 12) {
                        // Frequency Badge
                        Label(habit.frequencyDisplay, systemImage: "calendar")
                            .font(.caption2)
                            .foregroundColor(.secondary)

                        // Week Progress
                        let weekCompletions = habitsViewModel.getCompletionCount(habitId: habit.id, days: 7)
                        Label("\(weekCompletions)/7 this week", systemImage: "flame.fill")
                            .font(.caption2)
                            .foregroundColor(weekCompletions > 0 ? .orange : .secondary)
                    }
                }

                Spacer()

                // Habit Icon
                Image(systemName: habit.iconName)
                    .font(.title2)
                    .foregroundColor(habit.swiftUIColor)
            }
            .padding()
            .background(Color(UIColor.secondarySystemGroupedBackground))
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

#Preview {
    let habit = Habit(
        id: "1",
        userId: "user1",
        categoryId: nil,
        name: "Morning Meditation",
        description: "10 minutes of mindfulness",
        icon: "brain.head.profile",
        color: "#8B5CF6",
        frequency: "daily",
        targetDays: nil,
        targetCount: 1,
        reminderTime: nil,
        reminderEnabled: false,
        order: 0,
        archived: false,
        createdAt: "",
        updatedAt: ""
    )

    return VStack {
        HabitCardView(
            habit: habit,
            isCompleted: false,
            onToggle: {},
            onTap: {}
        )
        .environmentObject(HabitsViewModel())

        HabitCardView(
            habit: habit,
            isCompleted: true,
            onToggle: {},
            onTap: {}
        )
        .environmentObject(HabitsViewModel())
    }
    .padding()
}
