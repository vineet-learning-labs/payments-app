import { Router } from 'express';
import userRouter from '#routes/user.js'

const router = Router();

router.use('/user', userRouter);
router.use('/accounts', userRouter);

export default router;