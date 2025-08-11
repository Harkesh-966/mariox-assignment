import * as Joi from 'joi';

export const envSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
	PORT: Joi.number().default(3000),
	JWT_SECRET: Joi.string().min(16).required(),
});
