import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../app/services/auth.service';
import { Router } from '@angular/router';
@Component({

  selector: 'app-tab0',
  templateUrl: './tab0.page.html',
  styleUrls: ['./tab0.page.scss'],
})
export class Tab0Page implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.required),
      email: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required),
    });
  }

  submitForm() {
    const formValues = this.registerForm.value;
    this.authService.register(formValues)
    .subscribe((response) => {
        console.log('Account successfully created!');
        console.log(response);
        this.router.navigate(['/tabs/tab1']);
    });
  }

}
