import Inventory from '../models/Inventory.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// GET /api/inventory
const getInventoryItems = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const { search, category, status, sort } = req.query;

  const query = {};

  if (search) {
    // text search on name and description
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) query.category = category;
  if (status) query.status = status;

  let sortObj = { createdAt: -1 };
  if (sort) {
    // example sort=price:asc or sort=price:desc
    const [field, order] = sort.split(':');
    sortObj = { [field]: order === 'asc' ? 1 : -1 };
  }

  const total = await Inventory.countDocuments(query);
  const items = await Inventory.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  res.json({
    page,
    pages: Math.ceil(total / limit),
    total,
    count: items.length,
    items,
  });
});

// GET /api/inventory/:id
const getInventoryItemById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid item id');
  }
  const item = await Inventory.findById(req.params.id);

  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// POST /api/inventory
const createInventoryItem = asyncHandler(async (req, res) => {

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const {
    name,
    description = '',
    sku,
    category,
    price = 0,
    quantity = 0,
    minStock = 0,
    supplier = '',
    status = 'in-stock',
    image = imagePath,
  } = req.body;

  // basic validation
  if (!name || !sku || !category) {
    res.status(400);
    throw new Error('name, sku and category are required');
  }

  // Check duplicate SKU
  const existing = await Inventory.findOne({ sku });
  if (existing) {
    res.status(400);
    throw new Error('SKU already exists');
  }

  const item = new Inventory({
    name,
    description,
    sku,
    category,
    price,
    quantity,
    minStock,
    supplier,
    status,
    image,
  });

  const createdItem = await item.save();
  res.status(201).json(createdItem);
});

// PUT /api/inventory/:id
const updateInventoryItem = asyncHandler(async (req, res) => {

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const {
    name,
    description,
    sku,
    category,
    price,
    quantity,
    minStock,
    supplier,
    status,
    image = imagePath,
  } = req.body;

  const item = await Inventory.findById(req.params.id);

  if (item) {
    // if sku is being changed, ensure uniqueness
    if (sku && sku !== item.sku) {
      const existing = await Inventory.findOne({ sku });
      if (existing) {
        res.status(400);
        throw new Error('SKU already exists');
      }
    }

    item.name = name ?? item.name;
    item.description = description ?? item.description;
    item.sku = sku ?? item.sku;
    item.category = category ?? item.category;
    item.price = price ?? item.price;
    item.quantity = quantity ?? item.quantity;
    item.minStock = minStock ?? item.minStock;
    item.supplier = supplier ?? item.supplier;
    item.status = status ?? item.status;
    item.image = image ?? item.image;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// DELETE /api/inventory/:id
const deleteInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);

  if (item) {
    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

export {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
