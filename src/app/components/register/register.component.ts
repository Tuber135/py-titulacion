import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OnlyNumbersDirective } from '../../directives/only-numbers.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, OnlyNumbersDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      documentId: ['', [
        Validators.required, 
        Validators.pattern(/^\d{8}$/),
        Validators.minLength(8),
        Validators.maxLength(8)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.maxLength(64),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para confirmar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Validador de fortaleza de contraseña
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    if (!passwordValid) {
      return {
        weakPassword: {
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          hasSpecialChar
        }
      };
    }

    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  hasErrors(): boolean {
    return this.submitted && this.registerForm.invalid;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return this.submitted && field ? field.invalid : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }

    if (fieldName === 'documentId') {
      if (field.errors['required']) {
        return 'El documento de identidad es requerido';
      }
      if (field.errors['pattern'] || field.errors['minlength'] || field.errors['maxlength']) {
        return 'El DNI debe tener exactamente 8 dígitos';
      }
    }

    if (fieldName === 'email') {
      if (field.errors['required']) {
        return 'El correo electrónico es requerido';
      }
      if (field.errors['email'] || field.errors['pattern']) {
        return 'Correo electrónico no válido';
      }
    }

    if (fieldName === 'password') {
      if (field.errors['required']) {
        return 'La contraseña es requerida';
      }
      if (field.errors['minlength']) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
      if (field.errors['maxlength']) {
        return 'La contraseña no debe exceder 64 caracteres';
      }
      if (field.errors['weakPassword']) {
        const weak = field.errors['weakPassword'];
        const missing: string[] = [];
        if (!weak.hasUpperCase) missing.push('mayúsculas');
        if (!weak.hasLowerCase) missing.push('minúsculas');
        if (!weak.hasNumber) missing.push('números');
        if (!weak.hasSpecialChar) missing.push('caracteres especiales');
        return `La contraseña debe contener: ${missing.join(', ')}`;
      }
    }

    if (fieldName === 'confirmPassword') {
      if (field.errors['required']) {
        return 'Debes confirmar tu contraseña';
      }
      if (this.registerForm.errors?.['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }

    return 'Campo inválido';
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.valid) {
      // Aquí irá la lógica de registro
      console.log('Register attempt:', this.registerForm.value);
      
      // Si el registro es exitoso:
      // this.router.navigate(['/login']);
    }
  }
}
