import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { prisma } from '@/lib/prisma'

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
          console.log('❌ Missing credentials')
          return null
        }

        console.log('🔐 Attempting authentication for:', credentials.email)

        try {
          // First try with Prisma
          try {
            console.log('🔍 Trying Prisma authentication...')
            const user = await prisma.user.findUnique({
              where: { email: credentials.email }
            })

            if (!user) {
              console.log('❌ User not found with Prisma:', credentials.email)
              throw new Error('User not found with Prisma')
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isPasswordValid) {
              console.log('❌ Invalid password for user:', credentials.email)
              return null
            }

            console.log('✅ Authentication successful with Prisma:', credentials.email)
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }

          } catch (prismaError) {
            console.log('⚠️ Prisma auth failed, trying PostgreSQL:', prismaError.message)

            // Fallback to direct PostgreSQL connection
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
                console.log('❌ User not found with PostgreSQL:', credentials.email)
                return null
              }

              const user = result.rows[0]
              console.log('✅ User found with PostgreSQL:', { email: user.email, role: user.role })

              const isPasswordValid = await bcrypt.compare(
                credentials.password,
                user.password
              )

              if (!isPasswordValid) {
                console.log('❌ Invalid password for user:', credentials.email)
                return null
              }

              console.log('✅ Authentication successful with PostgreSQL:', credentials.email)
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
          }

        } catch (error) {
          console.error('💥 Authentication error:', error)
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
    },
    async redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after successful login
      if (url.startsWith('/admin/login') || url === baseUrl) {
        return `${baseUrl}/admin`
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
