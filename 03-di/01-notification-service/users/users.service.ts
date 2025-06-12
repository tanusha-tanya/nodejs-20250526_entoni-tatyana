import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.model";

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: "User1", email: "user1@mail.com", phone: "+79127451471" },
    { id: 2, name: "User2", email: "user2@mail.com", phone: "+987654321" },
    { id: 3, name: "User3", email: "", phone: "987654321" },
    { id: 4, name: "User4", email: "user2mail.com", phone: "" },
  ];

  getUserById(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(`user with id ${id} is not found`);
    return user;
  }
}
