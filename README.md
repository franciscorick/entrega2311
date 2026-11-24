# EstuLanches — Francisco

Painel de cantina para consultar o cardápio, registrar comandas e acompanhar o preparo dos pedidos. A identidade visual usa um quadro de sabores com tons de floresta e açafrão. Aplicação: HTML, CSS, JavaScript, Node.js 24 LTS, Express e PostgreSQL 16 em containers Docker.

## Instalar e iniciar em outro PC (Windows)

1. Instale o [Git para Windows](https://git-scm.com/install/win), o [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) e o [Node.js 24 LTS x64](https://nodejs.org/en/download/archive/v24/). Node instalado no Windows é usado para testes e para gerar o PDF; o próprio container já traz Node para executar a aplicação. Se o Docker pedir WSL 2, abra PowerShell como Administrador, rode `wsl --install` e reinicie o computador. Abra o Docker Desktop.
2. No GitHub, abra o repositório do Francisco, use **Code > HTTPS > copiar** e cole a URL no lugar do endereço de exemplo:

   ```powershell
   Set-Location "$HOME\Desktop"
   git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git EstuLanches-Chico
   Set-Location "$HOME\Desktop\EstuLanches-Chico"
   ```

3. Crie o ambiente local e instale as dependências para testes:

   ```powershell
   Copy-Item .env.example .env
   npm ci
   ```

4. Inicie o sistema e aguarde os serviços ficarem saudáveis:

   ```powershell
   docker compose up -d --build
   docker compose ps
   Invoke-RestMethod http://localhost:3000/health
   ```

5. Acesse [http://localhost:3000](http://localhost:3000). O banco, as tabelas e os itens de exemplo são criados pelo Docker. Não instale PostgreSQL no Windows.

## Testes e Ficha RDM

Com Docker Desktop aberto e o sistema iniciado, rode tudo numa sequência:

```powershell
npm run rdm
```

O comando executa testes unitários, testes de integração usando PostgreSQL, auditoria do ambiente e gera `rdm/RDM-EstuLanches-Chico.pdf`. Para rodar etapas isoladas, use `npm run test:unit`, `docker compose --profile test run --build --rm tests npm run test:integration` e `npm run validar`.

## Uso

- **Cardápio do dia:** busque, filtre, inclua, edite ou remova itens.
- **Registrar comanda:** informe o nome, escolha produtos e quantidades e envie para preparo.
- **Pedidos na fila:** acompanhe e atualize o status.

## Parar e retomar

```powershell
docker compose stop app     # libera a porta 3000 sem desligar o banco
docker compose start app    # retoma a aplicação
docker compose down         # encerra os containers e preserva os dados
docker compose up -d        # inicia novamente depois do down
```

Só uma versão do EstuLanches pode usar a porta 3000 ao mesmo tempo. Para alternar entre pastas de projetos, pare o `app` da versão ativa primeiro. Evite `docker compose down -v`, pois esse comando apaga os dados persistidos.

## Materiais

- [Guia detalhado para PC novo](COMECE-AQUI.md)
- [Roteiro de vídeo](caderno/NARRACAO-DEMO.md)
- [Mapa técnico](caderno/MAPA-TECNICO.md) · [Segurança](caderno/PRATICAS-DE-SEGURANCA.md) · [Escalabilidade conceitual](caderno/PLANO-DE-ESCALA.md)
- [Dockerfile](Dockerfile) · [Compose](docker-compose.yml)

Antes de enviar ao GitHub, confirme que `.env` não está incluído. Publique `.env.example`, que só tem credenciais locais demonstrativas.
