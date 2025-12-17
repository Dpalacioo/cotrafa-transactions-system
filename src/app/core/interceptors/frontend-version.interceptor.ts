import { HttpInterceptorFn } from '@angular/common/http';

export const frontendVersionInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders: {
      'X-Frontend-Version': '1.0',
    },
  });

  return next(clonedRequest);
};
