import _ from 'lodash';
import { orderBuilder } from 'lib/query';
import {  responseRedactor } from 'lib/utils';


class ClassService {

  constructor({ config, db }) {
    this.config = config;
    this.db = db;
    this.Op = this.db.Sequelize.Op;
  }

  embeds(embed) {

    switch (embed) {
      case 'student':
        return {
         include:[{
            model:this.db.Telephone,
            as:'telephone'
          }], 
          model: this.db.Student,
          as:'class',
          required: false
        };
      default:
        return null;
    }
  }

  find(id, params = {}) {
    //get all attributes on model.
    const rawAttrs = Object.keys(this.db.ClassRoom.rawAttributes) || [];

    let {
      embeds,
      inc_attrs
    } = params;

    this.where = {
      id
    };

    this.include = [];
    this.attributes = {};
    this.attributes = inc_attrs ? _.split(inc_attrs, ',') : rawAttrs;

    if (embeds) {

      let includes = !_.isArray(_.split(embeds, ',')) ? [].push(embeds) : _.split(embeds, ',');

      _.forEach(_.split(includes, ','), include => {
        if (this.embeds(include)) {
          this.include.push(this.embeds(include));
        }
      });

    }

    let option = {
      include: this.include,
      attributes: this.attributes,
      where: this.where
    };

    try {
      return this.db.ClassRoom.findOne(option);
    } catch (err) {
      throw err;
    }
  }


  async findAll({ params }) {

    //get all attributes on model.
    const rawAttrs = Object.keys(this.db.ClassRoom.rawAttributes) || [];

    let {
      q,
      id,
      embeds,
      inc_attrs,
      exc_attrs,
      sort,
      offset,
      limit,
      status,
    } = params;

    this.where = {};
    this.include = [];
    this.offset = 0;
    this.limit = 10;
    this.order = [];
    this.scope = ['default', 'active'];
    this.attributes = {};
    this.attributes = inc_attrs ? _.split(inc_attrs, ',') : rawAttrs;

    try {

      //payload of checkOrganization md
      // let {
      //   organization
      // } = payloads;

      if (id) {
        this.where.id = id;
      }

      if (status) {
        this.where.status = status;
      }

      //search by query
      if (q) {
        this.where.classname = {
          [this.Op.like]: `%${q}%`
        };
      }

      if (exc_attrs) {
        this.attributes = {
          exclude: _.split(exc_attrs, ',')
        };
      }

      //override limit && offset
      if (offset && limit) {
        this.offset = parseInt(offset);
        this.limit = parseInt(limit);
      }

      //sorting orderBy attributes ASC or DESC
      this.order = sort ? orderBuilder(sort) : this.order;

      if (embeds) {

        let includes = !_.isArray(_.split(embeds, ',')) ? [].push(embeds) : _.split(embeds, ',');

        _.forEach(_.split(includes, ','), include => {
          if (this.embeds(include)) {
            this.include.push(this.embeds(include));
          }
        });

      }

      let option = {
        include: this.include,
        attributes: this.attributes,
        where: this.where,
        order: this.order,
        limit: this.limit,
        offset: this.offset,
        // raw: true
      };

      //remove object limit & offset, unlimited query
      if (limit && limit == 0) {
        option = _.omit(option, ['offset', 'limit']);
      }

      let collection = await this.db.ClassRoom.findAndCountAll(option);
      return responseRedactor(collection, {
        limit: this.limit,
        offset: this.offset
      });
    } catch (err) {
      throw err;
    }
  }


  create({ params }) {
    try {
      return this.db.ClassRoom.create(params);
    } catch (err) {
      throw err;
    }
  }

  async update({ object, params }) {
  
    try {
      object.update(params);
    } catch (err) {
      throw err;
    }
  }

  //REOMVE
  async remove({ object }) {
  
    let option = {
      isActive: false
    };

    try {
      await object.update(option);
      return option;
    } catch (err) {
      throw err;
    }
  }

}

module.exports = ClassService;