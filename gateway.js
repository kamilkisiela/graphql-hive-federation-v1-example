import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";
import { hiveApollo } from "@graphql-hive/client";

const serviceList = [
  {
    name: "inventory",
    url: "http://localhost:4001/",
  },
  {
    name: "pandas",
    url: "http://localhost:4002/",
  },
  {
    name: "products",
    url: "http://localhost:4003/",
  },
  {
    name: "users",
    url: "http://localhost:4004/",
  },
];

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: serviceList,
  }),
});

const server = new ApolloServer({
  gateway,
  plugins: [
    hiveApollo({
      token: process.env.TOKEN,
      usage: true,
    }),
  ],
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
