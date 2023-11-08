import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

const API_KEY= 'AIzaSyD8CJ827ndHnqcL5pmventi9fROFIUOnzI'
const SIGN_UP_URL= 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';




interface AuthResponseData {
  kind:string;
  idToken: string;
  email:string;
  refreshToken:string;
  expiresIn: string;
  localId:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
   return this.http.post<AuthResponseData>(
    SIGN_UP_URL + API_KEY,
   {
    email: email,
    password: password,
    returnSecureToken:true

   }
   )
   .pipe(catchError(errorRes=> {
    let errorMessage= 'An Unknown Error Occurred!';
    if (!errorRes.error  || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage= 'This Email Already Exists';
    }
    return  throwError(errorMessage);
   }));
  }
}
