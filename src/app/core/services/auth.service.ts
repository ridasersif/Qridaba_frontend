import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { StorageService } from './storage.service';
import { Observable, tap } from 'rxjs';
import {
  AuthenticationResponse, LoginRequest, RegisterRequest,
  VerificationRequest, ForgotPasswordRequest, ResetPasswordRequest, MessageResponse
} from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private readonly API_URL = `${environment.apiUrl}/auth`;


  currentUser = signal(this.storage.getUser());


  register(data: RegisterRequest) {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/register`, data);
  }


  login(data: LoginRequest) {
    return this.http.post<AuthenticationResponse>(`${this.API_URL}/login`, data)
      .pipe(tap(res => this.handleSuccess(res)));
  }




  verifyEmail(request: VerificationRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/verify-email`, request);
  }


  forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post<MessageResponse>(`${this.API_URL}/forgot-password`, data);
  }
  resetPassword(data: ResetPasswordRequest) {
    return this.http.post<MessageResponse>(`${this.API_URL}/reset-password`, data);
  }


  logout() {
    this.storage.clear();
    this.currentUser.set(null);
  }

  private handleSuccess(res: AuthenticationResponse) {
    this.storage.saveAuthData(res);
    this.currentUser.set(res.user);
  }
}