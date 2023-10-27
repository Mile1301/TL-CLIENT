import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { Post } from 'src/app/core/models/post.model';
import { PostsService } from 'src/app/core/services/posts.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  imports: [CommonModule, PostComponent],
})
export class PostListComponent implements OnInit {
  private postsService = inject(PostsService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  isEditAllowed = false;
  posts$ = this.postsService.posts$;
  currentUser: User = null;
  ngOnInit(): void {
    if (this.route.snapshot.routeConfig.path === 'posts/user') {
      this.currentUser = this.authService.currentUser$.value;
      this.isEditAllowed = true;
      // console.log(this.currentUser);
    }
    if (this.currentUser) {
      this.postsService.getUserPosts();
    } else {
      this.postsService.getPosts();
    }
  }
}
