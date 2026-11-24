# Dependências são instaladas em estágio separado para manter a imagem final enxuta.
FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Estágio de testes conserva as dependências de desenvolvimento.
FROM dependencies AS test
COPY . .
CMD ["npm", "test"]

# A imagem de produção instala somente dependências necessárias em runtime.
FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY src ./src
COPY balcao ./balcao
COPY cozinha.sql ./cozinha.sql
# Usuário sem privilégios: o processo não roda como root.
USER node
EXPOSE 3000
# Verificação local compatível com a imagem Alpine.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "src/server.js"]
