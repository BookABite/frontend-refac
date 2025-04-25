import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const media = formData.get('media') as File
        const phone = formData.get('phone') as string
        const userId = formData.get('userId') as string

        if (!media || !phone || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const response = await fetch(`${process.env.BACKEND_URL}/whatsapp/send-media`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${request.headers.get('authorization')}`,
            },
            body: formData,
        })

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(
                { error: error.message || 'Failed to send media' },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error sending media:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
