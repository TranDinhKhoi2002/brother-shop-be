const AppError = require("./util/error");

let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "*",
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new AppError("400", "Socket.io not initialized");
    }
    return io;
  },
};
