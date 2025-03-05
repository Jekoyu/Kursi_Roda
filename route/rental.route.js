const express = require("express");
const router = express.Router();

const requestValidation = require("../middleware/request-validation.middleware"); // validation request

// Path grup untuk rental
const pathGroup = "rental";

// Controller untuk transaksi penyewaan kursi roda
const rentalController = require("../src/controller/rental.controller");

// Validasi untuk transaksi penyewaan
const rentalValidationRules = require("../src/validation/rental.validation");

// Get semua transaksi penyewaan untuk user
router.get(`/${pathGroup}`, rentalController.showAllRentals);

// Get detail transaksi penyewaan berdasarkan rental_id
router.get(`/${pathGroup}/:id`, rentalController.rentalDetail);

// Buat transaksi penyewaan baru
router.post(
  `/${pathGroup}`,
  rentalValidationRules.create,
  requestValidation,
  rentalController.createRental
);

// Update transaksi penyewaan (misalnya setelah kursi roda dikembalikan)
router.patch(
  `/${pathGroup}/:id`,
  rentalValidationRules.update,
  requestValidation,
  rentalController.updateRental
);

// Batalkan transaksi penyewaan (soft-delete)
router.delete(
  `/${pathGroup}/:id`,
  rentalValidationRules.cancel,
  requestValidation,
  rentalController.cancelRental
);

module.exports = router;
