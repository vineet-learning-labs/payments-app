import jwt, { type JwtPayload } from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET!;

export type JWTPayload = {
    sub: string,
    username: string,
    role: 'user' | 'admin',
}

if (!jwt_secret) {
    throw new Error("JWT_SECRET is missing");
}

export const signJwt=(payload: JWTPayload): string => {
    const token = jwt.sign(payload, jwt_secret, { expiresIn: "30d" });
    return token;
};

export const verifyJwt=(token: string): JWTPayload => {
    return jwt.verify(token, jwt_secret) as JWTPayload;
};