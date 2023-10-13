import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";

const port = 4001;

const delivery = [
  {
    id: "apollo-federation",
    estimatedDelivery: "6/25/2021",
    fastestDelivery: "6/24/2021",
  },
  {
    id: "apollo-studio",
    estimatedDelivery: "6/25/2021",
    fastestDelivery: "6/24/2021",
  },
];

const typeDefs = gql(`
  directive @tag(name: String!) repeatable on FIELD_DEFINITION

  extend type Product @key(fields: "id") {
    id: ID! @external @tag(name: "hi-from-inventory")
    dimensions: ProductDimension @external
    delivery(zip: String): DeliveryEstimates @requires(fields: "dimensions { size weight }")
  }

  type ProductDimension {
    size: String
    weight: Float @tag(name: "hi-from-inventory-value-type-field")
  }

  type DeliveryEstimates {
    estimatedDelivery: String
    fastestDelivery: String
  }
`);
const resolvers = {
  Product: {
    delivery: (product, args, context) => {
      return delivery.find((p) => p.id == product.id);
    },
  },
};
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
server
  .listen({ port: port })
  .then(({ url }) => {
    console.log(`🚀 Inventory subgraph ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
