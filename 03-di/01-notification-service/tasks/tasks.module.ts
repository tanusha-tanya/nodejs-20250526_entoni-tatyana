import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { NotificationsModule } from "notifications/notifications.module";
import { UsersModule } from "users/users.module";


@Module({
  imports: [NotificationsModule.forRoot({
    senderEmail: 'email@email.ru',
    smsGateway: '4545454',
  }), UsersModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
