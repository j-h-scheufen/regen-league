# Regen League

### Data Model Deployment

1. ```composedb did:generate-private-key```
2. ```composedb composite:create schemas/schema.graphql --output=schemas/composite.json --ceramic-url=http://0.0.0.0:7007 --did-private-key=...```
3. ```composedb composite:deploy schemas/composite.json --ceramic-url=http://0.0.0.0:7007```
4. Add deployed schema ID to ```~/.ceramic/daemon.config.json```
5. ```composedb composite:compile --ceramic-url=http://0.0.0.0:7007 schemas/composite.json schemas/runtime-composite.json```
6. ```composedb composite:compile --ceramic-url=http://0.0.0.0:7007 schemas/composite.json src/__generated__/definition.ts```
7. ```composedb graphql:schema schemas/runtime-composite.json -o schemas/relay-schema.graphql```
8. ```npm run relay```
9. ```composedb graphql:server --ceramic-url=http://localhost:7007 --port=10101 --graphiql schemas/runtime-composite.json --did-private-key=...```

Useful Commands:
- ```composedb did:from-private-key <key>```