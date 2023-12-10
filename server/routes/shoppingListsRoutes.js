const express = require('express');
const router = express.Router();
const shoppingListsController = require('../controllers/shoppingListsController');
const { authorize, requireAuth } = require('../authorization.js');

router.get('/get-shopping-list/:id', authorize("ownerOrMember"), shoppingListsController.getShoppingList);
router.post('/create-shopping-list', requireAuth, shoppingListsController.createShoppingList);
router.post('/delete-shopping-list/:id', authorize("owner"), shoppingListsController.deleteShoppingList);
router.get('/view-all-shopping-lists', shoppingListsController.getAllShoppingLists)
router.post('/update-shopping-list-name/:id', authorize("owner"), shoppingListsController.updateShoppingListName)
router.post('/add-user-to-shopping-list/:id', authorize("owner"), shoppingListsController.addUserToShoppingList)
router.post('/add-item-to-shopping-list/:id', authorize("ownerOrMember"), shoppingListsController.addItemToShoppingList)
router.post('/remove-item-from-shopping-list/:id', authorize("ownerOrMember"), shoppingListsController.removeItemFromShoppingList)
router.get('/view-shopping-list-members/:id', authorize("ownerOrMember"), shoppingListsController.getShoppingListMembers);
router.get('/view-shopping-list-items/:id', authorize("ownerOrMember"), shoppingListsController.getShoppingListItems);
router.post('/remove-member-from-shopping-list/:id', authorize("owner"), shoppingListsController.removeMemberFromShoppingList)
router.post('/leave-shopping-list/:id', authorize("member"), shoppingListsController.leaveShoppingList)
router.post('/toggle-item-resolved/:id', authorize("ownerOrMember"), shoppingListsController.toggleItemResolved)
router.post('/archive-shopping-list/:id', authorize("owner"), shoppingListsController.archiveShoppingList)



module.exports = router;
