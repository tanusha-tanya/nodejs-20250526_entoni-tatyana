import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // Получаем репозиторий для очистки между тестами
    repository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      // Создаём задачу
      await repository.save({ title: "Test", description: "Test", isCompleted: false });
      const response = await request(app.getHttpServer()).get("/tasks");  
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toMatchObject({ title: "Test", description: "Test", isCompleted: false });
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      // Сначала создаём задачу
      const created = await request(app.getHttpServer()).post("/tasks").send({
        title: "Test",
        description: "Test",
      });
      const id = created.body.id;
      const response = await request(app.getHttpServer()).get(`/tasks/${id}`);  
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id,
        title: "Test",
        description: "Test",
        isCompleted: false,
      });
    });

    it("should return 404 if task not found", async () => {
      const response = await request(app.getHttpServer()).get("/tasks/9999");  
      expect(response.status).toBe(404);
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app.getHttpServer()).post("/tasks").send({
        title: "Test",
        description: "Test",
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: "Test",
        description: "Test",
        isCompleted: false,
      });
      expect(response.body).toHaveProperty("id");
      // Проверяем, что задача действительно появилась в базе
      const dbTask = await repository.findOneBy({ id: response.body.id });
      expect(dbTask).toBeDefined();
      expect(dbTask).toMatchObject({
        title: "Test",
        description: "Test",
        isCompleted: false,
      });
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update an existing task", async () => {
      // Сначала создаём задачу
      const created = await request(app.getHttpServer()).post("/tasks").send({
        title: "Test",
        description: "Test",
      });
      const id = created.body.id;
      const response = await request(app.getHttpServer()).patch(`/tasks/${id}`).send({
        title: "Updated",
        description: "Updated",
        isCompleted: true,
      });
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id,
        title: "Updated",
        description: "Updated",
        isCompleted: true,
      });
      // Проверяем, что задача обновлена в базе
      const dbTask = await repository.findOneBy({ id });
      expect(dbTask).toBeDefined();
      expect(dbTask).toMatchObject({
        title: "Updated",
        description: "Updated",
        isCompleted: true,
      });
    });

    it("should return 404 when updating non-existent task", async () => {
      const response = await request(app.getHttpServer()).patch("/tasks/9999").send({
        title: "Test",
        description: "Test",
        isCompleted: true,
      });
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete an existing task", async () => {
      // Сначала создаём задачу
      const created = await request(app.getHttpServer()).post("/tasks").send({
        title: "Test",
        description: "Test",
      });
      const id = created.body.id;
      const response = await request(app.getHttpServer()).delete(`/tasks/${id}`);
      expect(response.status).toBe(200);
      // Проверяем, что задача удалена из базы
      const dbTask = await repository.findOneBy({ id });
      expect(dbTask).toBeNull();
    });

    it("should return 404 when deleting non-existent task", async () => {
      const response = await request(app.getHttpServer()).delete("/tasks/9999");
      expect(response.status).toBe(404);
    });
  });
});
