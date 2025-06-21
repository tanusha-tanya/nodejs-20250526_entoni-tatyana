import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "./entities/task.entity";

export interface ApiResponse {
  message: string;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    const savedTask = await this.tasksRepository.save(task);      
    return savedTask;
  }

  async findAll(page?: number, limit?: number) {
  
    const arrayFromRepository = await this.tasksRepository.find();

    if (!page || !limit) {
      return arrayFromRepository;
    }
    if (page <= 0 || limit <= 0) {
      throw new BadRequestException('Page and limit must be positive numbers');
    }
      
      const startIndex = (page - 1) * limit;
      const endIndex = Number(startIndex) + Number(limit);
    
    return arrayFromRepository.slice(startIndex, endIndex);
  }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const result = await this.tasksRepository.update(id, updateTaskDto);

  if (result.affected === 0) {
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }  
  return this.findOne(id);
  }


async remove(id: number): Promise<ApiResponse> {
   const result = await this.tasksRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }  
  return { message: "Task deleted successfully" };
  }
}
