import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-post-create-form',
  templateUrl: './post-create-form.component.html',
  styleUrls: ['./post-create-form.component.css']
})

export class PostCreateFormComponent implements OnInit {

    enteredContent = '';
    enteredTitle = '';
    private mode = 'Create'; // set our switch to tell if its create or edit mode
    private postId: string;
    public post: Post; // create post broke because it starts with undefined
    // = { id: '', title: '', content: ''}
    // for store retrieve post found by id, need to be public so that form can access it
    // @Output() postCreated = new EventEmitter<Post>();
    // the above line-- we create EventEmitter that is of type Post
    // decorator Output() make this instance of event
    // can be listenable from
    // outside of post-create component
    // injected ActivatedRoute, which contain info about which route we are on
    constructor(public postSrv: PostService, public route: ActivatedRoute, public router: Router) {
      console.log('start post-create-form.component.ts->constructor()...');
    }

    ngOnInit() {
      // paramMap is observable, we can listen to it. Now if route changed ( we switch to edit instead of create route)
      // paraMap will contain our postId if its edit route
      this.route.paramMap.subscribe(
        (paramMap: ParamMap) => {
           if (paramMap.has('postId')) {
             console.log('create-form got postId:', paramMap.get('postId'));
             this.mode = 'Edit';
             this.postId = paramMap.get('postId'); // update our local member
             let obs = this.postSrv.getPostFromBackEnd(this.postId); // backend return observable now
             obs.subscribe(
               postData => {
                 this.post = {
                   id: postData._id,
                   title: postData.title,
                   content: postData.content
                  };
               }
             );
             // console.log('front end found post.title=', this.post.title);
           } else {
             this.mode = 'Create';
             this.postId = null;
            //  this.post.title = 'Type your title';
            //  this.post.content = 'Type your content';
           }
        }
      );
    }

    /* note that we are passing ngForm type on the HTML to this method! */
    onAddPost(formObject: NgForm) {
      console.log('start post-create-form.component.ts->onAddPost()...');
      // const post =  {
      //   title: formObject.value.title,
      //   content: formObject.value.content
      // };
      if (this.mode == 'Create') {
        this.postSrv.addPost(formObject.value.title, formObject.value.content);
      }
      else {
        this.postSrv.updatePost(this.postId, this.post.title, this.post.content);
        // this.goHome(); // back to home route to see all posts
      }
      // this.postCreated.emit(post);
      // emit with the value / things you want to fire to eventHandler

      formObject.reset(); // clear form input fields after submit
    }


    // goHome() {
    //   this.router.navigate(['']);
    // }
}
