import { Router } from 'express';
import userRouter from '#routes/user.js'
import accountRouter from '#routes/account.js'

const router = Router();

router.use('/user', userRouter);

router.use('/account', accountRouter);

export default router;