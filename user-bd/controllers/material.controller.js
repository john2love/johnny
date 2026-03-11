const materialService = require("../services/material.service");
const { success, error } = require("../utils/response");

/* ===============================
   UPLOAD MATERIAL
=============================== */
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, "File is required", 400);
    }

    const material = await materialService.createMaterial(req.body, req.file);

    return success(res, material, "Material uploaded");
  } catch (err) {
    return error(res, err.message || "Internal Server Error", err.status || 500);
  }
};

/* ===============================
   GET MATERIALS
=============================== */
exports.getMaterials = async (req, res) => {
  try {
    const materials = await materialService.getMaterials();
    return success(res, materials);
  } catch (err) {
    return error(res, err.message || "Internal Server Error", err.status || 500);
  }
};

/* ===============================
   UPDATE MATERIAL STATUS
=============================== */
exports.updateMaterialStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return error(res, "Status must be true or false", 400);
    }

    const updated = await materialService.updateStatus(
      req.params.id,
      status
    );

    return success(res, updated, "Status updated");
  } catch (err) {
    return error(res, err.message || "Internal Server Error", err.status || 500);
  }
};

/* ===============================
   DELETE MATERIAL
=============================== */
exports.deleteMaterial = async (req, res) => {
  try {
    await materialService.deleteMaterial(req.params.id);
    return success(res, null, "Deleted successfully");
  } catch (err) {
    return error(res, err.message || "Internal Server Error", err.status || 500);
  }
};