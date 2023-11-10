import { NgIfContext } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, catchError, tap, throwError } from "rxjs";

const API_KEY = "AIzaSyD8CJ827ndHnqcL5pmventi9fROFIUOnzI";
const SIGN_UP_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
const SIGN_IN_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
user = new Subject<User>();



  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(SIGN_UP_URL + API_KEY, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError), tap(resData => {
this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn);
      }));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(SIGN_IN_URL + API_KEY, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError),tap(resData => {
        this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn);
              }));

private handleAuthentication(
  email:string,
  userId:string,
  token:string,
  expiresIn:number
  ) {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(
    email,
    userId,
    token,
    expirationDate
    );
    this.user.next(user);
}


  }
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An Unknown Error Occurred!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This Email Already Exists";
        break;
        case 'EMAIL_NOT_FOUND':
          errorMessage='This email does not exist'
          break;
          case 'INVALID_PASSWORD':
            errorMessage= 'This Password is Incorrect'
            break;
    }
    return throwError(errorMessage);
  }
}
