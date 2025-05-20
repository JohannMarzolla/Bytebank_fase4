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

3. Configure as credenciais do Firebase no arquivo `src/shared/constants/firebase-config`

## Scripts disponíveis

No diretório do projeto, você pode executar:

- `npm start` - Inicia o servidor de desenvolvimento.
- `npm run android` - Executa o app em um emulador ou dispositivo Android.
