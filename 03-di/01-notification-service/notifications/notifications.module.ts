import { DynamicModule, Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

export interface senderOptions {
  senderEmail: string,
  smsGateway: string,
}

@Module({})
export class NotificationsModule {
  static forRoot(options: senderOptions):  DynamicModule {
    return {
      module: NotificationsModule,
      providers: [
      {
        provide: 'SENDER_OPTIONS',
        useValue: options,
      },
      NotificationsService
      ],
      exports: [NotificationsService],
    };
  }  
}
