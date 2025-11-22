import SwiftUI

struct HabitsListView: View {
    @EnvironmentObject var habitsViewModel: HabitsViewModel
    @EnvironmentObject var categoriesViewModel: CategoriesViewModel
    @State private var showingAddHabit = false
    @State private var selectedHabit: Habit?

    var body: some View {
        NavigationView {
            ZStack {
                if habitsViewModel.habits.isEmpty && !habitsViewModel.isLoading {
                    EmptyHabitsView(showingAddHabit: $showingAddHabit)
                } else {
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(habitsViewModel.habits) { habit in
                                HabitCardView(
                                    habit: habit,
                                    isCompleted: habitsViewModel.isHabitCompleted(habitId: habit.id),
                                    onToggle: {
                                        Task {
                                            await habitsViewModel.toggleCompletion(habitId: habit.id)
                                        }
                                    },
                                    onTap: {
                                        selectedHabit = habit
                                    }
                                )
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("My Habits")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddHabit = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                    }
                }
            }
            .sheet(isPresented: $showingAddHabit) {
                AddHabitView()
                    .environmentObject(habitsViewModel)
                    .environmentObject(categoriesViewModel)
            }
            .sheet(item: $selectedHabit) { habit in
                HabitDetailView(habit: habit)
                    .environmentObject(habitsViewModel)
                    .environmentObject(categoriesViewModel)
            }
            .refreshable {
                await loadData()
            }
        }
    }

    private func loadData() async {
        async let habits: () = habitsViewModel.loadHabits()
        async let completions: () = habitsViewModel.loadCompletions()

        await (habits, completions)
    }
}

struct EmptyHabitsView: View {
    @Binding var showingAddHabit: Bool

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 70))
                .foregroundColor(.gray.opacity(0.5))

            Text("No Habits Yet")
                .font(.title2)
                .fontWeight(.semibold)

            Text("Start building better habits by creating your first one!")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            Button(action: { showingAddHabit = true }) {
                Label("Create Habit", systemImage: "plus.circle.fill")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding(.horizontal, 30)
                    .padding(.vertical, 12)
                    .background(Color("PrimaryColor"))
                    .cornerRadius(12)
            }
            .padding(.top, 10)
        }
    }
}

#Preview {
    HabitsListView()
        .environmentObject(HabitsViewModel())
        .environmentObject(CategoriesViewModel())
}
