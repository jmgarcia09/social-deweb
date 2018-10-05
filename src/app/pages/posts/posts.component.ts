import {Component, OnInit} from '@angular/core';
import {FirebaseAuthService} from "../../services/firebase/auth/firebase-auth.service";
import {AngularFirestore} from "angularfire2/firestore";
import {AngularFireStorage} from "angularfire2/storage";
import {Observable} from "rxjs/Rx";
import {Post} from "../../bean/post";
import {UserUpdateComponent} from "../user-update/user-update.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PublishPostComponent} from "../publish-post/publish-post.component";
import OrderByDirection = firebase.firestore.OrderByDirection;

@Component({
  selector: 'ngx-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts : Observable<Post[]>;
  userMetadata : any;

  constructor(private firebaseAuthService : FirebaseAuthService,
              private firebaseDatabase : AngularFirestore,
              private modalService: NgbModal,
              private firebaseStorage : AngularFireStorage) { }

  ngOnInit() {
    this.userMetadata = {};
    this.loadPosts();
  }


  loadPosts(){
    this.firebaseDatabase.collection('users').valueChanges().subscribe(data =>{
      data.forEach((user : any) =>{
        this.userMetadata[user.uid] = user;
      });
    });
    this.posts = this.firebaseDatabase.collection("posts",
      ref => ref.orderBy('date','desc')).valueChanges();

  }


  getUserData(userId : string){
    return this.userMetadata[userId];
  }

  showProfileModal(){
    const activeModal = this.modalService
      .open(PublishPostComponent, {
        size: 'lg',
        container: 'nb-layout'});

  }



}
