import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class PublicFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  key: string;
}
