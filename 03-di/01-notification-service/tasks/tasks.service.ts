import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "./task.model";
import { NotificationsService } from "notifications/notifications.service";
import { UsersService } from "users/users.service";
import { User, UserValidationDto } from "users/user.model";
import { validate } from 'class-validator';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly usersService: UsersService
  ) {}

  
  
  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo } = createTaskDto;
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };
    this.tasks.push(task);
    const user: User = this.getUserById(assignedTo);
    await this.validateUserContact(user);
    await this.notificationService.sendEmail(user.email, '[Новая задача]', `Вы назначены ответственным за задачу: '${title}'`)
    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }

    Object.assign(task, updateTaskDto);
    const user: User = this.getUserById(task.assignedTo)
    await this.validateUserContact(user);
    await this.notificationService.sendSMS(user.phone, `Статус задачи '${task.title}' обновлён на '${task.status}'`)
    return task;
  }

  private async validateUserContact(user: User) {
    const userValidationDto = new UserValidationDto();
    userValidationDto.email = user.email;
    userValidationDto.phone = user.phone;

    const errors = await validate(userValidationDto);
    
    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints)).flat();
      throw new BadRequestException(messages.join(', '));
    }
  }
  private getUserById(userId: number): User {
    return this.usersService.getUserById(userId);
  }

}
