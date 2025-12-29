
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [],
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    millId?: string;
}

export class AuthManager {
    static createSession(user: User): string {
        return 'mock-token-' + user.id;
    }

    static verifyToken(token: string): User | null {
        // Mock implementation
        return {
            id: '1',
            email: 'mock@example.com',
            name: 'Mock User',
            role: 'admin'
        };
    }
    static removeSession(token: string): void {
        // Mock implementation
    }
}
