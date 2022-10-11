import { Injectable } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './post.entity';
import { Repository } from 'typeorm';
import { PostNotFoundException } from './exception/postNotFound.exception';
import User from '../users/user.entity';

@Injectable()
export default class PostsService {
  constructor(@InjectRepository(Post) private repo: Repository<Post>) {}

  getAllPosts() {
    return this.repo.find({
      relations: {
        author: true,
      },
    });
  }

  getPostById(id: number) {
    const post = this.repo.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });
    if (!post) {
      throw new PostNotFoundException(id);
    }
    return post;
  }

  async replacePost(id: number, post: UpdatePostDto) {
    const updatedPost = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });
    if (!updatedPost) {
      throw new PostNotFoundException(id);
    }
    await this.repo.update(id, post);
    return updatedPost;
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = this.repo.create({ ...post, author: user });
    await this.repo.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const post = await this.repo.delete(id);
    if (!post) {
      throw new PostNotFoundException(id);
    }
    return post;
  }
}
