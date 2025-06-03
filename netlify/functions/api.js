// Netlify function handler for Next.js API routes
const { NextRequest, NextResponse } = require('next/server')

exports.handler = async (event, context) => {
  try {
    // Import the Next.js API handler
    const { handler } = await import('../../.next/server/app/api/health/route.js')
    
    // Create a Next.js request object
    const request = new NextRequest(`https://${event.headers.host}${event.path}`, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body
    })

    // Call the Next.js handler
    const response = await handler(request)
    
    // Convert Next.js response to Netlify response
    const body = await response.text()
    
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: body
    }
  } catch (error) {
    console.error('API handler error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    }
  }
}
