import { FirebaseAuthService } from "@/infrastructure/services/FirebaseAuthService";

export class AuthService {
  static async login(email: string, password: string) {
    const user = await FirebaseAuthService.signIn(email, password);
    return user;
  }

  static async createUser(email: string, password: string) {
    await FirebaseAuthService.signUp(email, password);
  }

  static async logout() {
    await FirebaseAuthService.signOut();
  }
}
