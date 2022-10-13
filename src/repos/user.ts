import { Model, RelationMappings, ColumnNameMappers, Transaction, PartialModelObject } from 'objection';
import BaseModel from './base';

interface GetUserAttrs {
  id?: string | null;
  email?: string | null;
  username?: string | null;
}

export default class User extends BaseModel {
  id: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt?: string | null;
  calender?: any;

  static get tableName() {
    return 'user';
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
      firstname: { type: 'string', minLength: 1, maxLength: 100 },
      lastname: { type: 'string', minLength: 1, maxLength: 100 },
      username: { type: 'string' },
      email: { type: 'string', format: 'email' },
      createdOn: { type: 'string', format: 'date-time' },
      updatedOn: { type: 'string', format: 'date-time' },
    },
  };

  static get relationMappings(): RelationMappings {
    return {
      calender: {
        relation: Model.HasOneRelation,
        modelClass: `${__dirname}/calender`,
        join: {
          from: 'user.id',
          to: 'calender.owner',
        },
      },
      events: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/event`,
        join: {
          from: 'user.id',
          to: 'event.createdBy',
        },
      },
    };
  }

  static async create(user: User, trx?: Transaction) {
    return User.query(trx).insert(user).returning('*') as PartialModelObject<User>;
  }

  static findMaybeOne({ email, username }: GetUserAttrs, trx?: Transaction) {
    return User.query(trx)
      .where((builder) => {
        if (email) {
          builder.andWhere('email', email);
        }
        if (username) {
          builder.andWhere('username', username);
        }
      })
      .withGraphFetched('calender')
      .modifyGraph('calender', (builder) => {
        builder.select('id');
      })
      .first()
      .execute();
  }

  static getById(id: string) {
    return User.query().findById(id);
  }

  static getByIds(userIds: string[]) {
    return User.query().whereIn('id', userIds);
  }
}
