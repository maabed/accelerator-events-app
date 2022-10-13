import { Model, AjvValidator } from 'objection';
import addFormats from 'ajv-formats';

export default class BaseModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: true,
        ownProperties: true,
      },
    });
  }

  static get modelPaths() {
    return [__dirname];
  }

  static async exists(args) {
    return !!(await this.findOne(args));
  }

  static count(args) {
    return this.query().where(args).resultSize();
  }

  static async findById(id) {
    return await this.query().findById(id);
  }

  static async findByIds(ids) {
    return await this.query().findByIds(ids);
  }

  static async findOne(args) {
    return await this.query().findOne(args);
  }

  static async findOrInsert(args) {
    let row = await this.findOne(args);
    if (!row) row = await this.query().insert(args);
    return row;
  }

  static async deleteById(id) {
    return await this.query().deleteById(id);
  }

  static async deleteByIds(ids) {
    return await this.query().delete().whereIn('id', ids);
  }
}
