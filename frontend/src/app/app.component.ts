import { Component } from "@angular/core"
import type { AuthService } from "./services/auth.service"

@Component({
  selector: "app-root",
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `,
  ],
})
export class AppComponent {
  title = "FinTech App"

  constructor(private authService: AuthService) {}
}
