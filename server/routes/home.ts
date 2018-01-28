import { Router } from 'express';
import { join } from 'path';

export const HomeRouter = Router();

HomeRouter.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});
