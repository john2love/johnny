const Material = require("../models/Material");

class MaterialService {

  async createMaterial(data, file) {
    return await Material.create({
      title: data.title,
      price: data.price,
      fileUrl: file.path,
      type: file.mimetype.includes("pdf") ? "PDF" : "Video",
      status: "draft"
    });
  }

  async getMaterials() {
    return await Material.find().sort({ createdAt: -1 });
  }

  async updateStatus(id, status) {
    return await Material.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

  async deleteMaterial(id) {
    return await Material.findByIdAndDelete(id);
  }
}

module.exports = new MaterialService();