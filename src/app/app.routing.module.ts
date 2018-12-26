import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { PostCreateFormComponent } from './posts/post-create-form/post-create-form.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateFormComponent },  // localhost:3000/create
  { path: 'edit/:postId', component: PostCreateFormComponent} // use same component to handle create and update here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // add configuration with routes above
  exports: [RouterModule] // export so that other Angular Compo can use
})
export class AppRoutingModule {}
