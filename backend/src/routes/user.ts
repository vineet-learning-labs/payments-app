import { Router } from 'express';
import { ZodSignInSchema, ZodUserSchema, UserModel, ZodUpdateSchema, AccountModel } from '#db/index.js';
import { type JWTPayload, signJwt } from '#lib/jwt/jwt.js'
import StatusCodes from "#lib/http/status.js";
import * as argon2 from 'argon2'
import { authMiddleware } from '../middlewares/authMiddleware.js';
import mongoose from "mongoose";

const router = Router();

router.post('/signup', async(req, res)=>{
    let session: mongoose.ClientSession | null = null;  // ! defined session outside try => no decl errors
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
                errors: ["Username already exists"]
            });
        }

        const hashedPassword = await argon2.hash(user.password);
        const newUser = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            password: hashedPassword,
        };

        session = await mongoose.startSession();                    // ? SESSION STARTS
        session.startTransaction();                                 // ! TRANSACTION STARTS

        const [userCreated] = await UserModel.create([newUser], {session});

        const AccountCreated = await AccountModel.create([{
            userId: userCreated!._id
        }], {session});

        await session.commitTransaction();                          // ! COMMIT DB WRITES

        const payload: JWTPayload = {
            sub: userCreated!._id.toString(),
            username: newUser.username,
            role: 'user',
        }
        const userToken = signJwt(payload);

        return res.status(StatusCodes.CREATED).json({
            message: "User created successfully",
            token: userToken
        });
        
    } catch(error){
        console.error(error);

        if (session?.inTransaction()) {
            await session.abortTransaction();
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: ["Some error occured while sign-up, please try again"]
        });
    } finally{
        if (session)
            await session.endSession();                             // ? SESSION ENDS
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
                errors: ["Invalid username or password"]
            });
        }

        const storedHash = userExists.password;
        const match = await argon2.verify(storedHash, user.password);

        if (!match){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                errors: ["Invalid username or password"]
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
            errors: ["Some error occured while sign-in, please try again"]
        });
    }
});

router.put('/', authMiddleware, async(req, res)=>{
    try{
        const userId = req.user.sub;
        const parsed = ZodUpdateSchema.safeParse(req.body);
        if (parsed.success === false){
            const errors = Object.values(parsed.error.flatten().fieldErrors).flat();
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors
            });
        }

        const user = parsed.data;
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            user
        );

        if (!updateUser){
            return res.status(StatusCodes.NOT_FOUND).json({
                errors: ["User not found"]
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "User updated sucessfully"
        });
    } catch(error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: ["Some error occured while updating user, please try again"]
        });
    }
});

router.get('/bulk', authMiddleware, async (req, res)=>{
    try{
        const userFilter = req.query.filter as string || "";
        
        const allUsers = await UserModel.find( {
            $or: [
                { firstName: { $regex: userFilter, $options: "i" } },
                { lastName: { $regex: userFilter, $options: "i" } }
            ]
        });

        return res.status(StatusCodes.OK).json({
            users: allUsers
        });
    } catch(error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: ["Some error occured while fetching user, please try again"]
        });
    }
});

export default router;