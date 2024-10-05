const router = require('express').Router();
const StoreDataController = require('../controllers/StoreDataController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes for store data management
router.post('/', authMiddleware(['admin']), StoreDataController.createStoreData);
router.get('/', authMiddleware(['user', 'admin']), StoreDataController.getAllStoreData);
router.get('/:id', authMiddleware(['user', 'admin']), StoreDataController.getStoreDataById);
router.put('/:id', authMiddleware(['admin']), StoreDataController.updateStoreData);
router.delete('/:id', authMiddleware(['admin']), StoreDataController.deleteStoreData);

module.exports = router;
