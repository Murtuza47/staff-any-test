import Joi from 'joi';

const timeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/;

export const createShiftDto = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().required(),
  startTime: Joi.string().regex(timeRegex).required(),
  endTime: Joi.string().regex(timeRegex).required(),
  published: Joi.boolean().required()
});

export const updateShiftDto = Joi.object({
  name: Joi.string(),
  date: Joi.date(),
  startTime: Joi.string().regex(timeRegex),
  endTime: Joi.string().regex(timeRegex),
  published: Joi.boolean().required()
});