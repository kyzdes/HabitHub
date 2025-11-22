import SwiftUI

struct AddCategoryView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var categoriesViewModel: CategoriesViewModel

    @State private var name = ""
    @State private var selectedColor = Color.blue
    @State private var selectedIcon = "folder.fill"
    @State private var isCreating = false

    let iconOptions = [
        "folder.fill", "star.fill", "heart.fill", "briefcase.fill",
        "house.fill", "lightbulb.fill", "gift.fill", "gamecontroller.fill",
        "music.note", "book.fill", "graduationcap.fill", "paintbrush.fill"
    ]

    let colorOptions: [Color] = [
        .blue, .purple, .pink, .red, .orange,
        .yellow, .green, .cyan, .indigo, .teal
    ]

    var body: some View {
        NavigationView {
            Form {
                Section("Basic Information") {
                    TextField("Category Name", text: $name)
                }

                Section("Icon") {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 6), spacing: 15) {
                        ForEach(iconOptions, id: \.self) { icon in
                            Button(action: { selectedIcon = icon }) {
                                Image(systemName: icon)
                                    .font(.title2)
                                    .foregroundColor(selectedIcon == icon ? .white : selectedColor)
                                    .frame(width: 44, height: 44)
                                    .background(selectedIcon == icon ? selectedColor : Color.gray.opacity(0.2))
                                    .cornerRadius(10)
                            }
                        }
                    }
                    .padding(.vertical, 8)
                }

                Section("Color") {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 10), spacing: 12) {
                        ForEach(colorOptions, id: \.self) { color in
                            Button(action: { selectedColor = color }) {
                                Circle()
                                    .fill(color)
                                    .frame(width: 36, height: 36)
                                    .overlay(
                                        Circle()
                                            .stroke(Color.white, lineWidth: selectedColor == color ? 3 : 0)
                                    )
                                    .shadow(color: selectedColor == color ? color.opacity(0.5) : .clear, radius: 4)
                            }
                        }
                    }
                    .padding(.vertical, 8)
                }
            }
            .navigationTitle("New Category")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button(action: createCategory) {
                        if isCreating {
                            ProgressView()
                        } else {
                            Text("Create")
                                .fontWeight(.semibold)
                        }
                    }
                    .disabled(name.isEmpty || isCreating)
                }
            }
        }
    }

    private func createCategory() {
        isCreating = true

        Task {
            let success = await categoriesViewModel.createCategory(
                name: name,
                color: selectedColor.toHex() ?? "#0000FF",
                icon: selectedIcon
            )

            isCreating = false

            if success {
                dismiss()
            }
        }
    }
}

#Preview {
    AddCategoryView()
        .environmentObject(CategoriesViewModel())
}
