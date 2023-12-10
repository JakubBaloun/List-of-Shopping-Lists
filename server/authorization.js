const jwt = require('jsonwebtoken');
const ShoppingList = require('./models/ShoppingList');

const extractUserIdFromJWT = (req) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decoded = jwt.verify(token, 'tajnyKlicProPodpisJWT');
      return decoded.userId; // předpokládám, že v JWT je pole 'userId'
    } catch (error) {
      console.error(error);
    }
  }

  return null;
};

const authorize = (role) => {
  return async (req, res, next) => {
    const userId = extractUserIdFromJWT(req);
    const listId = req.params.id;

    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const list = await ShoppingList.findById(listId);
    if (!list) {
      return res.status(404).json({ status: 'error', message: 'Shopping list not found' });
    }

    const isOwner = list.owner.toString() === userId;
    const isMember = list.members.map(member => member.toString()).includes(userId);

    if (role === 'owner' && !isOwner) {
      return res.status(403).json({ status: 'error', message: 'You must be the owner of this shopping list' });
    }

    if (role === 'member' && !isMember) {
      return res.status(403).json({ status: 'error', message: 'You must be a member of this shopping list' });
    }

    if (role === 'ownerOrMember' && !isOwner && !isMember) {
      return res.status(403).json({ status: 'error', message: 'You must be the owner or a member of this shopping list' });
    }

    next();
  };
};

const requireAuth = (req, res, next) => {
  const userId = extractUserIdFromJWT(req);

  if (userId) {
    req.userId = userId; // Přidání ID uživatele do objektu 'req' pro další použití
    return next();
  }

  res.status(401).json({ status: 'error', message: 'Unauthorized' });
};

module.exports = { authorize, requireAuth, extractUserIdFromJWT };
