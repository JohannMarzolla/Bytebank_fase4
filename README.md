#  ByteBank - App Mobile  

O **ByteBank** é um aplicativo mobile desenvolvido em **React Native com Expo**, que simula um **banco digital** para gerenciamento de contas e transferências financeiras.  
O projeto foi estruturado utilizando **Clean Architecture**, garantindo separação de responsabilidades, testabilidade e escalabilidade.  

## Tecnologias  

- **React Native + Expo** → desenvolvimento mobile multiplataforma  
- **Firebase (Auth + Firestore)** → autenticação e banco de dados em tempo real  
- **Context API** → gerenciamento de estado global  
- **TypeScript** → tipagem estática e maior segurança no código  
- **Clean Architecture** → divisão clara em camadas de responsabilidade  

## Arquitetura do Projeto  

```bash
src
 ├── app             
 │    ├── auth       # Telas de autenticação (login, cadastro de usuário)
 │    └── protected  # Telas protegidas (home, transações, logout)
 ├── domain          # Entidades e interfaces 
 ├── application     # Services (regras de negócio)
 ├── infrastructure  # Integração com Firebase, repositories
 ├── presentation    # Componentes, contexto (Context API)
 └── shared          # Utilitários, constantes e helpers
 ```

## Funcionalidades

- Cadastro e login de usuários via Firebase Auth  
- Criação e gerenciamento de contas digitais  
- Transferências  
- Consulta de saldo e histórico de transações  
- Gráficos de movimentações 

## Demonstração

O vídeo a seguir mostra o ByteBank em funcionamento, com login, criação de conta, transferências, consulta de saldo, histórico de transações e gráficos de movimentações.  
Você pode assistir ao vídeo clicando [aqui](https://drive.google.com/file/d/1yBZPUmB7OH_j4iyGoCid-3gnG0ECtOLh/view?usp=sharing).

## Como rodar o projeto

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/bytebank-app.git
cd bytebank-app

1. Instale as dependências

   ```bash
   npm install
   ```

2. Inicie o aplicativo

   ```bash
   npx expo start
   ```

No output, você encontrará opções para abrir o app em um:

- [build de desenvolvimento](https://docs.expo.dev/develop/development-builds/introduction/)
- [emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), um ambiente limitado para testar o desenvolvimento de apps com Expo

Este projeto utiliza [roteamento baseado em arquivos](https://docs.expo.dev/router/introduction/).


## Integração com Firebase  

Para integrar o Firebase ao seu projeto Expo, siga estes passos:  

1. Instale o SDK do Firebase:  
   ```bash
   npm install firebase
   ```

2. Crie um projeto no Firebase:  
   - Acesse o [Firebase Console](https://console.firebase.google.com/)  
   - Clique em **Adicionar Projeto** e siga as instruções de configuração  
   - Registre um novo aplicativo Web e obtenha seu objeto de configuração do Firebase  

3. Configure o Firebase no seu projeto:  
   - Dentro do diretório `src/shared/constants/firebase-config`   
   - Adicione a seguinte configuração:  

   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: 'SUA_API_KEY',
     authDomain: 'SEU_AUTH_DOMAIN',
     projectId: 'SEU_PROJECT_ID',
     storageBucket: 'SEU_STORAGE_BUCKET',
     messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
     appId: 'SEU_APP_ID',
   };
   ```

## Scripts disponíveis  

No diretório do projeto, você pode executar:  

- `npm start` - Inicia o servidor de desenvolvimento.  
- `npm run android` - Executa o app em um emulador ou dispositivo Android.  

## Saiba mais  

- [Documentação do Expo](https://docs.expo.dev/): Aprenda desde os fundamentos até tópicos avançados com nossos [guias](https://docs.expo.dev/guides).  
- [Tutorial do Expo](https://docs.expo.dev/tutorial/introduction/): Siga um tutorial passo a passo para criar um projeto que roda no Android, iOS e Web.  

## Licença  

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## Autor
Desenvolvido por Johann Marzolla e Lucas R. Janzen.