import { Inject, Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";
import { type senderOptions } from "./notifications.module"


@Injectable()
export class NotificationsService {
  private logFilePath = path.join(__dirname, 'notifications.log');
 
  
  constructor(@Inject('SENDER_OPTIONS') private readonly options: senderOptions) { }

  private async logToFile(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;
    
    try {
      await fs.appendFile(this.logFilePath, logMessage);
    } catch (error) {
      console.error('Error writing to log file', error);
    }
  }

  async sendEmail(to: string, subject: string, message: string): Promise<void> {
    const logMessage = `Email sent from ${this.options.senderEmail} to ${to}: ${subject} ${message}`;
    console.log(logMessage); // Вывод в консоль
    await this.logToFile(logMessage); // Запись в файл
  }

  async sendSMS(to: string, message: string): Promise<void> {
    const logMessage = `SMS sent to from ${this.options.smsGateway} ${to}: ${message}`;
    console.log(logMessage); // Вывод в консоль
    await this.logToFile(logMessage); // Запись в файл
  }
}
