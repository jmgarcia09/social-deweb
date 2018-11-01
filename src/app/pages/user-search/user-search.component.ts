import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AngularFirestore} from "angularfire2/firestore";
import {AngularFireStorage} from "angularfire2/storage";
import {Observable} from "rxjs/Rx";
import {FirebaseAuthService} from "../../services/firebase/auth/firebase-auth.service";

@Component({
  selector: 'ngx-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {

  posts : Observable<any[]>;
  userMetadata : any;
  activeUsers : any[];
  searchIndex : string;
  listOfUsers : any[];
  foundUsers : any[];


  constructor(private firebaseAuthService : FirebaseAuthService,
              private firebaseDatabase : AngularFirestore,
              private modalService: NgbModal,
              private firebaseStorage : AngularFireStorage,
              protected cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.userMetadata = {};
    this.listOfUsers = [];
    this.foundUsers = [];
    this.activeUsers = [];
    this.loadUsers();
  }


  loadUsers(){
    this.firebaseDatabase.collection('users').valueChanges().subscribe(data =>{
      data.forEach((user : any) =>{
        this.listOfUsers.push(user);
        this.userMetadata[user.uid] = user;
      });
    });
    this.firebaseDatabase.collection("posts",
      ref => ref.orderBy('date','desc')).valueChanges().subscribe(data =>{
      data.forEach((post : any) =>{
        if(this.activeUsers.length <= 4){
          if(!this.activeUsers.find(x => x.uid === post.userId)){
            this.activeUsers.push(this.userMetadata[post.userId]);
          }
        }
      });
    });
  }

  searchUsers(){
    this.foundUsers = [];
    console.log(this.searchIndex);
    this.foundUsers = this.listOfUsers.filter(user => user.name.toLowerCase().includes(this.searchIndex.toLowerCase()));
  }

}
