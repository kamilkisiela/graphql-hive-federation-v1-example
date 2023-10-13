# Apollo Federation v1 with GraphQL Hive

```bash
npm install

# Start subgraphs
npm run subgraphs

# After subgraphs are running
# Start the gateway
TOKEN=YOUR-TOKEN npm run gateway

# After gateway is running
# Run the following curl command to execute a query
# Run it a few times.
curl --request POST \
  --header 'content-type: application/json' \
  --url http://localhost:4000/ \
  --data '{"query":"query GetAllProducts { allProducts { id } }", "operationName": "GetAllProducts"}'

# After a minute or less, you should be able to see the operation in the Insights page
```
