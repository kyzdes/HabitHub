import SwiftUI

struct AddHabitView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var habitsViewModel: HabitsViewModel
    @EnvironmentObject var categoriesViewModel: CategoriesViewModel

    @State private var name = ""
    @State private var description = ""
    @State private var selectedCategory: Category?
    @State private var selectedIcon = "checkmark.circle.fill"
    @State private var selectedColor = Color.blue
    @State private var frequency = "daily"
    @State private var isCreating = false

    let iconOptions = [
        "checkmark.circle.fill", "star.fill", "heart.fill", "flame.fill",
        "book.fill", "dumbbell.fill", "leaf.fill", "drop.fill",
        "brain.head.profile", "figure.run", "bed.double.fill", "fork.knife"
    ]

    let colorOptions: [Color] = [
        .blue, .purple, .pink, .red, .orange,
        .yellow, .green, .cyan, .indigo
    ]

    var body: some View {
        NavigationView {
            Form {
                Section("Basic Information") {
                    TextField("Habit Name", text: $name)

                    TextField("Description (Optional)", text: $description, axis: .vertical)
                        .lineLimit(3...6)
                }

                Section("Category") {
                    Picker("Category", selection: $selectedCategory) {
                        Text("None").tag(nil as Category?)
                        ForEach(categoriesViewModel.categories) { category in
                            HStack {
                                Circle()
                                    .fill(category.swiftUIColor)
                                    .frame(width: 12, height: 12)
                                Text(category.name)
                            }
                            .tag(category as Category?)
                        }
                    }
                }

                Section("Appearance") {
                    // Icon Selection
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Icon")
                            .font(.headline)

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
                    }
                    .padding(.vertical, 8)

                    // Color Selection
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Color")
                            .font(.headline)

                        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 9), spacing: 12) {
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
                    }
                    .padding(.vertical, 8)
                }

                Section("Frequency") {
                    Picker("Frequency", selection: $frequency) {
                        Text("Daily").tag("daily")
                        Text("Weekly").tag("weekly")
                    }
                    .pickerStyle(.segmented)
                }
            }
            .navigationTitle("New Habit")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button(action: createHabit) {
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

    private func createHabit() {
        isCreating = true

        Task {
            let success = await habitsViewModel.createHabit(
                name: name,
                description: description.isEmpty ? nil : description,
                categoryId: selectedCategory?.id,
                icon: selectedIcon,
                color: selectedColor.toHex(),
                frequency: frequency
            )

            isCreating = false

            if success {
                dismiss()
            }
        }
    }
}

#Preview {
    AddHabitView()
        .environmentObject(HabitsViewModel())
        .environmentObject(CategoriesViewModel())
}
