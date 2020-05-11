import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { NextFunction } from 'connect';
import * as jwt from 'jsonwebtoken';
import { config } from '../../../../config/config';
import * as HttpStatus from 'http-status-codes';
import * as EmailValidator from 'email-validator';
import { generatePassword, comparePasswords } from "../../../../util/password";
import { generateJWT } from "../../../../util/jwt";

const router: Router = Router();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
//   return next(); // use this to disable the authentication requirement
    if (!req.headers || !req.headers.authorization) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'No authorization headers.' });
    }

    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length !== 2) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Malformed token.' });
    }

    const token = token_bearer[1];

    return jwt.verify(token, config.jwt.secret , (err, decoded) => {
      if (err) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ auth: false, message: 'Failed to authenticate.' });
      }
      return next();
    });
}

router.get('/verification',
    requireAuth,
    async (req: Request, res: Response) => {
        return res.status(HttpStatus.OK).send({ auth: true, message: 'Authenticated.' });
});

router.post('/login', async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(HttpStatus.BAD_REQUEST).send({ auth: false, message: 'Email is required or malformed' });
    }

    // check email password valid
    if (!password) {
        return res.status(HttpStatus.BAD_REQUEST).send({ auth: false, message: 'Password is required' });
    }

    const user = await User.findByPk(email);
    // check that user exists
    if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ auth: false, message: 'Unauthorized' });
    }

    // check that the password matches
    const authValid = await comparePasswords(password, user.password_hash);

    if (!authValid) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ auth: false, message: 'Unauthorized' });
    }

    // Generate JWT
    const token = generateJWT(user);

    res.status(HttpStatus.OK).send({ auth: true, token: token, user: user.short()});
});

// register a new user
router.post('/', async (req: Request, res: Response) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(HttpStatus.BAD_REQUEST).send({ auth: false, message: 'Email is required or malformed' });
    }

    // check email password valid
    if (!plainTextPassword) {
        return res.status(HttpStatus.BAD_REQUEST).send({ auth: false, message: 'Password is required' });
    }

    // find the user
    const user = await User.findByPk(email);
    // check that user doesnt exists
    if (user) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ auth: false, message: 'User may already exist' });
    }

    const password_hash = await generatePassword(plainTextPassword);

    const newUser = await new User({
        email: email,
        password_hash: password_hash
    });

    let savedUser;
    try {
        savedUser = await newUser.save();
    } catch (e) {
        throw e;
    }

    // Generate JWT
    const token = generateJWT(savedUser);

    res.status(HttpStatus.CREATED).send({token: token, user: savedUser.short()});
});

router.get('/', async (req: Request, res: Response) => {
    res.send('auth');
});

export const AuthRouter: Router = router;
