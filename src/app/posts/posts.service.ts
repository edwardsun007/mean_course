import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // NEED inject it to send http request
import { Post } from './post.model';
import { Router } from '@angular/router';
import { post } from 'selenium-webdriver/http';


@Injectable({providedIn: 'root'})  // this let angular find this service and use one instance across the entire app very important!
export class PostService {
  private posts: Post[] = []; // private prevent access to posts from outside
  private postUpdated = new Subject<Post[]>();  // Subject instance named postUpdated,  Subject that
  constructor(private _http: HttpClient, private router: Router ) {
  }

  // always centralize HTTP requests in your service file
  getPosts() {
    console.log('start posts.service.ts->getPost()');
    this._http
      .get<{ message: string, data: any }>( // Where this data from ? think
        // we are getting json response remember, {message: String, posts: Post[]} which is defined in our backend server.js
        'http://localhost:3000/api/posts' // hardcoded URL point to path defined in server.js
      )
      .pipe(map((postData) => {
          return postData.data.map( post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            }; // remember this is from MongoDB, and it is _id in MongoDB
          });  // map here is javascript native map()
      })) // pipe allow use to add multiple operator BEFORE Let Angular listen to new data
      .subscribe(transformedPosts => { // transformedPosts will be array already
        // register with subscribe so that you can listen to the API path above
        // if ( postData.posts !== undefined ) {
          this.posts = transformedPosts;
          this.postUpdated.next([...this.posts]);
        // }
      });

    // return [...this.posts];   is spread operator in javascript, it can pull properties out of object
    // if we do return this.posts,
    // it will simply return the address to the posts object
    // standard way: using spread in javascript to pull them out of original posts
    // then use [] to make a copy and return as new array
  }

  /* What is the difference between API call from server and a search in frontend? Think */
  /* frontend search directly return you the object, but http call return observerable not the object */
  getPost(id: string) {
    console.log('start posts.service->getPost()');
    return this._http.get<{_id: string, title: string, content: string}>(`http://localhost:3000/api/posts/${id}`);
    // return the observable, from backend, so its _id
  }

  // frontend search
  // getPostById(id: string) {
  //   return {...this.posts.find(p => p.id === id)};
  //   // instead of doing backend API call to retrieve by id, we do FrontEnd find here
  //   // here we use javascript find to match object id, and simply return the first matching one
  //   // common practice is return new object using spread, spread operator is used to pull properties out of old object and create new one
  // }

  getPostUpdateListener() {
    console.log('start posts.service->getPostUpdateListener()');
    return this.postUpdated.asObservable();
    // creates new observerable with Subject called postUpdated as the source
  }

  addPost(title: string, content: string, image: File) {
    console.log('start posts.service.ts->addPost()');
    console.log('image=', image);
    const postData = new FormData(); // javascript object allow us to combine form value and blob
    postData.append( 'title', title ); // we append form fields to formdata
    postData.append( 'content', content );
    postData.append( 'image', image, title );
    console.log('after appending,postData=', postData);
    // // tslint:disable-next-line:no-shadowed-variable
    // const post: Post = { id: null, title: title, content: content};
    /* still define the type you post, give URL, the return post body */
    /* dojo way is separate the subscribe part into component that calls service,
    service only has HTTP verb in it like put, get, delete, put */
    this._http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', postData).subscribe(
      (res) => {
        if (res.message === 'Post added') {   // only update if its successful API call
             const post: Post = {
               id: res.postId,
               title: title,
               content: content
            };
            //  const id = res.postId;           // saved post will feed back json with its id now, pull it
            //  post.id = id;
             this.posts.push(post);
             console.log('check post added from res:', post);
             this.postUpdated.next([...this.posts]); // emit the COPY of updated posts thru Subject to all observers
             this.router.navigate(['']); // once we done with update posts, we navigate to home
        }
      }
    );
  }

  updatePost(id: string, title: string, content: string) {
    console.log('start posts.service->updatePost()');
    const post: Post = {
      id: id,
      title: title,
      content: content
    };
    // {title: title, content: content}
    this._http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(res => {
        console.log(res);
        const updatedPosts = [...this.posts]; // this is new post arrays after update
        console.log('This is new posts array after update:', updatedPosts);
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);  // frontend search with old post's id they are same
        console.log('This is index of that oldPost', oldPostIndex);
        updatedPosts[oldPostIndex] = post; // replace that index pos with the new post
        console.log('after replace, now updatedPosts[oldPostIndex]=', updatedPosts[oldPostIndex]);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]); // tell app things changed and fire the new posts via Subject
        this.router.navigate(['']); // once we done with edit posts, we navigate to home
      });
  }


  deletePost(id: string) {
    console.log('start posts.service->deletePost()');
    this._http.delete(`http://localhost:3000/api/posts/${id}`) // delete from backend
      .subscribe((res) => {
        console.log(res);
        const updatedPosts = this.posts.filter( post => post.id !== id);
        // this trick is used to delete it from Frontend
        // keep the post that has different id from the deleted one
        // filter out the one that is deleted (so it doesn't show on page)
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]); // send the updatedPosts to Subject
        this.router.navigate(['']); // once we done with delete posts, we navigate to home
      });
  }
}
