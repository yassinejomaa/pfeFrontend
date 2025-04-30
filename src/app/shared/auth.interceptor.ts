import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Only proceed if user is logged in
  if (authService.isLoggedIn()) {
    // Skip authentication for Cloudinary requests
    if (req.url.includes('cloudinary.com')) {
      // Pass through the request unchanged
      return next(req);
    }
    
    // For all other requests, add the authorization header
    const cloneReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.getToken())
    });
    
    return next(cloneReq);
  }
  
  // If not logged in, pass through the original request
  return next(req);
};