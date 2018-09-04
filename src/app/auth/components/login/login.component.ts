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
import {isSuccess} from "@angular/http/src/http_utils";

@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbLoginComponent {

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
              protected  firebaseAuth : AngularFireAuth) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
    console.log(this.showMessages);
  }

  login(): void {
    this.errorMessages = this.messages = [];
    this.submitted = true;

    this.firebaseAuth.auth.signInWithEmailAndPassword(this.user.email,this.user.password).then(
      isSuccess => {
        console.log("si se conecto PUTO!.");
        console.log(isSuccess);
        this.submitted = false;
        this.router.navigateByUrl("../pages");

      },
      error =>{
        console.log(error);
        this.errorMessages = [this.getErrorMessage(error.code)];
        console.log("Fallo puto");
        this.submitted = false;
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
}
