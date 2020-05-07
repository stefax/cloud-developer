import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { NextFunction } from 'connect';
import * as jwt from 'jsonwebtoken';
import * as AWS from '../../../../aws';
import { config } from '../../../../config/config';
import * as HttpStatus from 'http-status-codes';


const c = config.jwt;

const router: Router = Router();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
 //   return next();
     if (!req.headers || !req.headers.authorization) {
         return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'No authorization headers.' });
     }

     const token_bearer = req.headers.authorization.split(' ');
     if (token_bearer.length !== 2) {
         return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Malformed token.' });
     }

     const token = token_bearer[1];
     return jwt.verify(token, c.secret , (err, decoded) => {
       if (err) {
         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ auth: false, message: 'Failed to authenticate.' });
       }
       return next();
     });
}

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if (item.url) {
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });
    res.send(items);
});

// Get a specific resource
router.get('/:id',
    async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await FeedItem.findByPk(id);
    res.send(item);
});

// update a specific resource
router.patch('/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
          return res.status(HttpStatus.NOT_FOUND).send("missing id");
        }

        const item = await FeedItem.findByPk(id);
        if (!item) {
          return res.status(HttpStatus.NOT_FOUND).send(`item for id '${id}' not found.`);
        }

        item.update(req.body);

        res.status(HttpStatus.OK).send(item);
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(HttpStatus.CREATED).send({url: url});
});

// Post meta data and the filename after a file is uploaded
// NOTE the file name is the key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const savedItem = await item.save();

    savedItem.url = AWS.getGetSignedUrl(savedItem.url);
    res.status(HttpStatus.CREATED).send(savedItem);
});

export const FeedRouter: Router = router;
