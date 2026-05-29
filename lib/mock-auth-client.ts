// Cliente de autenticación mock para desarrollo
// Se usa cuando necesitamos simular autenticación sin conexión a BD

import { mockUser } from "./mock-data"

interface AuthResponse {
  data?: { user: any; session: any }
  error?: { message: string }
}

export const mockAuthClient = {
  signUp: {
    email: async (credentials: {
      email: string
      password: string
      name: string
    }): Promise<AuthResponse> => {
      console.log("🔐 Mock: Usuario registrado", credentials)
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Validar contraseña mínimo 8 caracteres
      if (credentials.password.length < 8) {
        return {
          error: { message: "La contraseña debe tener al menos 8 caracteres" },
        }
      }

      return {
        data: {
          user: {
            id: "user_" + Math.random().toString(36).substr(2, 9),
            email: credentials.email,
            name: credentials.name,
            emailVerified: true,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          session: {
            id: "sess_" + Math.random().toString(36).substr(2, 9),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            token: "mock_token_" + Math.random().toString(36).substr(2, 20),
          },
        },
      }
    },
  },
  signIn: {
    email: async (credentials: {
      email: string
      password: string
    }): Promise<AuthResponse> => {
      console.log("🔐 Mock: Usuario iniciando sesión", credentials.email)
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Para demo, cualquier email/password válido funciona
      if (!credentials.email || !credentials.password) {
        return {
          error: { message: "Email y contraseña son requeridos" },
        }
      }

      return {
        data: {
          user: {
            ...mockUser,
            email: credentials.email,
          },
          session: {
            id: "sess_" + Math.random().toString(36).substr(2, 9),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            token: "mock_token_" + Math.random().toString(36).substr(2, 20),
          },
        },
      }
    },
  },
  getSession: async () => {
    // Retorna mock session si está autenticado
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("mock_session")
      if (session) {
        return { user: mockUser, session: JSON.parse(session) }
      }
    }
    return null
  },
}
