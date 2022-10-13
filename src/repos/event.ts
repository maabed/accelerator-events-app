import BaseModel from './base';
import { Model, RelationMappings, ColumnNameMappers } from 'objection';

export default class Event extends BaseModel {
  id: string;
  calId: string;
  createdBy: string;
  start: string;
  end: string;
  alarm: string;
  duration?: string;
  title: string;
  url?: string;
  attendees?: Array<string> | [];
  createdAt: string;

  static columnNameMappers: ColumnNameMappers = {
    parse(obj) {
      return {
        ...obj,
      };
    },

    format(obj) {
      return obj;
    },
  };

  static get tableName() {
    return 'event';
  }

  static get idColumn() {
    return 'id';
  }

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      calId: { type: 'string', format: 'uuid' },
      createdBy: { type: 'string', format: 'uuid' },
      start: { type: 'string' },
      end: { type: 'string' },
      alarm: { type: 'boolean', default: true },
      duration: { type: 'integer' },
      title: { type: 'string' },
      url: { type: 'string' },
      attendees: { type: 'object', default: {} },
      createdAt: { type: 'string', format: 'date-time' },
    },
  };

  static get relationMappings(): RelationMappings {
    return {
      calender: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/calender`,
        join: {
          from: 'event.calId',
          to: 'calender.id',
        },
      },
    };
  }

  static getById(eventId: string) {
    return Event.query()
      .where({ id: eventId })
      .first();
  }
}
