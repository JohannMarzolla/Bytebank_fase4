import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/infrastructure/services/FirebaseConfig";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";

export class FirebaseAuthService {
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
            throw new Error(
              "Usuário não encontrado. Verifique suas credenciais."
            );
          case "auth/wrong-password":
            throw new Error("Senha incorreta. Tente novamente.");
          default:
            throw new Error("Erro ao autenticar usuário: " + error.message);
        }
      }
      throw new Error("Erro desconhecido ao tentar fazer login");
    }
  }

  static async signUp(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      // talvez não devesse ficar aqui
      await setDoc(doc(db, "users", userId), { email, saldo: 0 });
    } catch (error) {
      let errorMessage = "Erro desconhecido ao tentar cadastrar a conta.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este email já está em uso. Tente outro.";
            break;
          case "auth/invalid-email":
            errorMessage = "O email fornecido é inválido.";
            break;
          case "auth/weak-password":
            errorMessage = "A senha precisa ser mais forte.";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      let errorMessage = "Erro desconhecido ao tentar realizar o logout.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/no-current-user":
            errorMessage = "Não há um usuário conectado no momento.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Falha na conexão. Tente novamente.";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }
}
