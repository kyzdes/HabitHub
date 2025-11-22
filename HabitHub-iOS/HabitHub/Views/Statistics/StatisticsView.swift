import SwiftUI

struct StatisticsView: View {
    @EnvironmentObject var statsViewModel: StatisticsViewModel
    @EnvironmentObject var habitsViewModel: HabitsViewModel

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    if let stats = statsViewModel.stats {
                        // Main Stats Grid
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                            StatsCard(
                                title: "Total Habits",
                                value: "\(stats.totalHabits)",
                                icon: "checkmark.circle.fill",
                                color: .blue
                            )

                            StatsCard(
                                title: "Active Habits",
                                value: "\(stats.activeHabits)",
                                icon: "star.fill",
                                color: .green
                            )

                            StatsCard(
                                title: "Current Streak",
                                value: "\(stats.currentStreak)",
                                icon: "flame.fill",
                                color: .orange,
                                subtitle: stats.currentStreak == 1 ? "day" : "days"
                            )

                            StatsCard(
                                title: "Last 30 Days",
                                value: "\(stats.completionsLast30Days)",
                                icon: "chart.bar.fill",
                                color: .purple,
                                subtitle: "completions"
                            )
                        }
                        .padding()

                        // Motivational Message
                        MotivationalBanner(streak: stats.currentStreak, completions: stats.completionsLast30Days)
                            .padding(.horizontal)

                        // Top Habits
                        if !habitsViewModel.habits.isEmpty {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Top Habits This Week")
                                    .font(.headline)
                                    .padding(.horizontal)

                                ForEach(topHabitsThisWeek().prefix(5)) { habit in
                                    TopHabitRow(
                                        habit: habit,
                                        completions: habitsViewModel.getCompletionCount(habitId: habit.id, days: 7)
                                    )
                                }
                            }
                            .padding(.top)
                        }
                    } else if statsViewModel.isLoading {
                        ProgressView("Loading statistics...")
                            .padding()
                    } else {
                        Text("Unable to load statistics")
                            .foregroundColor(.secondary)
                            .padding()
                    }
                }
                .padding(.top)
            }
            .navigationTitle("Statistics")
            .refreshable {
                await loadData()
            }
        }
    }

    private func topHabitsThisWeek() -> [Habit] {
        habitsViewModel.habits
            .filter { !$0.archived }
            .sorted { habit1, habit2 in
                let count1 = habitsViewModel.getCompletionCount(habitId: habit1.id, days: 7)
                let count2 = habitsViewModel.getCompletionCount(habitId: habit2.id, days: 7)
                return count1 > count2
            }
    }

    private func loadData() async {
        await statsViewModel.loadStats()
    }
}

struct StatsCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    var subtitle: String?

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title)
                .foregroundColor(color)

            VStack(spacing: 4) {
                Text(value)
                    .font(.system(size: 32, weight: .bold))

                Text(title)
                    .font(.caption)
                    .foregroundColor(.secondary)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }
}

struct MotivationalBanner: View {
    let streak: Int
    let completions: Int

    var message: String {
        if streak >= 7 {
            return "Amazing! You're on fire 🔥"
        } else if streak >= 3 {
            return "Great job! Keep it up! 💪"
        } else if completions > 20 {
            return "You're making great progress! 🌟"
        } else if completions > 0 {
            return "Good start! Stay consistent! 💚"
        } else {
            return "Start your journey today! 🚀"
        }
    }

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(message)
                    .font(.headline)

                Text("Keep building those habits!")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Image(systemName: "sparkles")
                .font(.title)
                .foregroundColor(.yellow)
        }
        .padding()
        .background(
            LinearGradient(
                colors: [Color("PrimaryColor").opacity(0.1), Color("SecondaryColor").opacity(0.1)],
                startPoint: .leading,
                endPoint: .trailing
            )
        )
        .cornerRadius(16)
    }
}

struct TopHabitRow: View {
    let habit: Habit
    let completions: Int

    var body: some View {
        HStack(spacing: 15) {
            Circle()
                .fill(habit.swiftUIColor.opacity(0.2))
                .frame(width: 40, height: 40)
                .overlay(
                    Image(systemName: habit.iconName)
                        .foregroundColor(habit.swiftUIColor)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(habit.name)
                    .font(.subheadline)
                    .fontWeight(.medium)

                Text("\(completions)/7 days")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            // Progress Bar
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.gray.opacity(0.2))
                    .frame(width: 60, height: 8)

                RoundedRectangle(cornerRadius: 4)
                    .fill(habit.swiftUIColor)
                    .frame(width: CGFloat(completions) / 7.0 * 60, height: 8)
            }
        }
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(12)
        .padding(.horizontal)
    }
}

#Preview {
    StatisticsView()
        .environmentObject(StatisticsViewModel())
        .environmentObject(HabitsViewModel())
}
