import Notification from "../models/notification.model.js";
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const notifications = await Notification.find({ to: userId })
      .populate({
        path: "from",
        select: "username profileImg",
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!notifications) {
      return res.status(404).json({ message: "No notifications found" });
    }

    await Notification.updateMany({ to: userId, read: false }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getNotifications controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Changed from req.user_id to req.user._id
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const result = await Notification.deleteMany({ to: userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found to delete" });
    }

    res.status(200).json({
      message: "Notifications deleted successfully",
      count: result.deletedCount,
    });
  } catch (error) {
    console.error("Error in deleteNotifications controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
