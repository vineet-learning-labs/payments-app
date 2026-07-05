import jwt, { type JwtPayload } from 'jsonwebtoken';

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }

    return secret;
}

export type JWTPayload = {
    sub: string,
    username: string,
    role: 'user' | 'admin',
}

export const signJwt=(payload: JWTPayload): string => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "30d" });
};

export const verifyJwt=(token: string): JWTPayload => {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
};