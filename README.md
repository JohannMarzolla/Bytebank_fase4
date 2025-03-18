# Bem-vindo ao seu app Expo 👋  

Este é um projeto [Expo](https://expo.dev) criado com [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).  

## Começando  

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

Você pode começar a desenvolver editando os arquivos dentro do diretório **app**. Este projeto utiliza [roteamento baseado em arquivos](https://docs.expo.dev/router/introduction/).  

## Obter um novo projeto  

Quando estiver pronto, execute:  

```bash
npm run reset-project
```

Esse comando moverá o código inicial para o diretório **app-example** e criará um diretório **app** em branco, onde você pode começar a desenvolver.  

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
   - Crie um novo arquivo `firebaseConfig.js` dentro do diretório `firebase/`   
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

Para aprender mais sobre o desenvolvimento do seu projeto com Expo, confira os seguintes recursos:  

- [Documentação do Expo](https://docs.expo.dev/): Aprenda desde os fundamentos até tópicos avançados com nossos [guias](https://docs.expo.dev/guides).  
- [Tutorial do Expo](https://docs.expo.dev/tutorial/introduction/): Siga um tutorial passo a passo para criar um projeto que roda no Android, iOS e Web.  

## Junte-se à comunidade  

Junte-se à nossa comunidade de desenvolvedores criando aplicativos universais.  

- [Expo no GitHub](https://github.com/expo/expo): Veja nossa plataforma open-source e contribua.  
- [Comunidade no Discord](https://chat.expo.dev): Converse com usuários do Expo e tire dúvidas.  
- [Fóruns do Expo](https://forums.expo.dev): Discuta e encontre respostas da comunidade.  

## Licença  

Este projeto está licenciado sob a [Licença MIT](LICENSE).

