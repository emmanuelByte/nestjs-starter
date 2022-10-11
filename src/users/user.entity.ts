import { Exclude } from 'class-transformer';
import Post from '../posts/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import PublicFile from 'src/files/publicFile.entity';
import { PrivateFile } from 'src/private-files/privateFile.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  address: Address;

  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  avatar?: PublicFile;

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  files: PrivateFile[];

  @OneToMany(() => Post, (post: Post) => post.author)
  posts: Post[];
}
