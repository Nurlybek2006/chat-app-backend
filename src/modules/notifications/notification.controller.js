const notificationService =
  require('./notification.service');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const notifications =
        await notificationService
          .getNotifications(
            req.user.userId
          );

      return res.status(200).json({
        notifications,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const unreadCount =
        await notificationService
          .getUnreadCount(
            req.user.userId
          );

      return res.status(200).json({
        unreadCount,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const { notificationId } =
        req.params;

      const notification =
        await notificationService
          .markAsRead(
            req.user.userId,
            notificationId
          );

      return res.status(200).json({
        notification,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const result =
        await notificationService
          .markAllAsRead(
            req.user.userId
          );

      return res.status(200).json({
        message:
          'All notifications marked as read',
        count: result.count,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async deleteNotification(req, res) {
    try {
      const { notificationId } =
        req.params;

      const result =
        await notificationService
          .deleteNotification(
            req.user.userId,
            notificationId
          );

      return res.status(200).json(
        result
      );
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports =
  new NotificationController();