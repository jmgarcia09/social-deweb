import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FirebaseAuthService} from "../../services/firebase/auth/firebase-auth.service";
import {AngularFirestore} from "angularfire2/firestore";
import {AngularFireStorage} from "angularfire2/storage";
@Component({
  selector: 'ngx-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  date : Date = new Date();
  user: any;
  file : any;

  constructor(private activeModal: NgbActiveModal,
              private firebaseAuth : FirebaseAuthService,
              protected firebaseDatabase : AngularFirestore,
              private firebaseStorage : AngularFireStorage) { }

  ngOnInit() {
    let currentUser = this.firebaseAuth.getUserMetadata();
    this.user = {
      uid : currentUser.uid,
      name : currentUser.name,
      email : currentUser.email,
      genre : currentUser.genre,
      about: currentUser.about,
      birthdate : currentUser.birthdate
    };
    if(this.user.birthdate){
      console.log("Entra aqui");
      this.date.setTime(this.user.birthdate);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  updateProfile(){
    console.log(this.user);
    this.user.birthdate = this.date.getTime();

    if(this.file && this.file.target.files.length >= 1){
      this.uploadFile(this.file,this.user.uid);
    }else {
      this.updateMetadata();
    }

  }

  updateMetadata(){
    this.firebaseDatabase.collection('users').doc(this.user.uid).update(this.user).then((ok)=>{
      console.log("Usuario actualizado");
      this.firebaseDatabase.collection('users').doc(this.user.uid).valueChanges().subscribe((data:any) =>{
        this.firebaseAuth.setUserMetadata(data);
        this.closeModal();
      });

    }).catch((error)=>{
      console.log("No se pudo actualizar " + error);
    });
  }


  handleDateChange(event){
    this.date = event;
  }

  updateAvatar(event){
    this.file = event;
    console.log(this.file);
  }

  uploadFile(event,name: string) {
    const file = event.target.files[0];
    const filePath = 'users/' + name;
    this.firebaseStorage.upload(filePath,file).then(()=>{
      this.firebaseStorage.ref(filePath).getDownloadURL().subscribe(imageUrl =>{
        this.user.image = imageUrl;
        this.updateMetadata();
      });
    });
  }

}
