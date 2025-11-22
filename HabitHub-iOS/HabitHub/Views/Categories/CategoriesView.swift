import SwiftUI

struct CategoriesView: View {
    @EnvironmentObject var categoriesViewModel: CategoriesViewModel
    @State private var showingAddCategory = false

    var body: some View {
        NavigationView {
            ZStack {
                if categoriesViewModel.categories.isEmpty && !categoriesViewModel.isLoading {
                    EmptyCategoriesView(showingAddCategory: $showingAddCategory)
                } else {
                    List {
                        ForEach(categoriesViewModel.categories) { category in
                            CategoryRowView(category: category)
                        }
                        .onDelete(perform: deleteCategories)
                    }
                }
            }
            .navigationTitle("Categories")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddCategory = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                    }
                }

                ToolbarItem(placement: .navigationBarLeading) {
                    EditButton()
                }
            }
            .sheet(isPresented: $showingAddCategory) {
                AddCategoryView()
                    .environmentObject(categoriesViewModel)
            }
            .refreshable {
                await categoriesViewModel.loadCategories()
            }
        }
    }

    private func deleteCategories(at offsets: IndexSet) {
        for index in offsets {
            let category = categoriesViewModel.categories[index]
            Task {
                await categoriesViewModel.deleteCategory(id: category.id)
            }
        }
    }
}

struct CategoryRowView: View {
    let category: Category

    var body: some View {
        HStack(spacing: 15) {
            Circle()
                .fill(category.swiftUIColor)
                .frame(width: 40, height: 40)
                .overlay(
                    Image(systemName: category.icon ?? "folder.fill")
                        .foregroundColor(.white)
                        .font(.caption)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(category.name)
                    .font(.headline)

                Text(category.color)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}

struct EmptyCategoriesView: View {
    @Binding var showingAddCategory: Bool

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "folder")
                .font(.system(size: 70))
                .foregroundColor(.gray.opacity(0.5))

            Text("No Categories")
                .font(.title2)
                .fontWeight(.semibold)

            Text("Create categories to organize your habits")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            Button(action: { showingAddCategory = true }) {
                Label("Create Category", systemImage: "plus.circle.fill")
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
    CategoriesView()
        .environmentObject(CategoriesViewModel())
}
