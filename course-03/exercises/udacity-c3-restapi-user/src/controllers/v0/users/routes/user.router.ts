import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { AuthRouter, requireAuth } from './auth.router';
import * as HttpStatus from 'http-status-codes';
import {config} from "../../../../config/config";

const router: Router = Router();

router.use('/auth', AuthRouter);

router.get('/', async (req: Request, res: Response) => {
  return res.status(HttpStatus.OK).send(`Use /api/${config.version}/users/[id]`);
});

router.get('/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await User.findByPk(id);

    return res.status(HttpStatus.OK).send(item);
});

router.delete('/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await User.findByPk(id);
    item.destroy();

    return res.status(HttpStatus.NO_CONTENT).send();
});

export const UserRouter: Router = router;
