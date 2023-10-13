import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";

const port = 4003;

const products = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: "OSS",
  },
  { id: "apollo-studio", sku: "studio", package: "", variation: "platform" },
];
const typeDefs = gql(`
  directive @tag(name: String!) repeatable on FIELD_DEFINITION

  type Product @key(fields: "id") @key(fields: "sku package") @key(fields: "sku variation { id }"){
    id: ID! @tag(name: "hi-from-products")
    sku: String @tag(name: "hi-from-products")
    package: String
    variation: ProductVariation
    dimensions: ProductDimension

    createdBy: User @provides(fields: "totalProductsCreated")
  }

  type ProductVariation {
    id: ID!
  }

  type ProductDimension {
    size: String
    weight: Float
  }

  extend type Query {
    allProducts: [Product]
    product(id: ID!): Product
  }

  extend type User @key(fields: "email") {
    email: ID! @external
    totalProductsCreated: Int @external
  }
`);

const resolvers = {
  Query: {
    allProducts: (_, args, context) => {
      return products;
    },
    product: (_, args, context) => {
      return products.find((p) => p.id == args.id);
    },
  },
  Product: {
    variation: (reference) => {
      if (reference.variation) return { id: reference.variation };
      return { id: products.find((p) => p.id == reference.id).variation };
    },
    dimensions: () => {
      return { size: "1", weight: 1 };
    },
    createdBy: (reference) => {
      return { email: "support@apollographql.com", totalProductsCreated: 1337 };
    },
    __resolveReference: (reference) => {
      if (reference.id) return products.find((p) => p.id == reference.id);
      else if (reference.sku && reference.package)
        return products.find(
          (p) => p.sku == reference.sku && p.package == reference.package
        );
      else return { id: "rover", package: "@apollo/rover", ...reference };
    },
  },
};
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
server
  .listen({ port: port })
  .then(({ url }) => {
    console.log(`🚀 Products subgraph ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
