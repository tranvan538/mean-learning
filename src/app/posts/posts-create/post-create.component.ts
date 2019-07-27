import {Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';
import {AuthService} from '../../auth/auth.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;
  post: Post;
  form: FormGroup;
  isLoading = false;
  imagePreview: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(status => {
      this.isLoading = false;
    });

    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        this.postsService.getPost(this.postId).subscribe((post: Post) => {
          this.post = post;
          this.isLoading = false;
          const {title, content, imagePath} = post;
          this.form.setValue({title, content, image: imagePath});
          this.imagePreview = imagePath;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const { title, content, image } = this.form.value;
    if (this.mode === 'create') {
      this.postsService.addPost(title, content, image);
    } else {
      this.postsService.updatePost(this.postId, title, content, image);
    }

    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
