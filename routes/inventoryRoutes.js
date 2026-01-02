import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';

const router = express.Router();



router.route('/')
.get(getInventoryItems)
.post(upload.single("image"),createInventoryItem);

router.route('/:id')
.get(getInventoryItemById)
.put(upload.single("image"),updateInventoryItem)
.delete(deleteInventoryItem);



export default router;