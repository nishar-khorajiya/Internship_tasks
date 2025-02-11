const express = require("express");
const {
  createDish,
  getDishesSortedByRating,
  updateDish,
  deleteDish,
} = require("../controllers/dishController");
const validateDish = require("../middleware/validateDish");

const router = express.Router();

//create dish
router.post("/", validateDish, createDish);

//get dishes in sorted order-descending
router.get("/", getDishesSortedByRating);

//update dish
router.put("/:id", validateDish, updateDish);

//delete dish
router.delete("/:id", deleteDish);

module.exports = router;
