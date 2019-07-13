import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postsSubscription: Subscription;

  constructor(public postsService: PostsService) {
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.getPostUpdateListenter()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}