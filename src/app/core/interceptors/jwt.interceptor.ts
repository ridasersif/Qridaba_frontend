import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(StorageService).getAccessToken();
  const isApiUrl = req.url.startsWith(environment.apiUrl);
  
  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};