# Regen League

### Data Model Deployment

1. ```composedb did:generate-private-key```  
2. ```composedb composite:create schemas/schema.graphql --output=schemas/composite.json --ceramic-url=http://localhost:7007 --did-private-key=...```
3. ```composedb composite:deploy schemas/composite.json --ceramic-url=http://localhost:7007```
4. Add deployed schema ID to ```~/.ceramic/daemon.config.json```
5. ```composedb composite:compile schemas/composite.json schemas/runtime-composite.json```
6. ```composedb graphql:schema schemas/runtime-composite.json -o schemas/relay-schema.graphql```
7. ```npm run relay```
8. ```composedb graphql:server --ceramic-url=http://localhost:7007 --graphiql runtime-composite.json --did-private-key=...```