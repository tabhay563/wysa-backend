import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wysa Onboarding API',
      version: '1.0.0',
      description: 'API documentation for the Wysa onboarding system',
    },
    servers: [
      {
        url: 'https://api.tabhay.tech',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      }
    }
  },
  apis: ['src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);

export const setupSwagger = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      // This will make Swagger use the current domain
      url: undefined, // Let Swagger auto-detect
      // Show the production server first when on production domain
      servers: [
        {
          url: 'https://api.tabhay.tech',
          description: 'Production server'
        },
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ]
    }
  }));
};