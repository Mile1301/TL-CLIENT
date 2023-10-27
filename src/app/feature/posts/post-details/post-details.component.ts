import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostDetails } from 'src/app/core/models/post.model';
import { PostComponent } from '../post/post.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentsListComponent } from '../comments-list/comments-list.component';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-post-details',
  standalone: true,
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  imports: [
    CommonModule,
    PostComponent,
    CommentFormComponent,
    CommentsListComponent,
  ],
})
export class PostDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postsService = inject(PostsService);

  postDetails$ = this.postsService.postDetails$;

  ngOnInit(): void {
    // console.log(this.route);

    const postId = this.route.snapshot.params.id;

    // console.log(postId);

    this.postsService.getPostDetails(postId);
  }

  onCommentSubmit(body: string) {
    this.postsService.createComment(body);
  }
}
