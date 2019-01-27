const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  scalar DateTime

  type Query {
    allUsers(filter: UserFilter, skip: Int, first: Int): [User!]!
    allRouletteGames(filter: RouletteGameFilter, skip: Int, first: Int): [User!]!
    allRouletteBets(filter: RouletteBetFilter, skip: Int, first: Int): [User!]!
  }

  type Mutation {
    createUser(username: String!, avatarURL: String!, steamId: String!, steamId64: String!): User
    createRouletteGame(status: Int!): RouletteGame
    createRouletteBet(type: ROULETTE_BET_TYPE!, value: String!, amount: Float!): RouletteBet
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
  }

  type Subscription {
    Link(filter: LinkSubscriptionFilter): LinkSubscriptionPayload
  }

  type User {
    id: ID!
    username: String!
    avatarURL: String!
    steamId: String!
    steamId64: String!
    tradeLink: String!
    balance: Int!
    isAdmin: Boolean!
    isModerator: Boolean!
    isDeveloper: Boolean!
    isBanned: Boolean!
    isBannedChat: Boolean!
    bets: [RouletteBet!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type RouletteBet {
    id: ID!
    user: [User!]!
    game: [RouletteGame!]!
    type: ROULETTE_BET_TYPE!
    value: String!
    amount: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum ROULETTE_BET_TYPE {
    STRAIGHT
    COLORS
    PARITY
    COLUMNS
    DOZENS
    HALVES
  }

  type RouletteGame {
    id: ID!
    winningNumber: Int!
    stake: Int!
    status: Int!
    bets: [RouletteBet!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Item {
    id: ID!
    name: String!
    marketHashName: String!
    classId: Int!
    rarity: String!
    price: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ShopItem {
    id: ID!
    name: String!
    classId: Int!
    inventoryId: String!
    rarity: String!
    type: String!
    quality: String!
    status: Int!
    steamPrice: Float!
    price: Float!
    buyer: [User]
    boughtAt: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Tickets {
    id: ID!
  }

  input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }

  type SigninPayload {
    token: String
    user: User
  }

  type Link {
    id: ID!
    url: String!
    description: String!
    postedBy: User
  }

  input LinkSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type LinkSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Link
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }

  input UserFilter {
    OR: [UserFilter!]
    description_contains: String
    url_contains: String
  }

  input RouletteGameFilter {
    OR: [RouletteGameFilter!]
    description_contains: String
    url_contains: String
  }

  input RouletteBetFilter {
    OR: [RouletteBetFilter!]
    description_contains: String
    url_contains: String
  }
`;

/* const resolveFunctions = {
  DateTime: GraphQLJSON
}; */

module.exports = makeExecutableSchema({ typeDefs, resolvers });
