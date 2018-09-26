/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFirestore} from "angularfire2/firestore";
import {SocialUser} from "../../../bean/social-user";
import {FirebaseAuthService} from "../../../services/firebase/auth/firebase-auth.service";

@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbLoginComponent implements OnInit{

  redirectDelay: number = 0;
  showMessages: any = { error : false};
  strategy: string = '';

  errorMessages: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  rememberMe = false;

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router,
              protected  firebaseAuth : AngularFireAuth,
              protected  firebaseDatabase : AngularFirestore,
              protected  firebaseAuthService : FirebaseAuthService) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
  }

  login(): void {
    this.errorMessages = this.messages = [];
    this.submitted = true;
    this.firebaseAuthService.login(this.user.email,this.user.password).then(
      (successResponse : any) => {

        this.messages.push("Autenticacion correcta!.");

        let userPath = 'users/' + successResponse.user.uid;
        this.firebaseDatabase.doc(userPath).valueChanges().subscribe(data =>{
        //this.firebaseDatabase.collection('users', ref => ref.where('email','==',successResponse.user.email).limit(1)).valueChanges().subscribe(data =>{
          this.submitted = false;
          this.firebaseAuthService.setUserMetadata(data);
          this.router.navigate(['/pages/dashboard']);
        });

      },
      error =>{
        console.log(error.code);
        this.errorMessages = [this.getErrorMessage(error.code)];
        this.submitted = false;

      }).then(() => {
        this.cd.detectChanges();
    });

  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }


  getErrorMessage(code : string) : string{
    if("auth/user-not-found" === code){
      return "Usuario no existe.";
    }else if("auth/wrong-password" === code){
      return "Password incorrecta.";
    }else if ("auth/too-many-requests" === code){
      return "Demasiadas peticiones, espera un momento.";
    }else {
      return "Error inesperado.";
    }
  }

  ngOnInit(){
    this.firebaseAuthService.validateCurrentUser();

  }

}
