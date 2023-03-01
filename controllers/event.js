const Event = require("../models/event");

exports.getReadyToSellEvent = async (req, res, next) => {
  try {
    const readyToSellEvents = await Event.find({ title: { $regex: "Mở Bán" } }).populate("relatedProducts");
    res.status(200).json({ events: readyToSellEvents });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};

exports.getEventByTag = async (req, res, next) => {
  const eventTag = req.params.eventTag;

  try {
    const event = await Event.findOne({ tag: eventTag }).populate("relatedProducts");
    res.status(200).json({ event });
  } catch (err) {
    const error = new Error("Có lỗi xảy ra, vui lòng thử lại sau");
    error.statusCode = 500;
    next(error);
  }
};
