import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { LayoutService } from '../../../@core/data/layout.service';
import {FirebaseAuthService} from "../../../services/firebase/auth/firebase-auth.service";
import {FirebaseStorage} from "angularfire2";
import {AngularFireStorage} from "angularfire2/storage";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any = {
    name : "",
    picture : ""
  };
  currentUser : any;

  userMenu = [{ title: 'Profile' }, { title: 'Log out', link : '../auth/logout' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private layoutService: LayoutService,
              private firebaseAuth : FirebaseAuthService,
              private firebaseStorage : AngularFireStorage) {
  }

  async ngOnInit() {
    await this.firebaseAuth.validateCurrentUser();
    this.currentUser = this.firebaseAuth.getUserMetadata();
    console.log(this.currentUser);
    if(this.currentUser){
      this.user.name = this.currentUser.name;
      this.user.picture = this.currentUser.image;
    }

    // this.userService.getUsers()
    //   .subscribe((users: any) => this.user = users.nick);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
