import "dotenv/config";

import { DataSource } from "typeorm";
import { User } from "./users/entities/user.entity";
import { Message } from "./chat/entities/message.entity";

export default new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User, Message],
  migrations: ["migrations/*.ts"],
});
