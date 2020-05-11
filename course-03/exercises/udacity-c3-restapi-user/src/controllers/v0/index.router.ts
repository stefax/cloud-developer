import { Router, Request, Response } from 'express';
import { UserRouter } from './users/routes/user.router';
import { config } from '../../config/config';

const router: Router = Router();

router.use('/users', UserRouter);

router.get('/', async (req: Request, res: Response) => {
    res.send(`Use /api/${config.version}/users`);
});

export const V0IndexRouter: Router = router;
