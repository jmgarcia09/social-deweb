import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {FirebaseAuthService} from "../../services/firebase/auth/firebase-auth.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalComponent} from "../ui-features/modals/modal/modal.component";
import {UserUpdateComponent} from "../user-update/user-update.component";

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss',],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit,AfterViewInit{

  user: any;

  constructor(private firebaseAuth : FirebaseAuthService,
              private modalService: NgbModal,
              protected cd: ChangeDetectorRef) { }

  async ngOnInit() {
    console.log("Primero esto");
    this.user = this.firebaseAuth.getUserMetadata();
  }

  ngAfterViewInit(): void {

  }

  updateChanges() {
    console.log("Actualizar cambios");
    this.user = this.firebaseAuth.getUserMetadata();
    this.cd.detectChanges();
  }

  showProfileModal(){
    const activeModal = this.modalService
      .open(UserUpdateComponent, {
        size: 'lg',
        container: 'nb-layout'}).result.then(() =>this.updateChanges());

  }


}
