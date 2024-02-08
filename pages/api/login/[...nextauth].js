import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  providers: [
    Providers.Credentials({
      // O nome para exibir na tela de login
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jane.doe@example.com" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Adicione aqui a lógica para encontrar o usuário no seu banco de dados
        // e verificar a senha
        const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
        // Exemplo de verificação de usuário (substitua pelo seu código de verificação)
        if (credentials.email === user.email) {
          return user
        } else {
          return null
        }
      }
    }),
    // Você pode adicionar mais provedores aqui
  ],

  // Adicione opções adicionais do NextAuth conforme necessário
  session: {
    jwt: true,
  },

  // Página personalizada de login, se necessário
  pages: {
    signIn: '/auth/signin',  // Uma rota customizada para a página de login
  },

  callbacks: {
    // Você pode adicionar callbacks aqui, como o jwt callback para personalizar o token
  },
})
