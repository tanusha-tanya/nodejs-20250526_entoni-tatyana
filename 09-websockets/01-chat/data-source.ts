import "dotenv/config";

import { DataSource } from "typeorm";
import { User } from "./users/entities/user.entity";
import { Message } from "./chat/entities/message.entity";

const isTest = process.env.NODE_ENV === 'test';

export default new DataSource({
  type: "sqlite",
  database: isTest ? ':memory:' : "db.sqlite",
  entities: [User, Message],
  migrations: ["migrations/*.ts"],
  synchronize: isTest,
});
