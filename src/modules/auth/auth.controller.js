const authService = require("./auth.service");

class AuthController {
  async register(req, res) {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({
          error: "Email, username and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      const result = await authService.register({
        email,
        username,
        password,
      });

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const result = await authService.login({
        email,
        password,
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({
        error: error.message,
      });
    }
  }

  async me(req, res) {
    try {
      const user = await authService.getMe(req.user.userId);

      return res.status(200).json({
        user,
      });
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }
}

module.exports = new AuthController();
