declare global {
    namespace Express {
        interface Request {
            user: {
                sub: string;
                role: "user" | "admin";
            };
        }
    }
}

export {};