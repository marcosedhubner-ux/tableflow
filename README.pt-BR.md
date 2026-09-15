# TableFlow

Gestão de salão, pedidos e cozinha em tempo real para restaurantes. O garçom abre uma mesa, envia o pedido pra cozinha, a cozinha vai marcando os itens como prontos conforme saem, e todas as telas do restaurante atualizam na hora — sem polling, sem precisar dar refresh.

[Read in English](./README.md)

## Por que esse projeto existe

A maioria dos projetos de portfólio sobre gestão de restaurante para no básico: um CRUD de cardápio. O TableFlow modela o ciclo operacional real de um restaurante: uma mesa passa por `disponível → ocupada → limpeza`, um pedido passa por `pendente → preparando → pronto → servido → pago`, e essas duas máquinas de estado são acopladas (pagar um pedido libera a mesa, cancelar também). Esse acoplamento, somado à propagação em tempo real pra três papéis diferentes olhando três telas diferentes, é a parte que vale a pena ler no código.

## Arquitetura

```
apps/
  web/   Next.js 16 (App Router, TypeScript, Tailwind) — salão, kitchen display, dashboard do gerente
  api/   Node/Express (TypeScript) — API REST + Socket.IO, Prisma ORM, PostgreSQL
```

A API é organizada por módulo de funcionalidade (`auth`, `tables`, `menu`, `orders`, `analytics`), cada um com sua própria camada de schema (Zod), service (regras de negócio) e rotas. Regras de domínio que não pertencem a um módulo específico — a máquina de estados do pedido, os erros de domínio tipados — ficam em `src/domain`. Nada em `domain` ou em um `service` importa Express; só os route handlers sabem que estão rodando dentro de um servidor HTTP.

```
src/
  domain/          máquina de estados + erros tipados, sem dependência de framework
  modules/<nome>/  <nome>.schema.ts   validação de entrada com Zod
                   <nome>.service.ts  regra de negócio, fala com o Prisma
                   <nome>.repository.ts (quando o módulo precisa)
                   <nome>.routes.ts   router do Express, controllers finos
  middlewares/     autenticação, checagem de papel, rate limiting, tratamento central de erro
  realtime/        broadcast via Socket.IO, desacoplado de qualquer rota específica
```

## Modelo de tempo real

A API é a única fonte da verdade. Toda mutação (criar pedido, mudar status, marcar item como pronto) passa pelo mesmo caminho: validar → aplicar a regra da máquina de estados → gravar no Postgres → emitir um evento via Socket.IO. O frontend nunca atualiza o estado local de forma otimista para dados compartilhados — ele escuta `table:updated` / `order:updated` e invalida o cache do React Query, então um pagamento registrado num tablet aparece na tela da cozinha e no dashboard do gerente no mesmo instante.

## Segurança

- Senhas com hash via bcrypt (fator de custo 12), sessões são JWTs em cookies `httpOnly` e `sameSite=lax` — nunca expostos a JavaScript do lado do cliente.
- Toda rota é autenticada por padrão; a checagem de papel (`SERVER` / `KITCHEN` / `MANAGER`) é aplicada no servidor em cada endpoint, não só escondida na interface.
- Toda entrada é validada com Zod na borda da aplicação; o Prisma parametriza todas as queries, então não existe SQL manual pra injetar.
- Rate limiting em `/auth/login` (proteção contra força bruta) e na API como um todo.
- `helmet` para cabeçalhos de segurança, CORS restrito à origem configurada do frontend.
- Nenhum segredo fica versionado no repositório — veja [Configuração](#configuração).

## Como rodar

### Pré-requisitos

- Node.js 20+
- Uma instância de PostgreSQL 14+ (local ou hospedada)

### 1. Configurar a API

```bash
cd apps/api
cp .env.example .env
```

Preencha o `.env`:

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `JWT_SECRET` | String aleatória, 32+ caracteres (`openssl rand -hex 32`) |
| `WEB_ORIGIN` | URL do frontend, para o CORS (`http://localhost:3000` em dev) |

```bash
npm install
npm run prisma:migrate   # cria o schema
npm run prisma:seed      # equipe, mesas e cardápio de demonstração
npm run dev              # http://localhost:4000
```

Contas de demonstração criadas pelo seed (senha `Passw0rd!123` para todas):

| Papel | Email |
| --- | --- |
| Gerente | `manager@tableflow.dev` |
| Garçom | `server@tableflow.dev` |
| Cozinha | `kitchen@tableflow.dev` |

### 2. Configurar o frontend

```bash
cd apps/web
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev                        # http://localhost:3000
```

## Testes

```bash
cd apps/api
npm test        # testes unitários da máquina de estados do pedido (Vitest)
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · TanStack Query · Node.js · Express · Socket.IO · Prisma · PostgreSQL · Zod · Vitest
