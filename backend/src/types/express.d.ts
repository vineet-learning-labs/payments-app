declare global {
    namespace Express {
        interface Request {
            user: {                             // adding user field to Request object where 3 sub-fields MUST exist
                sub: string;                        // "If req.user exists, it must have these 3 + any other properties"
                username: string;
                role: "user" | "admin";
            };
        }
    }
}

export {};