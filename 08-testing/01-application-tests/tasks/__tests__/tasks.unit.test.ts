import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

describe("TasksService", () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTasksRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  let mockRepository: typeof mockTasksRepository;

  beforeEach(async () => {
     mockRepository = { ...mockTasksRepository };
     const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);    
  });

  afterEach(() => {
    // Сбрасываем все вызовы и реализации моков после каждого теста
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const dto: CreateTaskDto = { title: "Test", description: "Desc" };
      const createdTask = { id: 1, ...dto, isCompleted: false };
      mockRepository.create.mockReturnValue(createdTask);
      mockRepository.save.mockResolvedValue(createdTask);
      const result = await service.create(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdTask);
      expect(result).toEqual(createdTask);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const tasks = [
        { id: 1, title: "Test task", description: "desc", isCompleted: false },
      ];
      mockRepository.find.mockResolvedValue(tasks);
      const result = await service.findAll();
      expect(result).toEqual(tasks);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should return a task when it exists", async () => {
      const task = { id: 1, title: "Test", description: "desc", isCompleted: false };
      mockRepository.findOneBy.mockResolvedValue(task);
      const result = await service.findOne(1);
      expect(result).toEqual(task);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it("should throw NotFoundException when task does not exist", async () => {
      mockRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a task when it exists", async () => {
      const oldTask = { id: 1, title: "Old", description: "desc", isCompleted: false };
      const updateDto: UpdateTaskDto = { title: "New", isCompleted: true };
      const updatedTask = { ...oldTask, ...updateDto };
      mockRepository.findOneBy.mockResolvedValue(oldTask);
      mockRepository.save.mockResolvedValue(updatedTask);
      const result = await service.update(1, updateDto);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTask);
      expect(result).toEqual(updatedTask);
    });

    it("should throw NotFoundException when task to update does not exist", async () => {
      mockRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.update(1, { title: "New", isCompleted: true })).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should remove a task when it exists", async () => {
      const task = { id: 1, title: "Test", description: "desc", isCompleted: false };
      mockRepository.findOneBy.mockResolvedValue(task);
      mockRepository.remove.mockResolvedValue(task);
      await service.remove(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.remove).toHaveBeenCalledWith(task);
    });

    it("should throw NotFoundException when task to remove does not exist", async () => {
      mockRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
