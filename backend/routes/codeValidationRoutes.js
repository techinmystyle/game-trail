const express = require('express');
const router = express.Router();
const {
  validateHTMLCode,
  validateCSSCode,
  validateJSCode,
  validatePythonCode,
  validateJavaCode
} = require('../controllers/codeValidationController');
const { protect } = require('../middleware/auth');

// All validation routes are protected (require authentication)

// HTML validation
router.post('/validate/html', protect, validateHTMLCode);

// CSS validation (coming soon)
router.post('/validate/css', protect, validateCSSCode);

// JavaScript validation (coming soon)
router.post('/validate/javascript', protect, validateJSCode);

// Python validation (coming soon)
router.post('/validate/python', protect, validatePythonCode);

// Java validation (coming soon)
router.post('/validate/java', protect, validateJavaCode);

module.exports = router;
