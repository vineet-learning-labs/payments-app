import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import StatusCodes from '../lib/http/status.js';
import { AccountModel, ZodTransferSchema } from '../db/index.js';
import mongoose from 'mongoose';

const router = Router();

router.get('/balance', authMiddleware, async (req, res)=>{
    try{
        const userId = req.user.sub;

        const userExists = await AccountModel.findOne( {userId: userId });

        if (!userExists){
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "User not found"
            });
        }

        return res.json({
            balance: userExists.balance
        });

    } catch(error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Some error occured while fetching balance, please try again"
        });
    }
});

router.post('/transfer', authMiddleware, async (req, res)=>{
    let session: mongoose.ClientSession | null = null;
    const fromUserID = req.user.sub;
    try{
        const parsed = ZodTransferSchema.safeParse(req.body);
        if (parsed.success === false){
            const errors = Object.values(parsed.error.flatten().fieldErrors).flat();
            return res.status(StatusCodes.BAD_REQUEST).json({
                errors
            });
        }

        const toUserID = parsed.data.to;
        const amount = parsed.data.amount;

        session = await mongoose.startSession();
        session.startTransaction();

        const fromUserExists = await AccountModel.findOne( {userId: fromUserID}).session(session);
        const toUserExists = await AccountModel.findOne( {userId: toUserID}).session(session);

        if (!fromUserExists || !toUserExists){
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "User(s) not found"
            });
        }
        
        const balance = fromUserExists.balance;

        const debitResult = await AccountModel.updateOne({
            userId: fromUserID,
            balance: { $gte: amount }
        }, {
            $inc: {
                balance: -amount
            }
        }, {session});

        if (debitResult.modifiedCount === 0) {
            await session.abortTransaction();

            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Insufficient balance"
            });
        }

        const creditResult = await AccountModel.updateOne({
            userId: toUserID
        }, {
            $inc: {
                balance: amount
            }
        }, {session});

        await session.commitTransaction();

        return res.status(StatusCodes.OK).json({
            message: "Transfer successful"
        });

    } catch(error){
        console.error(error);

        if (session?.inTransaction()) {
            await session.abortTransaction();
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Some error occured while money transfer, please try again"
        });
    } finally{
        if (session)
            await session.endSession();
    }
});

export default router;