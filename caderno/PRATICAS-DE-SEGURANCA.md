# Segurança aplicada

- **Validação de entrada:** Zod verifica formato, limites e campos aceitos antes dos dados chegarem à lógica de pedido.
- **Consultas seguras:** o repositório PostgreSQL envia valores como parâmetros; texto digitado não é concatenado ao SQL.
- **Proteção HTTP:** Helmet configura cabeçalhos e CSP; CORS aceita a origem definida em `CORS_ORIGIN`; express-rate-limit reduz abuso de chamadas.
- **Credenciais:** `.env` contém configurações locais e fica no `.gitignore`. O arquivo publicado é `.env.example`, com dados demonstrativos.
- **Isolamento:** o banco não publica 5432 no host. O processo da API no container usa usuário sem privilégios e o banco está numa rede interna.
- **Erros e logs:** middleware centralizado não devolve detalhes internos em produção; Pino registra eventos estruturados e a auditoria procura erros críticos.
- **Interface:** dados do catálogo são escapados antes de compor os cartões; mensagens de retorno são colocadas com `textContent`.

Para uma implantação real, troque as credenciais de demonstração, armazene segredos num cofre apropriado e mantenha dependências e imagens atualizadas.
