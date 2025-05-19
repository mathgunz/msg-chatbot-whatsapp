# Dockerfile para aplicação NestJS (Typescript)
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install --legacy-peer-deps

# Copia o restante da aplicação
COPY . .

# Compila o projeto
RUN npm run build

# Expõe a porta padrão
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "run", "start:prod"]
