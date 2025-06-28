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
        url: 'http://localhost:3000',
      },
      {
        url: 'https://api.tabhay.tech',
      },
    ],
  },
  apis: ['src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
export const setupSwagger = (app: any) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
};