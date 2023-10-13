import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";

const port = 4002;

const pandas = [
  { name: "Basi", favoriteFood: "bamboo leaves" },
  { name: "Yun", favoriteFood: "apple" },
];

const typeDefs = gql(`
  type Query {
    allPandas: [Panda]
    panda(name: ID!): Panda
  }

  type Panda {
      name:ID!
      favoriteFood: String
  }
`);
const resolvers = {
  Query: {
    allPandas: (_, args, context) => {
      return pandas;
    },
    panda: (_, args, context) => {
      return pandas.find((p) => p.id == args.id);
    },
  },
};
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
server
  .listen({ port: port })
  .then(({ url }) => {
    console.log(`🚀 Pandas subgraph ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
