import * as Joi from 'joi';

export const validationSchema = Joi.object({
   // System Configuration
   PORT: Joi.number().default(3001),
   APP_HOST: Joi.string().default('localhost'),
   NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),

   // Database Configuration
   DB_HOST: Joi.string().default('localhost'),
   DB_PORT: Joi.number().default(27017),
   DB_USERNAME: Joi.string().allow('', null).default(''),
   DB_PASSWORD: Joi.string().allow('', null).default(''),
   DB_NAME: Joi.string().default('Auth-Service'),

   // JWT Configuration
   JWT_SECRET: Joi.string().required(),
   JWT_EXPIRES_IN: Joi.string().default('15d'),
   ACCESS_TOKEN_SECRET: Joi.string().required(),
   ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
   REFRESH_TOKEN_SECRET: Joi.string().required(),
   REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('30d'),

   // Kafka Configuration
   KAFKA_BROKER: Joi.string().required(),
   KAFKA_CLIENT_ID: Joi.string().default('auth-service'),
   KAFKA_GROUP_ID: Joi.string().default('auth-group'),
   
   // Service Configuration
   API_GATEWAY_URL: Joi.string().uri().required(),
}); 