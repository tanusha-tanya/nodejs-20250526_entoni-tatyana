import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";


export interface ApiResponse {
  message: string;
} 

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

 @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,): Promise<Task[]> {
    return this.tasksService.findAll(page, limit);
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() task: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(id, task);
  }

  @Delete(":id")
  async remove(@Param("id") id: number):  Promise<ApiResponse> {
    return this.tasksService.remove(id);
  }
}
