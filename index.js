require("dotenv").config();
const debug = require("debug")("app:dev");
const server = require("./src/server");

const port = process.env.PORT || process.env.MK_NODE_PORT;

server.listen(port, () => debug(`Server listening on port ${port}...`));
