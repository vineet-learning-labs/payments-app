import { Router } from 'express';
import { type User, ZodUserSchema, UserModel } from '#db/index.js';
import StatusCodes from "#lib/http/status.js";
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2'

const router = Router();

const jwt_secret = process.env.JWT_SECRET!;

if (!jwt_secret) {
    throw new Error("JWT_SECRET is missing");
}

interface JWTPayload {
    sub: string,
    username: string,
    role: 'user' | 'admin',
}

router.post('/signup', async(req, res)=>{
    try{
        const parsed = ZodUserSchema.safeParse(req.body);
        if (parsed.success === false){
            const errors = Object.values(parsed.error.flatten().fieldErrors).flat();
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors
            });
        }
        const user = parsed.data;
        const userExists = await UserModel.findOne( {username: user.username} );
        if (userExists){
            return res.status(StatusCodes.CONFLICT).json({
                error: "Username already exists"
            });
        }
        const hashedPassword = await argon2.hash(user.password);

        const newUser = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            password: hashedPassword,
        };

        const userCreated = await UserModel.create(newUser);

        const jwtPayload: JWTPayload = {
            sub: userCreated._id.toString(),
            username: newUser.username,
            role: 'user',
        }
        const userToken = jwt.sign(jwtPayload, jwt_secret, { expiresIn: "30d" })

        return res.status(StatusCodes.CREATED).json({
            message: "User created successfully",
            userId: userToken
        });   
    } catch(error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Some error occured, pls try again"
        });
    }
});

router.post('/signin', (req, res)=>{

});

export default router;