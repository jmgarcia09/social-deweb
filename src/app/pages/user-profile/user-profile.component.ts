import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {FirebaseAuthService} from "../../services/firebase/auth/firebase-auth.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalComponent} from "../ui-features/modals/modal/modal.component";

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit,AfterViewInit{

  user: any;

  constructor(private firebaseAuth : FirebaseAuthService,
              private modalService: NgbModal) { }

  async ngOnInit() {
    console.log("Primero esto");
    this.user = this.firebaseAuth.getUserMetadata();
  }

  ngAfterViewInit(): void {

  }

  showProfileModal(){
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Large Modal';
  }


}
