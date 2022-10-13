import { Model, RelationMappings, ColumnNameMappers } from 'objection';
import BaseModel from './base';

export default class Calender extends BaseModel {
  id: string;
  owner: string;
  name: string;
  timezone?: string | null;
  description?: string | null;
  color?: string | null;
  createdAt: string | null;

  static get tableName() {
    return 'calender';
  }

  static get idColumn() {
    return 'id';
  }

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
  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      owner: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      timezone: { type: 'string', default: 'Asia/Amman' },
      description: { type: 'string' },
      color: { type: 'string', default: '#FFFFF' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  };

  static get relationMappings(): RelationMappings {
    return {
      events: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/event`,
        join: {
          from: 'calender.id',
          to: 'event.calId',
        },
      },
    };
  }

  static getById(calId: string) {
    return Calender.query().findById(calId);
  }
}
