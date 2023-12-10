const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const { extractUserIdFromJWT } = require('../authorization')
const UserService = require('../services/userService');
const ShoppingList = require('../models/ShoppingList');


const shoppingListSchema = Joi.object({
  name: Joi.string().required(),
  owner: Joi.string().required(),
  members: Joi.array().items(Joi.string()).default([]),
  items: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    resolved: Joi.boolean().valid(false).default(false),
  })).default([]),
  archived: Joi.boolean()
});

const idSchema = Joi.string().pattern(new RegExp('^[a-fA-F0-9]{24}$'));

const updateShoppingListNameSchema = Joi.object({
  name: Joi.string().required(),
});

const addUserToShoppingListSchema = Joi.object({
  userId: Joi.string().required(),
})

const addItemToShoppingListSchema = Joi.object({
  name: Joi.string().required(),
});

const removeItemFromShoppingListSchema = Joi.object({
  itemId: Joi.string().required(),
});

const removeUserFromShoppingListSchema = Joi.object({
  memberId: Joi.string().required(),
});

const getAllShoppingLists = async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find();

    res.json({ status: 'success', data: shoppingLists });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

const createShoppingList = async (req, res) => {
  try {
    const { name, members, items } = req.body;

    const userId = extractUserIdFromJWT(req);

    const validatedData = await shoppingListSchema.validateAsync(
      { name, owner: userId, members, items, archived: false },
      { context: { userId } }
    );

    for (const memberId of members) {
      const member = await UserService.getUserById(memberId);
      if (!member) {
        return res.status(400).json({ status: 'error', message: `User with ID ${memberId} does not exist` });
      }
    }

    const shoppingList = new ShoppingList(validatedData);
    const savedShoppingList = await shoppingList.save();

    res.json({ status: 'success', data: validatedData });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};



const deleteShoppingList = async (req, res) => {
  try {
    const shoppingListId = req.params.id;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const shoppingListData = await ShoppingList.findByIdAndDelete(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    res.json({ status: 'success', message: 'Shopping list deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

const updateShoppingListName = async (req, res) => {
  try {
    const shoppingListId = req.params.id;
    const { name } = req.body;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const { error: nameError } = updateShoppingListNameSchema.validate({name});
    if (nameError) {
      return res.status(400).json({ status: 'error', message: 'Invalid name format' });
    }

    const shoppingListData = await ShoppingList.findById(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    shoppingListData.name = name;
    const updatedShoppingList = await shoppingListData.save();

    res.json({ status: 'success', data: updatedShoppingList });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

const addUserToShoppingList = async (req, res) => {
  try {
    const shoppingListId = req.params.id;
    const { userId } = req.body;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const { error: memberError } = addUserToShoppingListSchema.validate({ userId });
    if (memberError) {
      return res.status(400).json({ status: 'error', message: 'Invalid user ID format' });
    }

    const shoppingListData = await ShoppingList.findById(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    shoppingListData.members.push(userId);
    const updatedShoppingList = await shoppingListData.save();

    res.json({ status: 'success', data: { userId, shoppingListId } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

const addItemToShoppingList = async (req, res) => {
  try {
    const shoppingListId = req.params.id;
    const { name, resolved } = req.body;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const { error: itemError } = addItemToShoppingListSchema.validate({ name });
    if (itemError) {
      return res.status(400).json({ status: 'error', message: 'Invalid item format' });
    }

    const shoppingListData = await ShoppingList.findById(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    shoppingListData.items.push({ name });
    const updatedShoppingList = await shoppingListData.save();

    res.json({ status: 'success', data: { name, resolved, shoppingListId } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

const removeItemFromShoppingList = async (req, res) => {
  try {
    const shoppingListId = req.params.id;
    const { itemId } = req.body;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const { error: itemError } = removeItemFromShoppingListSchema.validate({ itemId });
    if (itemError) {
      return res.status(400).json({ status: 'error', message: 'Invalid item ID format' });
    }

    const shoppingListData = await ShoppingList.findById(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    const itemExists = shoppingListData.items.some(item => item.id === itemId);
    if (!itemExists) {
      return res.status(404).json({ status: 'error', message: 'Item not found in the shopping list' });
    }

    shoppingListData.items = shoppingListData.items.filter(item => item.id !== itemId);
    const updatedShoppingList = await shoppingListData.save();

    res.json({ status: 'success', data: { itemId, shoppingListId } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

const getShoppingList = async (req, res) => {
  try {
    const shoppingListId = req.params.id;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const shoppingListData = await ShoppingList.findById(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    res.json({ status: 'success', data: { shoppingListId, shoppingListData } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

const getShoppingListMembers = async (req, res) => {
  try {
    const shoppingListId = req.params.id;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const shoppingListData = await ShoppingList.findById(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    const members = shoppingListData.members;

    res.json({ status: 'success', data: { shoppingListId, members } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

const getShoppingListItems = async (req, res) => {
  try {
    const shoppingListId = req.params.id;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const shoppingListData = await ShoppingList.findById(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    const items = shoppingListData.items;

    res.json({ status: 'success', data: { shoppingListId, items } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

async function removeMemberFromShoppingList(req, res) {
  const shoppingListId = req.params.id;
  const memberId = req.body.memberId;

  if (!isValidId(shoppingListId) || !isValidMemberId(memberId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }

  let shoppingList;
  try {
    shoppingList = await ShoppingList.findById(shoppingListId);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }

  if (!shoppingList || !memberExistsInShoppingList(shoppingList, memberId)) {
    return res.status(404).json({ status: 'error', message: 'Not found' });
  }

  shoppingList.members.pull(memberId);

  try {
    await shoppingList.save();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }

  res.json({ status: 'success', data: { memberId, shoppingListId } });
}

function isValidId(id) {
  const validation = idSchema.validate(id);
  return !validation.error;
}

function isValidMemberId(memberId) {
  const validation = removeUserFromShoppingListSchema.validate({ memberId });
  return !validation.error;
}

function memberExistsInShoppingList(shoppingList, memberId) {
  return shoppingList.members.includes(memberId);
}

async function leaveShoppingList(req, res) {
  const shoppingListId = req.params.id;
  const memberId = extractUserIdFromJWT(req); // ID přihlášeného uživatele

  if (!isValidId(shoppingListId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }

  let shoppingList;
  try {
    shoppingList = await ShoppingList.findById(shoppingListId);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }

  if (!shoppingList || !memberExistsInShoppingList(shoppingList, memberId)) {
    return res.status(404).json({ status: 'error', message: 'Not found' });
  }

  shoppingList.members.pull(memberId);

  try {
    await shoppingList.save();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }

  res.json({ status: 'success', data: { memberId, shoppingListId } });
}

function isValidId(id) {
  const validation = idSchema.validate(id);
  return !validation.error;
}

function memberExistsInShoppingList(shoppingList, memberId) {
  return shoppingList.members.includes(memberId);
}

async function toggleItemResolved(req, res) {
  const shoppingListId = req.params.id;
  const itemId = req.body.itemId; // ID položky je nyní v těle požadavku

  if (!isValidId(shoppingListId) || !isValidId(itemId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  }

  let shoppingList;
  try {
    shoppingList = await ShoppingList.findById(shoppingListId);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }

  if (!shoppingList) {
    return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
  }

  const item = shoppingList.items.id(itemId);
  if (!item) {
    return res.status(404).json({ status: 'error', message: 'Item not found in the shopping list' });
  }

  item.resolved = !item.resolved;

  try {
    await shoppingList.save();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }

  res.json({ status: 'success', data: { itemId, shoppingListId, resolved: item.resolved } });
}

const archiveShoppingList = async (req, res) => {
  try {
    const shoppingListId = req.params.id;

    const { error } = idSchema.validate(shoppingListId);
    if (error) {
      return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
    }

    const shoppingListData = await ShoppingList.findById(shoppingListId);

    if (!shoppingListData) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    shoppingListData.archived = true
    const archivedShoppingList = await shoppingListData.save();

    res.json({ status: 'success', data: archivedShoppingList });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

function isValidId(id) {
  const validation = idSchema.validate(id);
  return !validation.error;
}

function memberExistsInShoppingList(shoppingList, memberId) {
  return shoppingList.members.includes(memberId);
}




module.exports = {
  createShoppingList,
  deleteShoppingList,
  getAllShoppingLists,
  updateShoppingListName,
  addUserToShoppingList,
  addItemToShoppingList,
  removeItemFromShoppingList,
  getShoppingList,
  getShoppingListMembers,
  getShoppingListItems,
  removeMemberFromShoppingList,
  leaveShoppingList,
  toggleItemResolved,
  archiveShoppingList
};