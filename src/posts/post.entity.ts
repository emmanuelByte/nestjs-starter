import { Transform } from 'class-transformer';
import User from '../users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  @Transform((value) => {
    if (value !== null) {
      return value;
    }
  })
  category?: string;

  @ManyToOne(() => User, (author: User) => author.posts)
  author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  categories: Category[];
}
