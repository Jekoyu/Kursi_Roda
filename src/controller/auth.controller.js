const authService = require("../service/auth.service");

class AuthController {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.register(username, password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      const { userId } = req.body;
      const result = await authService.logout(userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
