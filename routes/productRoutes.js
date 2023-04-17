const express = require('express');
const { addProduct, updateProduct, deleteProduct, getAllProduct, getSingleNote } = require('../Controller/productController');
const { isAuthenticated } = require('../middleware/auth');

const router  = express.Router();

router.route("/add-note").post(isAuthenticated,addProduct);
router.route("/update-note/:id").put(isAuthenticated,updateProduct);
router.route("/delete-note/:id").delete(isAuthenticated,deleteProduct);
router.route("/get-notes").get(isAuthenticated,getAllProduct);
router.route("/get-single-note/:id").get(isAuthenticated,getSingleNote)
module.exports  = router