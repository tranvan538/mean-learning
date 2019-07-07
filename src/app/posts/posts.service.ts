import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';

import { map } from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, data: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.data;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListenter() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{message: string, data: Post}>('http://localhost:3000/api/posts/' + id)
      .pipe(map(result => result.data));
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{message: string, data: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        post.id = responseData.data;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http.put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }
}
