import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { FormsModule } from '@angular/forms';

// this installs parts we need to make app with colorful component from Angular material
import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule,
         MatExpansionModule, MatSidenavModule, MatProgressSpinnerModule, MatPaginatorModule, MatPaginatorIntl } from '@angular/material';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateFormComponent } from './posts/post-create-form/post-create-form.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { MyPaginator } from './myPaginator';
import { PostService } from './posts/posts.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostListComponent,
    PostCreateFormComponent,
    AuthComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  providers: [ { provide: MatPaginatorIntl, useValue: MyPaginator() } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
