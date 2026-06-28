import { Router } from 'express';
import { ZodSignInSchema, ZodUserSchema, UserModel } from '#db/index.js';
import { type JWTPayload, signJwt } from '#lib/jwt/jwt.js'
import StatusCodes from "#lib/http/status.js";
import * as argon2 from 'argon2'

const router = Router();

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

        const payload: JWTPayload = {
            sub: userCreated._id.toString(),
            username: newUser.username,
            role: 'user',
        }
        const userToken = signJwt(payload);

        return res.status(StatusCodes.CREATED).json({
            message: "User created successfully",
            userId: userToken
        });
    } catch(error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Some error occured while sign-up, please try again"
        });
    }
});

router.post('/signin', async (req, res)=>{
    try{
        const parsed = ZodSignInSchema.safeParse(req.body);
        if (parsed.success === false){
            const errors = Object.values(parsed.error.flatten().fieldErrors).flat();
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors
            });
        }

        const user = parsed.data;
        const userExists = await UserModel.findOne( {username: user.username} ).select("+password");

        if (!userExists){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Invalid username or password"
            });
        }

        const storedHash = userExists.password;
        const match = await argon2.verify(storedHash, user.password);

        if (!match){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Invalid username or password"
            });
        }

        const payload: JWTPayload = {
            sub: userExists._id.toString(),
            username: userExists.username,
            role: 'user',
        }
        const userToken = signJwt(payload);

        return res.status(StatusCodes.OK).json({
            token: userToken
        });
    } catch(error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Some error occured while sign-in, please try again"
        });
    }
});

export default router;