const userService = require('./user.service');

class UserController {
  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(
        req.user.userId
      );

      return res.status(200).json({
        user,
      });
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await userService.updateProfile(
        req.user.userId,
        req.body
      );

      return res.status(200).json({
        user,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async searchUsers(req, res) {
    try {
      const { q } = req.query;

      const users = await userService.searchUsers(
        q,
        req.user.userId
      );

      return res.status(200).json({
        users,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();