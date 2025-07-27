import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"

export interface WalletBalance {
  balance: number
  walletNumber: string
}

export interface AddMoneyRequest {
  amount: number
  referenceNumber: string
}

@Injectable({
  providedIn: "root",
})
export class WalletService {
  private apiUrl = "http://localhost:8080/api/wallet"

  constructor(private http: HttpClient) {}

  getBalance(): Observable<WalletBalance> {
    return this.http.get<WalletBalance>(`${this.apiUrl}/balance`)
  }

  addMoney(request: AddMoneyRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-money`, request)
  }
}
