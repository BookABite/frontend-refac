import { TokenPayload } from 'auth'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export async function verifyToken(token: string): Promise<TokenPayload> {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
        return decoded
    } catch (error) {
        throw new Error('Token inválido ou expirado')
    }
}
