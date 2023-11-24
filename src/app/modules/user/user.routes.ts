import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.findAUserById);
router.put('/:userId', UserController.updateAUser);
router.delete('/:userId', UserController.deleteAUserById);

export const UserRoutes = router;
