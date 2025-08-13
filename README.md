# Mock API de Temporada

API de mock para propriedades de temporada, construída com Express e json-server.

## Requisitos
- Node.js 18+ ou Bun 1.0+

## Instalação

Com Bun:
```bash
bun install
```

Ou com npm:
```bash
npm install
```

## Execução

Com Bun:
```bash
bun start
```

Ou com npm:
```bash
npm start
```

- Porta padrão: `3001` (pode ser alterada com a variável `PORT`)
- Base URL: `http://localhost:3001`

## Rotas

### POST /bookings
Simula a criação de uma reserva.

- Delay simulado de ~1s
- 20% de chance de erro 500
- Não persiste dados (apenas simulação)

Exemplo de requisição:
```bash
curl -X POST "http://localhost:3001/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": 12,
    "checkIn": "2025-08-20",
    "checkOut": "2025-08-25",
    "guests": 4,
    "customerName": "Fulano de Tal",
    "customerEmail": "fulano@example.com"
  }'
```

Respostas possíveis:
- 201 OK
```json
{ "message": "Booking simulated successfully!", "status": "success" }
```
- 500 Erro
```json
{ "message": "An unexpected error occurred. Please try again.", "status": "error" }
```

### GET /properties
Lista propriedades com suporte a filtros simples e avançados.

Observações importantes:
- Os dados estão em `db.json` sob a chave `properties`.
- Alguns valores de campos (por exemplo, `type`, `amenities`, nomes de cidades) estão em PT-BR nos dados de exemplo.
- Filtros avançados (abaixo) acionam o modo de filtro customizado.
- Se você usar apenas filtros simples, o `json-server` pode tratar diretamente, e para campos aninhados recomenda-se usar a notação de ponto (ex.: `location.city`).

Parâmetros de consulta suportados (custom):
- `minPrice` (number): preço mínimo por noite
- `maxPrice` (number): preço máximo por noite
- `guests` (number): quantidade mínima de hóspedes suportada
- `bedrooms` (number): quantidade mínima de quartos
- `available` ("true" | "false"): disponibilidade (se "true", retorna apenas disponíveis)
- `amenities` (string): lista separada por vírgula, exige todas as amenidades informadas
- `city` (string): cidade do campo `location.city`
- `state` (string): estado do campo `location.state`
- `type` (string): tipo de propriedade (ex.: "Casa", "Apartamento")

Dica sobre `amenities`: os valores atuais no dataset estão em PT-BR (ex.: `ar-condicionado`, `piscina`, `churrasqueira`, `smart-tv`, `cozinha-equipada`, `garagem`).

Exemplos:

- Listagem simples:
```bash
curl "http://localhost:3001/properties"
```

- Filtros avançados (modo custom):
```bash
curl "http://localhost:3001/properties?minPrice=200&maxPrice=600&guests=4&available=true&amenities=wifi,garagem"
```

- Filtros simples combinados com avançados (para usar `city`/`state` sem notação de ponto):
```bash
curl "http://localhost:3001/properties?minPrice=200&city=São Paulo&type=Apartamento"
```

- Apenas filtros simples via json-server (use notação de ponto para campos aninhados):
```bash
curl "http://localhost:3001/properties?location.city=São Paulo&type=Apartamento"
```

- Paginação e ordenação (nativo do json-server):
```bash
curl "http://localhost:3001/properties?_page=1&_limit=10&_sort=pricePerNight&_order=asc"
```

### GET /properties/:id
Obtém uma propriedade pelo ID (nativo do json-server).
```bash
curl "http://localhost:3001/properties/12"
```

### CRUD padrão (json-server)
Estão disponíveis as rotas nativas do json-server para `properties`:
- `POST /properties`
- `PUT /properties/:id`
- `PATCH /properties/:id`
- `DELETE /properties/:id`

Atenção: essas operações modificam o arquivo `db.json` local.

## Variáveis de Ambiente
- `PORT`: porta do servidor (padrão: `3001`)

## Solução de Problemas
- "Cannot find package 'json-server'":
  - Execute `bun install` ou `npm install` e inicie novamente.
- Porta em uso:
  - Defina outra porta: `PORT=4000 bun start`

## Estrutura dos Dados (exemplo resumido)
```json
{
  "id": 1,
  "title": "Apartamento aconchegante no centro",
  "type": "Apartamento",
  "location": { "city": "São Paulo", "state": "SP", "country": "Brasil" },
  "pricePerNight": 280,
  "maxGuests": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "sizeM2": 60,
  "isAvailable": true,
  "rating": 4.6,
  "reviewsCount": 132,
  "amenities": ["wifi", "ar-condicionado", "garagem", "cozinha-equipada", "smart-tv", "lavadora"],
  "images": ["https://picsum.photos/seed/imovel-1-1/800/600"],
  "host": { "name": "Mariana", "superHost": true, "since": "2019-03-12" }
}
```

## Notas
- Esta API é apenas para desenvolvimento e testes.
- Valores de campos (como `type` e `amenities`) permanecem em PT-BR no dataset de exemplo. Caso deseje, é possível traduzi-los para EN em uma futura revisão.
