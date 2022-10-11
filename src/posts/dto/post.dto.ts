import { Expose } from 'class-transformer';

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  title: string;
}

export default PostDto;
