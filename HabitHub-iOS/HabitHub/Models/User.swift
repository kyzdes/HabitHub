import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let firstName: String?
    let lastName: String?
    let profileImageUrl: String?
    let provider: String?
    let emailVerified: Bool
    let createdAt: String
    let updatedAt: String

    var displayName: String {
        if let firstName = firstName, let lastName = lastName {
            return "\(firstName) \(lastName)"
        } else if let firstName = firstName {
            return firstName
        } else {
            return email.components(separatedBy: "@").first ?? email
        }
    }

    var initials: String {
        if let firstName = firstName, let lastName = lastName {
            return "\(firstName.prefix(1))\(lastName.prefix(1))".uppercased()
        } else if let firstName = firstName {
            return String(firstName.prefix(2)).uppercased()
        } else {
            let emailName = email.components(separatedBy: "@").first ?? email
            return String(emailName.prefix(2)).uppercased()
        }
    }
}
