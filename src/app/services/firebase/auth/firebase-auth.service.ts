import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFirestore} from "angularfire2/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  metadata : any;

  constructor(protected router: Router,
              protected  firebaseAuth : AngularFireAuth,
              protected  firebaseDatabase : AngularFirestore) {

  }


  validateCurrentUser(){
    if(this.firebaseAuth.auth.currentUser){
      console.log("User " + this.getUserMetadata());
      this.router.navigate(['/pages/dashboard']);
    }else {
      console.log("No user Authenticated");
      this.router.navigate(['/auth']);
    }
  }

  getCurrentUser(): firebase.User{
    return this.firebaseAuth.auth.currentUser;
  }

  setUserMetadata(data : any){
    this.metadata = data;

  }

  getUserMetadata(){
    return this.metadata;
  }

  login(user: string, password: string){
    return this.firebaseAuth.auth.signInWithEmailAndPassword(user, password);
  }

  async logout(){
    if(this.firebaseAuth.auth.currentUser){
      await this.firebaseAuth.auth.signOut();
      this.setUserMetadata(undefined);
    }
  }

  createUser(user: string, password: string){
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(user, password);
  }




}
