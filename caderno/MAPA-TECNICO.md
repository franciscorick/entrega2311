# Mapa técnico da cantina

## Componentes

- **`balcao/`**: interface HTML, CSS e JavaScript servida pelo Express. `quadro.js` consulta `/api`, aplica busca e filtro e prepara os formulários de produto e comanda.
- **`src/`**: API Express organizada em rotas, controllers, services e repositories. O serviço de pedidos valida disponibilidade e calcula o total no servidor.
- **PostgreSQL 16**: mantém produtos, comandas e itens. `cozinha.sql` cria as tabelas e inclui um cardápio de demonstração próprio desta versão.
- **Docker Compose**: inicia banco e API, aguarda a saúde do banco e mantém os dados em volume. O perfil `test` executa integração contra o PostgreSQL.
- **`checks/`**: testes unitários de regras e testes de integração das rotas.
- **`ferramentas/`**: validação do ambiente, execução sequencial de testes e emissão da Ficha RDM.

## Caminho de uma comanda

1. A interface envia nome, produtos e quantidades para `POST /api/orders`.
2. A API valida a entrada e busca os produtos disponíveis.
3. O serviço calcula o total com os preços do banco; o valor enviado pelo navegador não é considerado como fonte confiável.
4. O repositório grava comanda e itens numa transação PostgreSQL.
5. A fila lê os dados persistidos e permite atualizar o status.

O container da aplicação publica a porta 3000 do host por padrão. Para rodar duas versões do EstuLanches no mesmo computador, pare uma antes de iniciar a outra. O container do banco fica numa rede interna e usa volume persistente.
