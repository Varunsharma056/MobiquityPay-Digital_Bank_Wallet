import { Injectable } from "@angular/core"
import { type HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"

export interface SendMoneyRequest {
  receiverIdentifier: string
  amount: number
  description?: string
  pin?: string
}

export interface Transaction {
  id: number
  transactionId: string
  sender?: any
  receiver?: any
  amount: number
  type: string
  status: string
  description?: string
  createdAt: string
  completedAt?: string
}

export interface TransactionPage {
  content: Transaction[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private apiUrl = "http://localhost:8080/api/transactions"

  constructor(private http: HttpClient) {}

  sendMoney(request: SendMoneyRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, request)
  }

  getTransactionHistory(page = 0, size = 10): Observable<TransactionPage> {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString())

    return this.http.get<TransactionPage>(`${this.apiUrl}/history`, { params })
  }
}
