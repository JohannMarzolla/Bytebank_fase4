import { FirebaseAuthService } from "@/infrastructure/services/FirebaseAuthService";

export class AuthService {
  static async login(email: string, password: string) {
    return FirebaseAuthService.signIn(email, password);
  }

  static async createUser(email: string, password: string) {
    await FirebaseAuthService.signUp(email, password);
  }

  static async logout() {
    await FirebaseAuthService.signOut();
  }
}
