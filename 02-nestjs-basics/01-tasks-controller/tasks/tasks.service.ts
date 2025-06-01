import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Task } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    if(typeof id !== 'string') throw new BadRequestException('id is not a string');
    const task = this.tasks.find(t => t.id === id);
    if(!task) throw new NotFoundException(`task with id ${id} is not found`);
    return task;
  }

  createTask(task: Task): Task {    
    if(!task.hasOwnProperty('title') || !task.hasOwnProperty('description') || !task.hasOwnProperty('status') ) 
      throw new BadRequestException('task object does not contain required fields');
    if(task.status !==  "pending" && task.status !== "in_progress" && task.status !== "completed" ) 
      throw new BadRequestException(`task status ${task.status} is not exist`);
      const newTask: Task = {
      id: Date.now().toString(),
      title: task.title,
      description: task.description,
      status: task.status
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, update: Task): Task {
    if(typeof id !== 'string') throw new BadRequestException('id is not a string');
    const task: undefined | Task = this.tasks.find((t: Task) => t.id === id);    
    if(!task) throw new NotFoundException(`task with id ${id} is not found`);
    if(update.status !==  "pending" && update.status !== "in_progress" && update.status !== "completed" )
    throw new BadRequestException(`task status ${update.status} is not exist`);
    task.title = update.title
    task.description = update.description
    task.status = update.status
    return {id, ...update};
  }

  deleteTask(id: string): Task {
    if(typeof id !== 'string') throw new BadRequestException('id is not a string');
    const task: undefined | Task = this.tasks.find((t:Task) => t.id === id);
    if(!task) throw new NotFoundException(`task with id ${id} is not found`);
    this.tasks = this.tasks.filter((t: Task) => t.id !== id);
    return task;
  }
}
