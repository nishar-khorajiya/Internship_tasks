const Dish = require("../models/Dish");


exports.createDish = async (req, res) => {
    try {
        const { name, price, rating } = req.body;
        const newDish = new Dish({ name, price, rating });
        await newDish.save();
        res.status(201).json({ message: "Dish added successfully", newDish });
    } catch (error) {
        res.status(500).json({ message: "Error adding dish", error });
    }
};


exports.getDishesSortedByRating = async (req, res) => {
    try {
        const dishes = await Dish.find().sort({ rating: -1 });
        res.status(200).json(dishes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching dishes", error });
    }
};


exports.updateDish = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDish = await Dish.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedDish) {
            return res.status(404).json({ message: "Dish not found" });
        }
        res.status(200).json({ message: "Dish updated successfully", updatedDish });
    } catch (error) {
        res.status(500).json({ message: "Error updating dish", error });
    }
};


exports.deleteDish = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDish = await Dish.findByIdAndDelete(id);
        if (!deletedDish) {
            return res.status(404).json({ message: "Dish not found" });
        }
        res.status(200).json({ message: "Dish deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting dish", error });
    }
};
