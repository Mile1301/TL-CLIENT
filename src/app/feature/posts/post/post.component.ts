import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, PostDetails } from 'src/app/core/models/post.model';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/core/services/posts.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  private router = inject(Router);
  private postsService = inject(PostsService);
  private authService = inject(AuthService);

  currentUser: User;

  @Input() post: Post | PostDetails;
  @Input() isHoverShadow = true;
  @Input() isEditAllowed = false;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser$.value;
  }
  onPostClick() {
    this.router.navigate(['posts', this.post._id]);
  }

  onPostLike(e: Event) {
    e.stopImmediatePropagation();
    this.postsService.likePost(this.post._id);
  }

  onPostDislike(e: Event) {
    e.stopImmediatePropagation();
    this.postsService.dislikePost(this.post._id);
  }

  onPostEdit(e: Event) {
    e.stopImmediatePropagation();
    const state: any = this.post;
    this.router.navigate(['posts', 'edit'], { state });
  }

  onPostDelete(e: Event) {
    e.stopImmediatePropagation();
    this.postsService.deletePost(this.post._id);
  }
}
