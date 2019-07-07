import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {

  }

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

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{message: string, data: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        post.id = responseData.data;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
