import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable } from "rxjs"
import { map } from "rxjs/operators"

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:8080/api/auth"
  private currentUserSubject: BehaviorSubject<User | null>
  public currentUser: Observable<User | null>

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem("currentUser") || "null"),
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        if (response && response.token) {
          localStorage.setItem("token", response.token)
          localStorage.setItem("currentUser", JSON.stringify(response.user))
          this.currentUserSubject.next(response.user)
        }
        return response
      }),
    )
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData)
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    return !!token && !this.isTokenExpired(token)
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp < Date.now() / 1000
    } catch {
      return true
    }
  }
}
