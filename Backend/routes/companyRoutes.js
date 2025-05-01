const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    completeProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    deleteProfileAndRelatedData
} = require('../controllers/companyController');

router.use(auth);

router.post('/complete-profile', completeProfile);

router.get('/', getProfile);

router.put('/', updateProfile);

router.delete('/deleteProfile', deleteProfile);

router.delete('/deleteProfileAndRelatedData', deleteProfileAndRelatedData);

module.exports = router;