import { Injectable, BadRequestException } from "@nestjs/common";
import { Task, TaskStatus, SortParam } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  isValidStatus(status: string): boolean {  
    return Object.values(TaskStatus).includes(status as TaskStatus);  
};  
  getFilteredTasks(
    status?: TaskStatus,
    page?: number,
    limit?: number,
    sortBy?: SortParam
  ): Task[] {
    let filteredTask = this.tasks;
    if(sortBy){
      if(sortBy !== "description" && sortBy !== "status"){
        throw new BadRequestException(`sort paametr ${sortBy} is not correct`);
      }
      filteredTask = this.tasks.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);     
    }
    if(status){
      if(!this.isValidStatus(status)){
        throw new BadRequestException(`task status ${status} is not exist`);
      }
      filteredTask = filteredTask.filter(t => t.status === status);      
    }
    if(page && limit){
      if(page <= 0 || limit <= 0){
        throw new BadRequestException(`wrong page or limit`);
      }
      const startIndex = (page - 1) * limit;
      const endIndex = Number(startIndex) + Number(limit);
      filteredTask  = filteredTask.slice(startIndex, endIndex);
      
    }
    return filteredTask;
  }
}