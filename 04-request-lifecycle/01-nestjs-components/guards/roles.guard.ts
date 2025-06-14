import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";



@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext):  boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const role = req.headers["x-role"];

    if(role !== "admin"){
      throw new ForbiddenException(`Доступ запрещён: требуется роль admin`);
    }
    return true;
  }
}
