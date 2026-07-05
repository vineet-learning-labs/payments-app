import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../lib/jwt/jwt.js';
import StatusCodes from "../lib/http/status.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    
    if (!authorization){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Auth header not found"
        })
    }
    
    const token = authorization.split(' ')[1];
    
    if (!token){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Auth token not found"
        })
    }
    
    try{
        const decoded = verifyJwt(token);
        
        req.user = decoded;

        next();
    } catch(error){
        console.error(error);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: "You need to be signed-in for this"
        });
    }
};