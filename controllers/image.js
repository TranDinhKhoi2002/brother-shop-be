const { cloudinary } = require("../util/cloudinary");

exports.getIntroImages = async (req, res, next) => {
  try {
    const { resources } = await cloudinary.search.expression("folder:brothershop/banners/intro").execute();
    if (!resources) {
      const error = new Error("Không tìm thấy ảnh");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ images: resources });
  } catch (err) {
    const error = new Error("Đã có lỗi xảy ra");
    error.statusCode = 500;
    next(error);
  }
};
