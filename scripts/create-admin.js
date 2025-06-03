const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (existingAdmin) {
      console.log('Admin user already exists:')
      console.log('Email:', existingAdmin.email)
      console.log('Name:', existingAdmin.name)
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@pontigram.id',
        name: 'Admin Pontigram',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Admin user created successfully!')
    console.log('Email: admin@pontigram.id')
    console.log('Password: admin123')
    console.log('Name:', admin.name)
    console.log('Role:', admin.role)
    
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
