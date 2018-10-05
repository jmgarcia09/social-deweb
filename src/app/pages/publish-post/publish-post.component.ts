import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "angularfire2/firestore";
import {AngularFireStorage} from "angularfire2/storage";
import {FirebaseAuthService} from "../../services/firebase/auth/firebase-auth.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Post} from "../../bean/post";

@Component({
  selector: 'ngx-publish-post',
  templateUrl: './publish-post.component.html',
  styleUrls: ['./publish-post.component.scss']
})
export class PublishPostComponent implements OnInit {

  post : any;
  file : any;

  constructor(private activeModal: NgbActiveModal,
              private firebaseAuth : FirebaseAuthService,
              protected firebaseDatabase : AngularFirestore,
              private firebaseStorage : AngularFireStorage) { }

  ngOnInit() {
    this.post = {};
  }


  closeModal() {
    this.activeModal.close();
  }

  publishPost(){
    let user = this.firebaseAuth.getUserMetadata();
    this.post.date = Date.now();
    this.post.userId = user.uid;
    this.firebaseDatabase.collection("posts").add(this.post.valueOf()).then(createdPost =>{
      let imagePath = "posts/" + createdPost.id;
      if(this.file && this.file.target.files.length >= 1){
        this.firebaseStorage.upload(imagePath,this.file.target.files[0]).then(() =>{
          this.firebaseStorage.ref(imagePath).getDownloadURL().subscribe(imageUrl =>{
            this.firebaseDatabase.collection("posts")
              .doc(createdPost.id).update({type : 1, fileUrl : imageUrl}).then(() =>{
              this.closeModal();
            })
          });
        })
      }else{
        this.closeModal();
      }
    })
  }

  updateImage(event){
    this.file = event;
    console.log(this.file);
  }

}
