import SwiftUI

struct HabitDetailView: View {
    let habit: Habit
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var habitsViewModel: HabitsViewModel
    @EnvironmentObject var categoriesViewModel: CategoriesViewModel
    @State private var showingDeleteAlert = false
    @State private var showingEditSheet = false

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header with Icon
                    VStack(spacing: 16) {
                        ZStack {
                            Circle()
                                .fill(habit.swiftUIColor.opacity(0.2))
                                .frame(width: 100, height: 100)

                            Image(systemName: habit.iconName)
                                .font(.system(size: 45))
                                .foregroundColor(habit.swiftUIColor)
                        }

                        Text(habit.name)
                            .font(.title)
                            .fontWeight(.bold)

                        if let description = habit.description, !description.isEmpty {
                            Text(description)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                        }

                        if let categoryId = habit.categoryId {
                            HStack {
                                Circle()
                                    .fill(categoriesViewModel.getCategoryColor(id: categoryId))
                                    .frame(width: 10, height: 10)

                                Text(categoriesViewModel.getCategoryName(id: categoryId))
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color(UIColor.secondarySystemGroupedBackground))
                            .cornerRadius(12)
                        }
                    }
                    .padding(.top, 20)

                    // Stats
                    HStack(spacing: 20) {
                        StatBox(
                            title: "This Week",
                            value: "\(habitsViewModel.getCompletionCount(habitId: habit.id, days: 7))/7",
                            icon: "calendar",
                            color: habit.swiftUIColor
                        )

                        StatBox(
                            title: "This Month",
                            value: "\(habitsViewModel.getCompletionCount(habitId: habit.id, days: 30))/30",
                            icon: "chart.bar.fill",
                            color: habit.swiftUIColor
                        )
                    }
                    .padding(.horizontal)

                    // Details
                    VStack(spacing: 16) {
                        DetailRow(icon: "repeat", label: "Frequency", value: habit.frequencyDisplay)

                        DetailRow(icon: "target", label: "Target", value: "\(habit.targetCount) per day")

                        DetailRow(
                            icon: "calendar.badge.clock",
                            label: "Created",
                            value: formatDate(habit.createdAt)
                        )
                    }
                    .padding()
                    .background(Color(UIColor.secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    .padding(.horizontal)

                    // Actions
                    VStack(spacing: 12) {
                        Button(action: { showingEditSheet = true }) {
                            Label("Edit Habit", systemImage: "pencil")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(12)
                        }

                        Button(action: { showingDeleteAlert = true }) {
                            Label("Delete Habit", systemImage: "trash")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.red.opacity(0.1))
                                .foregroundColor(.red)
                                .cornerRadius(12)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 30)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .alert("Delete Habit", isPresented: $showingDeleteAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Delete", role: .destructive, action: deleteHabit)
            } message: {
                Text("Are you sure you want to delete this habit? This action cannot be undone.")
            }
        }
    }

    private func deleteHabit() {
        Task {
            let success = await habitsViewModel.deleteHabit(id: habit.id)
            if success {
                dismiss()
            }
        }
    }

    private func formatDate(_ dateString: String) -> String {
        let formatter = ISO8601DateFormatter()
        if let date = formatter.date(from: dateString) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateStyle = .medium
            return displayFormatter.string(from: date)
        }
        return dateString
    }
}

struct StatBox: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)

            Text(value)
                .font(.title2)
                .fontWeight(.bold)

            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }
}

struct DetailRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(.secondary)
                .frame(width: 24)

            Text(label)
                .foregroundColor(.secondary)

            Spacer()

            Text(value)
                .fontWeight(.medium)
        }
    }
}

#Preview {
    let habit = Habit(
        id: "1",
        userId: "user1",
        categoryId: "cat1",
        name: "Morning Meditation",
        description: "10 minutes of mindfulness to start the day",
        icon: "brain.head.profile",
        color: "#8B5CF6",
        frequency: "daily",
        targetDays: nil,
        targetCount: 1,
        reminderTime: nil,
        reminderEnabled: false,
        order: 0,
        archived: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
    )

    return HabitDetailView(habit: habit)
        .environmentObject(HabitsViewModel())
        .environmentObject(CategoriesViewModel())
}
