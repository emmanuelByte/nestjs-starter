import Post from '../posts/post.entity';
import { Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  posts: Post[];
}
