import SwiftUI

class ThemeManager: ObservableObject {
    @AppStorage("isDarkMode") var isDarkMode: Bool = true

    func toggleTheme() {
        isDarkMode.toggle()
    }
}
