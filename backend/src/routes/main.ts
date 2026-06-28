import { Router } from 'express';
import userRouter from '#routes/user.js'
import accountsRouter from '#routes/account.js'

const router = Router();

router.use('/user', userRouter);
router.use('/accounts', accountsRouter);

export default router;