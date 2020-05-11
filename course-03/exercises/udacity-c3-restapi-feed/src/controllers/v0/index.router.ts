import { Router, Request, Response } from 'express';
import { FeedRouter } from './feed/routes/feed.router';
import { config } from '../../config/config';

const router: Router = Router();

router.use('/feed', FeedRouter);

router.get('/', async (req: Request, res: Response) => {
    res.send(`Use ${config.version}`);
});

export const V0IndexRouter: Router = router;
