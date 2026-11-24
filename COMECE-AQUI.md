# Guia de instalação em outro PC — Windows

Siga na ordem. Você não precisa instalar PostgreSQL: o banco funciona dentro do Docker.

## 1. Instalar WSL 2 (se o Docker solicitar)

Abra o PowerShell como Administrador e execute:

```powershell
wsl --install
```

Reinicie o computador. Em um PowerShell normal, confira:

```powershell
wsl --update
wsl --version
```

## 2. Instalar Docker Desktop

Baixe o [Docker Desktop para Windows](https://docs.docker.com/desktop/setup/install/windows-install/). No instalador, mantenha o backend WSL 2. Abra Docker Desktop e espere ele indicar que está pronto. Docker Compose já vem incluído.

## 3. Instalar Git e Node.js

1. Instale o [Git para Windows](https://git-scm.com/install/win), mantendo as opções padrão.
2. Baixe o instalador Windows x64 do [Node.js 24 LTS](https://nodejs.org/en/download/archive/v24/).
3. Feche e reabra o PowerShell para atualizar o PATH.

Confira as instalações:

```powershell
git --version
node --version
npm --version
docker --version
docker compose version
```

`node --version` deve começar com `v24.`. Node no Windows é necessário para os testes e para gerar a RDM. Para executar a aplicação, o container já contém Node.

## 4. Clonar o repositório

No GitHub do Francisco, clique em **Code**, copie a URL HTTPS e substitua o endereço de exemplo:

```powershell
Set-Location "$HOME\Desktop"
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git EstuLanches-Chico
Set-Location "$HOME\Desktop\EstuLanches-Chico"
```

## 5. Preparar as configurações

```powershell
Copy-Item .env.example .env
npm ci
```

O arquivo `.env` é local e ignorado pelo Git. O exemplo contém configurações de desenvolvimento que já combinam entre si.

## 6. Subir a aplicação e o banco

Confirme que Docker Desktop está aberto. Depois execute:

```powershell
docker compose up -d --build
docker compose ps
```

Espere `app` e `db` aparecerem como `healthy`. Na primeira inicialização, o Docker baixa as imagens e cria as tabelas e os itens iniciais. Pode levar alguns minutos.

- Sistema: [http://localhost:3000](http://localhost:3000)
- Saúde da API e banco: [http://localhost:3000/health](http://localhost:3000/health)

## 7. Rodar validações e gerar a ficha

Com os serviços ativos:

```powershell
npm run rdm
```

O processo executa os testes unitários, os testes de integração com PostgreSQL real, verifica estado/logs/saúde e gera `rdm/RDM-EstuLanches-Chico.pdf`. Relatórios JSON ficam na pasta `rdm`.

## 8. Parar e voltar a iniciar

Para desligar sem remover os dados:

```powershell
docker compose down
```

Para iniciar de novo, entre na pasta do projeto e rode `docker compose up -d`. Evite `docker compose down -v`: o `-v` apaga o volume com os dados do banco.

## Se algo não funcionar

- Docker não responde: abra Docker Desktop e rode `docker info`.
- Container não fica saudável: confira `docker compose logs db` e `docker compose logs app`.
- Porta 3000 ocupada: pare a outra API que esteja usando a porta antes de iniciar esta.
- Node ou npm não reconhecido: reabra o PowerShell e confira se `node --version` começa com `v24.`.
- `npm ci` rejeita a versão: instale Node.js 24 LTS x64 e abra um terminal novo.
