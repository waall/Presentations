const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');
const cors = require('cors');

const typeDefs = gql`
  type Satellite {
    id: ID!
    name: String!
    orbit: String!
    type: String!
    project: String
  }

  type Project {
    id: ID
    projectname: String
    target: String
  }

  type Query {
    satellite(id: ID!): Satellite
    project(target: String!): Project
  }
`;

const resolvers = {
  Query: {
    satellite: (parent, { id }) => {//var
      const satellitesData = {
        '1': { id: '1', name: 'Satellite Alfa', orbit: 'Low Earth', type: 'Communication', project:'Vanguard TV3' },
        '2': { id: '2', name: 'Satellite Bravo', orbit: 'Geostationary', type: 'Weather', project: 'NOAA-19' },
        '3': { id: '3', name: 'Satellite Charlie', orbit: 'Polar', type: 'Earth Observation', project: '' },
        '1337': { id: '1337', name: 'Satellite Delta', orbit: 'Molniya', type: 'Military', project: '0X57' }
      };

      return satellitesData[id] || null; // Retorna null se não encontrar
    },
    project: (_, { target }) => {
      const projectData = {
        '57': { id: 57, projectname: '0x57', target: 'XPL{N40_T3NH0_D1NH3R0_PR0_C0L3T3_ESS3_AN0}' }
      };
      return projectData[target] 
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.post('/graphql', (req, res) => {
  const { id } = req.body; //var
    //console.log(id)//var
    //console.log({id})//var

  if (id) {//var
    const projectQuery = `
      query x {
        satellite(id: ${id}) {
          name
          orbit
          type
        }
      }
    `;

    server.executeOperation({
      query: projectQuery,
      variables: { id } //var
    })
      .then(result => res.json(result))
      .catch(err => res.status(500).json(err));
  } else {
    server.executeOperation({ query: req.body.query })
      .then(result => res.json(result))
      .catch(err => res.status(500).json(err));
  }
});

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });



  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Servidor Express pronto em http://localhost:${PORT}`);
    console.log(`Apollo Server GraphQL pronto em http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('Erro ao iniciar o servidor:', err);
});

