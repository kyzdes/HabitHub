import SwiftUI

struct MainTabView: View {
    @StateObject private var habitsViewModel = HabitsViewModel()
    @StateObject private var categoriesViewModel = CategoriesViewModel()
    @StateObject private var statsViewModel = StatisticsViewModel()

    var body: some View {
        TabView {
            HabitsListView()
                .tabItem {
                    Label("Habits", systemImage: "checkmark.circle.fill")
                }
                .environmentObject(habitsViewModel)
                .environmentObject(categoriesViewModel)

            StatisticsView()
                .tabItem {
                    Label("Stats", systemImage: "chart.bar.fill")
                }
                .environmentObject(statsViewModel)
                .environmentObject(habitsViewModel)

            CategoriesView()
                .tabItem {
                    Label("Categories", systemImage: "folder.fill")
                }
                .environmentObject(categoriesViewModel)

            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
        }
        .task {
            await loadData()
        }
    }

    private func loadData() async {
        async let habits: () = habitsViewModel.loadHabits()
        async let completions: () = habitsViewModel.loadCompletions()
        async let categories: () = categoriesViewModel.loadCategories()
        async let stats: () = statsViewModel.loadStats()

        await (habits, completions, categories, stats)
    }
}

#Preview {
    MainTabView()
        .environmentObject(AuthenticationViewModel())
        .environmentObject(ThemeManager())
}
