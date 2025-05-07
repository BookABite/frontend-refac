declare module 'auth' {
    export interface TokenPayload {
        userId: string
        role: 'GROUP_ADMIN' | 'SUPER_ADMIN' | 'UNIT_ADMIN' | 'UNIT_SUB_ADMIN' | 'UNIT_STAFF'
        iat?: number
        exp?: number
    }
}
