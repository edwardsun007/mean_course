import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../posts.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = []; // local variable not the one in service.ts
  isLoading = false;
  private postsSub: Subscription; // for unsubscribe feature

  // @Input() posts: Post[] = []; // our root app has posts[] there,
  // we want to pass it DOWN into post-list component to iterate
  // so here we use input() decorator to take it in
  // App is parent component for both post-create and post-list

  // [public _service] is exactly same as two lines below :
  // postSrv: PostsService
  // inside constructor: this.postSrv = postSrv
  constructor(public _service: PostService, public _router: Router) {
    console.log('start post-list.component.ts->constructor()');
  } // dependency injection

  ngOnInit() {
    console.log('start post-list.component.ts->ngOnInit()');
    this.isLoading = true; // let it spin
    this._service.getPosts();
    this.postsSub = this._service.getPostUpdateListener()
      .subscribe((posts: Post[]) => { // subscribe to the observerable created in service.ts
        console.log('inside _service.getPostUpdateListener.subscribe()');
        this.isLoading = false; // stop spin
        this.posts = posts;
      });
    /* vid 27 why click save post doesn't show new post?
    because when post-list first created, you call getPost() which get empty array
    later when you click save post to add new post object into posts array, list doesn't update itself
    */
  }

  onDelete(id: string) {
    this._service.deletePost(id);
  }

  goHome() {
    this._router.navigate(['']);
  }

  /* unsubscribe observable when component is destroyed
  otherwise, it will be always listening for changes cause memory leak
  */
  ngOnDestroy() {
    console.log('calling unsubscribe()...');
    this.postsSub.unsubscribe();
  }
}
