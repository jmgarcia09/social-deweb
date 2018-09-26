/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFirestore} from "angularfire2/firestore";
import {FirebaseAuthService} from "../../../services/firebase/auth/firebase-auth.service";
import {AngularFireStorage} from "angularfire2/storage";


@Component({
  selector: 'nb-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbRegisterComponent {

  redirectDelay: number = 0;
  showMessages: any = {};

  strategy: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  socialLinks: NbAuthSocialLink[] = [];

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router,
              protected  firebaseAuthService : FirebaseAuthService,
              protected firebaseDatabase : AngularFirestore,
              protected firebaseStorage : AngularFireStorage) {

    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.strategy = this.getConfigValue('forms.register.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.firebaseAuthService.createUser(this.user.email, this.user.password)
    .then((successResponse) => {

      console.log(successResponse);
      this.firebaseDatabase.collection('users').doc(successResponse.user.uid).set({
        name : this.user.fullName,
        email : successResponse.user.email,
        uid : successResponse.user.uid
      }).then(createSuccess =>{
        this.uploadFile(this.user.avatar,successResponse.user.uid);
        alert(`Usuario registrado`);
        this.router.navigate(['/auth/login']);
      }).catch(createError =>{
        console.log("No se pudo crear usuario");
      });
      this.submitted = false;

    },error => {
      var errorCode = error.code;
      this.errors = [this.getErrosrMesage(errorCode)];
      this.submitted = false;
      console.log(error);
    }).then(() =>{
      this.cd.detectChanges();
    });
  }

  updateAvatar(event){
    this.user.avatar = event;
    console.log(this.user.avatar);
  }

  uploadFile(event,name: string) {
    const file = event.target.files[0];
    const filePath = 'users/' + name;
    this.firebaseStorage.upload(filePath,file);

  }



  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }


  getErrosrMesage(code : string) : string{
    if("auth/email-already-in-use" === code){
      return "Usuario ya se encuentra en uso. Utiliza otro correo";
    }else if("auth/invalid-email" === code){
      return "Correo invalido.";
    }else if ("auth/operation-not-allowed\n" === code){
      return "Operacion no permitida.";
    }else if ("auth/weak-password" === code){
      return "Contrasenia muy vulnerable.";
    }else{
      return "Error inesperado.";
    }
  }
}
