// controllers/admin.controller.js

const adminService = require("../services/admin.service");
const { success, error } = require("../utils/response");

/* ===============================
   ADMIN DASHBOARD
   GET /api/admin/dashboard
=============================== */
exports.getDashboard = async (req, res) => {
  try {
    const data = await adminService.getDashboardData();
    return success(res, data);
  } catch (err) {
    console.error("Admin dashboard error:", err);

    return error(
      res,
      err.message || "Internal Server Error",
      err.status || 500
    );
  }
};