import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";

const port = 4004;

const users = [
  {
    email: "support@apollographql.com",
    name: "Apollo Studio Support",
    totalProductsCreated: 4,
  },
];

const typeDefs = gql(`
  type User @key(fields:"email") {
      email:ID!
      name: String
      totalProductsCreated: Int
  }
`);

const resolvers = {
  User: {
    __resolveReference: (reference) => {
      return users.find((u) => u.email == reference.email);
    },
  },
};
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
server
  .listen({ port: port })
  .then(({ url }) => {
    console.log(`🚀 Users subgraph ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
