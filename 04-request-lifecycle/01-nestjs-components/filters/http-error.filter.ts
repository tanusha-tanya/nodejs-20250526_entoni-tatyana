import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus  } from "@nestjs/common";
import { Response } from "express";
import { appendFileSync } from "fs";

export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : "Mock error for testing";
    const timestamp = new Date().toISOString();

    const logMessage = `[${timestamp}] ${status} - ${typeof message === "string" ? message : JSON.stringify(message)}`;
    appendFileSync("errors.log", logMessage + "\n");

    let responseMessage: string;
    if (typeof message === "string") {
      responseMessage = message;
    } else if (typeof message === "object" && message !== null && "message" in message) {
      responseMessage = (message as any).message; 
    } else {
      responseMessage = "Unknown error";
    }
    response.status(status).json({
      statusCode: status,
      message: responseMessage,
      timestamp,
    });
  }
}
