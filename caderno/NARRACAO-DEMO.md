# Roteiro de apresentação — EstuLanches do Francisco

**Duração prevista:** 2min40s a 2min55s. **Gravação:** captura da tela com narração em voz off. As falas entre aspas são o texto para narrar; as instruções em negrito são o que fazer e mostrar. Antes de gravar, inicie a aplicação, deixe o navegador em `http://localhost:3000` e rode `npm run rdm`. Não mostre o arquivo `.env` nem credenciais.

## 0:00–0:19 | Apresentação

**Na tela:** comece pelo quadro do cardápio. Mostre o cabeçalho, as abas e a frase de abertura.

**Fale:**

> Olá, eu sou o Francisco. Este é o EstuLanches, um painel que ajuda a cantina a manter o cardápio organizado e a receber pedidos sem depender de anotações soltas. A proposta aqui é simples: quem atende consulta o quadro, registra a comanda e acompanha o pedido até a entrega.

## 0:19–0:42 | Decisões e arquivos

**Na tela:** mostre a árvore do projeto com `balcao`, `src`, `checks`, `ferramentas` e `caderno`. Abra o `Dockerfile` e depois `docker-compose.yml`.

**Fale:**

> Organizei o projeto em pastas com funções diferentes: o balcão contém a interface, src guarda a API, checks reúne os testes e ferramentas concentra os comandos de operação. O Dockerfile prepara a aplicação com Node 24 e executa o processo sem privilégios de administrador. O Compose coloca API e PostgreSQL 16 em containers separados. O banco usa rede interna e volume persistente.

## 0:42–1:00 | Operação e conexão

**No terminal:** rode `docker compose ps`, `docker compose logs --tail=20` e `Invoke-RestMethod http://localhost:3000/health`.

**Fale:**

> Aqui eu confiro se os containers estão saudáveis, olho os registros de inicialização e consulto a rota health. A resposta confirma que a aplicação está ativa e conectada ao PostgreSQL. Isso valida a comunicação entre os dois serviços antes de demonstrar os pedidos.

## 1:00–1:34 | Demonstração do balcão

**No navegador:** pesquise `banana`, escolha um grupo no filtro e limpe a busca. Clique **Incluir no cardápio**; cadastre “Item do Chico”, grupo “Da fornada”, preço `5,00`; salve, edite a descrição e exclua o item. Abra **Registrar comanda**, informe “Aluno de demonstração”, marque dois itens e envie. Em **Pedidos na fila**, avance o status.

**Fale:**

> A busca e o filtro ajudam a localizar o que está disponível. O responsável também pode cadastrar, alterar e remover um produto. Na comanda, seleciono o nome e as quantidades; a tela mostra uma prévia do valor. O cálculo definitivo é feito no servidor, que grava o pedido e os itens no banco. Depois, a fila permite acompanhar e atualizar a etapa do preparo.

## 1:34–1:56 | Testes e proteção

**Na tela:** mostre `checks/unit`, `checks/integration` e a saída de `npm run rdm`. Destaque os números reais exibidos e abra `src/services/validation.js`.

**Fale:**

> Os testes unitários verificam regras como total e validação dos campos. A integração percorre a API com PostgreSQL real, incluindo criação de produto, registro de pedido e atualização de status. A API valida os dados, usa parâmetros nas consultas SQL, limita requisições e aplica cabeçalhos de segurança. O comando também audita o ambiente e guarda relatórios para consulta.

## 1:56–2:12 | Registro da mudança

**Na tela:** abra `rdm/RDM-EstuLanches-Chico.pdf` e aproxime os campos de versão, responsável, resultados e status.

**Fale:**

> Esta ficha documenta a mudança: identifica a versão e o responsável, registra os parâmetros relevantes e resume os resultados de testes e ambiente. Assim, fica registrado o que foi validado e qual foi o status final da implantação.

## 2:12–2:42 | Escala conceitual e encerramento

**Na tela:** mostre `caderno/PLANO-DE-ESCALA.md` e percorra o diagrama.

**Fale:**

> Para atender um milhão de pessoas, com cem mil acessos simultâneos, esta versão local precisaria de uma arquitetura maior. Conceitualmente, um balanceador distribuiria as chamadas entre várias réplicas da API, com autoscaling. Uma CDN entregaria arquivos perto dos usuários; uma fila ajudaria a absorver picos de pedidos. O PostgreSQL precisaria de pool de conexões, réplicas de leitura, monitoramento e um plano de particionamento. Isso é uma proposta para evolução, não está implantado neste protótipo. Obrigado.

## Conferência de gravação

- [ ] Duração entre 2 e 5 minutos; alvo aproximado de 2min45s.
- [ ] Aparecem Dockerfile, Compose, sistema, testes e ficha RDM.
- [ ] Demonstra cadastro, edição e remoção de produto; pedido e atualização de status.
- [ ] Fale os totais mostrados pela execução gravada, sem reaproveitar contagens antigas.
- [ ] Não exiba `.env` e deixe explícito que a escala nacional é conceitual.
