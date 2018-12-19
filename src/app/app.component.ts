import { Component } from '@angular/core';
// import { Post } from './posts/post.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // example we can use our won defined interface type
  // existingPosts: Post[] = []; // renamed to avoid confusion

  /* event handler demo to catch postCreated event */
  // onPostAdded(post) {
  //   console.log('start app.component.ts->onPostAdded($event)...');
  //   console.log(`post.title=${post.title}`);
  //   console.log(`post.content=${post.content}`);
  //   this.existingPosts.push(post);
  // }
}
