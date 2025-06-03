import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          // Use direct PostgreSQL connection instead of Prisma
          const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
          })

          const client = await pool.connect()

          try {
            const userQuery = 'SELECT "id", "email", "password", "name", "role" FROM "users" WHERE "email" = $1'
            const result = await client.query(userQuery, [credentials.email])

            if (result.rows.length === 0) {
              console.log('User not found:', credentials.email)
              return null
            }

            const user = result.rows[0]
            console.log('User found:', { email: user.email, role: user.role })

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isPasswordValid) {
              console.log('Invalid password for user:', credentials.email)
              return null
            }

            console.log('Authentication successful for:', credentials.email)
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }

          } finally {
            client.release()
            await pool.end()
          }

        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
