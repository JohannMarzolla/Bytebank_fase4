import { deleteTransacao, getSaldo, getTransacoes, postSaldo, postTransacao, putTransacao } from "@/services/TransacoesServices";
import { createContext, ReactNode, useContext, useState } from "react";
import { useAuth } from "@/context/AuthContext";



interface TransacoesContextData {
    // transacoes: Transacao[];
    saldo: number;
    deposito: (number: number) => Promise<void>;
    transferencia: (number: number) => Promise<void>;
    novaTransacao: (tipoTransacao: string, valor: number, date: string, userId: string) => Promise<void>;
    atualizarTransacao: any;
    deletarTransacao:(userId:string, transacaoId: string)=> Promise<void>;
    // user: any;
    atualizarSaldo: () => Promise<void | undefined>;
  }

  export interface Transacao {
    userId: string;
    tipoTransacao: string;
    valor: number;
    date: string;
  }

const TransacoesContext = createContext< TransacoesContextData| undefined>(undefined);

export const TransacoesProvider = ({ children }: { children: ReactNode })=>{

    const {userId} = useAuth();
    const [transacoes, setTransacoes] = useState<any>([]);
    const [saldo, setSaldo] = useState<number>(0);

    const atualizarSaldo = async () => {
      try {
        if (!userId) return ;
        const saldoAtualizado = await getSaldo(userId);
        setSaldo(saldoAtualizado);
      } catch (error) {
        console.error("Erro ao atualizar saldo:", error);
      }
    };

      const atualizaTransacoes = async () => {
        try {
          if (!userId) return;
          const transacoesAtualizadas = await getTransacoes(userId);
          setTransacoes(transacoesAtualizadas);
        } catch (error) {
          console.log("Erro ao atualizar as transações", error);
        }
      };
    
      const deposito = async (valor: number) => {
        try {
          if (!userId) throw new Error("Usuário não autenticado.");
          const novoSaldo = saldo + valor;
          await postSaldo(userId, novoSaldo);
          await atualizarSaldo();
        } catch (error) {
          console.error("Erro ao realizar depósito:", error);
        }
      };
    
      const transferencia = async (valor: number) => {
        try {
          if (!userId) throw new Error("Usuário não autenticado.");
          const novoSaldo = saldo - valor;
          await postSaldo(userId, novoSaldo);
          await atualizarSaldo();
        } catch (error) {
          console.error("Erro ao realizar transferência:", error);
        }
      };
    
      const novaTransacao = async (tipoTransacao: string, valor: number, date: string, userId: string) => {
        if (tipoTransacao === "transferencia" && !verificaSaldo(valor)) {
          alert("Saldo insuficiente para realizar a transferência.");
          return;
        }
        
        const transacao: Transacao = { userId , tipoTransacao, valor, date };
        await postTransacao(userId,transacao);
        await atualizaTransacoes();
      };
    
      const verificaSaldo = (valor: number): boolean => {
        if (valor > saldo) {
          return false;
        }
        return true;
      };
    
      const atualizarTransacao = async (transacaoId: string, tipoTransacao: string, valor: number, date: string) => {
        try {
          if (!userId) throw new Error("Usuário não autenticado.");
    
          const transacaoAtualizada = { transacaoId, tipoTransacao, valor, date };
          await putTransacao(userId,transacaoId,transacaoAtualizada);
          await atualizaTransacoes();
          await atualizarSaldo();
        } catch (error) {
          console.error("Erro ao atualizar a transação:", error);
        }
      };
    
      const deletarTransacao = async (userId:string,transacaoId: string) => {
        try {
          if (!transacaoId) throw new Error("Usuário não autenticado.");
          await deleteTransacao(userId,transacaoId);
          await atualizarSaldo();
          await atualizaTransacoes();
        } catch (error) {
          console.error("Erro ao deletar a transação context:", error);
        }
      };
    


    return(
       <TransacoesContext.Provider 
     value={{ atualizarSaldo,deposito, transferencia ,novaTransacao,deletarTransacao,atualizarTransacao, saldo,}}
       >
       {children}

       </TransacoesContext.Provider>

    )
}

export const useTransacoes = () => {
  const context = useContext(TransacoesContext);
  if (!context) {
    throw new Error(
      "contexto não encontado, useTransacoes deve estar dentro de TransacoesProvider"
    );
  }
  return context;
};