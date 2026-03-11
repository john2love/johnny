const User = require("../models/User");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const Enrollment = require("../models/Enrollment");

class AdminService {

  async getUsers() {
    return await User.find().select("-password");
  }

  async getAnalytics() {
    const courses = await Course.find();

    const analytics = await Promise.all(
      courses.map(async (course) => {
        const enrolled = await Enrollment.countDocuments({ course: course._id });
        const completed = await Enrollment.countDocuments({
          course: course._id,
          completed: true
        });

        return {
          course: course.title,
          enrolled,
          completed
        };
      })
    );

    return analytics;
  }

  async getRevenue() {
    const payments = await Payment.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    return payments.map(p => ({
      month: p._id,
      revenue: p.total
    }));
  }

  async getDashboardData() {
    const [users, analytics, revenue] = await Promise.all([
      this.getUsers(),
      this.getAnalytics(),
      this.getRevenue()
    ]);

    return { users, analytics, revenue };
  }
}

module.exports = new AdminService();