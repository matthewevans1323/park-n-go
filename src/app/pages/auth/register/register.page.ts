import { AsyncStorageService } from './../../../native/async-storage.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Register } from 'src/app/model/register.model';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  checkedBtn = false;
  user: Register = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',
  };
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private storage: AsyncStorageService,
  ) {}

  ngOnInit() {}

  async onRegister() {
    this.authSvc.signup(this.user.email, this.user.password).subscribe(
      async (resp) => {
        try {
          if (resp.idToken) {
            const newUser: User = {
              firstName: this.user.firstName,
              lastName: this.user.lastName,
              email: this.user.email,
              phoneNo: this.user.phoneNo,
            };

            await this.authSvc.addNewUser(newUser);

            await this.storage.set('token', this.user.email);
            await this.presentSuccessToast();
            this.router.navigateByUrl('/tabs/parking');
          }
        } catch (error) {
          console.log(error);
        }
      },
      (errorResp) => {
        if (errorResp.error.error.message === 'EMAIL_EXISTS') {
          this.presentEmailExistToast();
        } else {
          console.log('error', errorResp);
        }
      },
    );
  }

  async presentSuccessToast() {
    const toast = await this.toastCtrl.create({
      message: `Hello, ${this.user.firstName}! Your registration is success. `,
      duration: 3000,
    });
    await toast.present();
  }

  async presentEmailExistToast() {
    const toast = await this.toastCtrl.create({
      message: `Email is already registered.`,
      duration: 3000,
    });
    await toast.present();
  }
}
