import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: true })
  text: string;

  @Column()
  username: string;

  @Column()
  date: Date;
}
