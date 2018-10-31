import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PostsComponent } from './posts/posts.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {ModalComponent} from "./ui-features/modals/modal/modal.component";
import { UserUpdateComponent } from './user-update/user-update.component';
import {NbCalendarComponent, NbCalendarModule, NbListComponent, NbListItemComponent} from "@nebular/theme";
import { PublishPostComponent } from './publish-post/publish-post.component';
import {AboutComponent} from "./about/about.component";

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbCalendarModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    PostsComponent,
    UserProfileComponent,
    ModalComponent,
    UserUpdateComponent,
    PublishPostComponent,
    AboutComponent
  ],
  entryComponents: [
    ModalComponent,
    UserUpdateComponent,
    PublishPostComponent
  ]
})
export class PagesModule {
}
