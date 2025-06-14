import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";

export class ApiVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler):Observable<any> {
    const start = Date.now();

    return next
      .handle()
      .pipe(
        map((data) => {
          const response = context.switchToHttp().getResponse();
          const executionTime = Date.now() - start; 

          response.json({
            ...data,
            apiVersion: "1.0",
            executionTime: `${executionTime}ms`,
          });
        }),
      );
  }
}
