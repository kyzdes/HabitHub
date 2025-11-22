import Foundation

enum APIError: Error, LocalizedError {
    case invalidURL
    case networkError(Error)
    case invalidResponse
    case decodingError(Error)
    case serverError(String)
    case unauthorized

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .invalidResponse:
            return "Invalid server response"
        case .decodingError(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        case .serverError(let message):
            return message
        case .unauthorized:
            return "Unauthorized - please log in again"
        }
    }
}

class APIClient {
    static let shared = APIClient()

    // MARK: - Configuration
    // TODO: Replace with your actual domain after deployment
    private let baseURL = "https://yourdomain.com/api"
    // For local development:
    // private let baseURL = "http://localhost:5000/api"

    private let session: URLSession

    private init() {
        let config = URLSessionConfiguration.default
        config.httpCookieAcceptPolicy = .always
        config.httpCookieStorage = .shared
        config.httpShouldSetCookies = true
        self.session = URLSession(configuration: config)
    }

    // MARK: - Generic Request Method
    func request<T: Decodable>(
        endpoint: String,
        method: String = "GET",
        body: Encodable? = nil,
        requiresAuth: Bool = true
    ) async throws -> T {
        guard let url = URL(string: "\(baseURL)\(endpoint)") else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        do {
            let (data, response) = try await session.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }

            if httpResponse.statusCode == 401 {
                throw APIError.unauthorized
            }

            if httpResponse.statusCode >= 400 {
                if let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                    throw APIError.serverError(errorResponse.message)
                }
                throw APIError.serverError("Server error: \(httpResponse.statusCode)")
            }

            do {
                let decoded = try JSONDecoder().decode(T.self, from: data)
                return decoded
            } catch {
                throw APIError.decodingError(error)
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }

    // MARK: - Request without response body
    func requestNoResponse(
        endpoint: String,
        method: String = "GET",
        body: Encodable? = nil
    ) async throws {
        guard let url = URL(string: "\(baseURL)\(endpoint)") else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        do {
            let (data, response) = try await session.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }

            if httpResponse.statusCode == 401 {
                throw APIError.unauthorized
            }

            if httpResponse.statusCode >= 400 {
                if let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                    throw APIError.serverError(errorResponse.message)
                }
                throw APIError.serverError("Server error: \(httpResponse.statusCode)")
            }
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }

    // MARK: - Authentication
    func register(email: String, password: String, firstName: String?, lastName: String?) async throws -> User {
        let body = RegisterRequest(
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        )
        return try await request(endpoint: "/auth/register", method: "POST", body: body, requiresAuth: false)
    }

    func login(email: String, password: String) async throws -> User {
        let body = LoginRequest(email: email, password: password)
        return try await request(endpoint: "/auth/login", method: "POST", body: body, requiresAuth: false)
    }

    func logout() async throws {
        try await requestNoResponse(endpoint: "/auth/logout", method: "POST")
    }

    func getCurrentUser() async throws -> User {
        return try await request(endpoint: "/auth/user")
    }

    // MARK: - Habits
    func getHabits(includeArchived: Bool = false) async throws -> [Habit] {
        let endpoint = includeArchived ? "/habits?archived=true" : "/habits"
        return try await request(endpoint: endpoint)
    }

    func createHabit(_ habit: HabitCreate) async throws -> Habit {
        return try await request(endpoint: "/habits", method: "POST", body: habit)
    }

    func updateHabit(id: String, update: HabitUpdate) async throws -> Habit {
        return try await request(endpoint: "/habits/\(id)", method: "PUT", body: update)
    }

    func deleteHabit(id: String) async throws {
        try await requestNoResponse(endpoint: "/habits/\(id)", method: "DELETE")
    }

    func archiveHabit(id: String) async throws -> Habit {
        return try await request(endpoint: "/habits/\(id)/archive", method: "POST")
    }

    func unarchiveHabit(id: String) async throws -> Habit {
        return try await request(endpoint: "/habits/\(id)/unarchive", method: "POST")
    }

    // MARK: - Categories
    func getCategories() async throws -> [Category] {
        return try await request(endpoint: "/categories")
    }

    func createCategory(_ category: CategoryCreate) async throws -> Category {
        return try await request(endpoint: "/categories", method: "POST", body: category)
    }

    func updateCategory(id: String, update: CategoryUpdate) async throws -> Category {
        return try await request(endpoint: "/categories/\(id)", method: "PUT", body: update)
    }

    func deleteCategory(id: String) async throws {
        try await requestNoResponse(endpoint: "/categories/\(id)", method: "DELETE")
    }

    // MARK: - Completions
    func getCompletions(startDate: Date? = nil, endDate: Date? = nil) async throws -> [HabitCompletion] {
        var endpoint = "/completions"
        var queryItems: [String] = []

        if let startDate = startDate {
            queryItems.append("startDate=\(startDate.ISO8601Format())")
        }
        if let endDate = endDate {
            queryItems.append("endDate=\(endDate.ISO8601Format())")
        }

        if !queryItems.isEmpty {
            endpoint += "?" + queryItems.joined(separator: "&")
        }

        return try await request(endpoint: endpoint)
    }

    func createCompletion(habitId: String, date: Date, notes: String? = nil) async throws -> HabitCompletion {
        let body = CompletionCreate(
            habitId: habitId,
            completedDate: date.ISO8601Format().split(separator: "T")[0].description,
            notes: notes
        )
        return try await request(endpoint: "/completions", method: "POST", body: body)
    }

    func deleteCompletion(id: String) async throws {
        try await requestNoResponse(endpoint: "/completions/\(id)", method: "DELETE")
    }

    // MARK: - Statistics
    func getStats(days: Int = 30) async throws -> UserStats {
        return try await request(endpoint: "/stats?days=\(days)")
    }
}

// MARK: - Request/Response Models
struct RegisterRequest: Encodable {
    let email: String
    let password: String
    let firstName: String?
    let lastName: String?
}

struct LoginRequest: Encodable {
    let email: String
    let password: String
}

struct ErrorResponse: Decodable {
    let message: String
}
