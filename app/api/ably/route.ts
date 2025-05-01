import Ably from 'ably'
import { NextRequest, NextResponse } from 'next/server'

const rest = new Ably.Rest(process.env.ABLY_API_KEY || 'fake:fake')

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    try {
        const tokenParams = {
            clientId: userId,
        }
        const tokenRequest = await rest.auth.createTokenRequest(tokenParams)
        return NextResponse.json(tokenRequest)
    } catch (err) {
        return NextResponse.json({ error: 'Error requesting token', details: err }, { status: 500 })
    }
}
