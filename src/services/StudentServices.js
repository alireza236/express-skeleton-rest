import _ from 'lodash';
import { orderBuilder } from 'lib/query';
import {  responseRedactor } from 'lib/utils';
import winston from "lib/winston";
import { param } from 'express-validator';

class StudentServices {

  constructor({ config, db }) {
    this.config = config;
    this.db = db;
    this.Op = this.db.Sequelize.Op;
  }

  embeds(embed) {

    switch (embed) {
      case 'telephone':
        return {
          model: this.db.Telephone,
          as:'telephone'
        };
       case 'classroom':
         return {
          model: this.db.ClassRoom,
          as:'class'
        };
       case 'hobby':
          return {
           model: this.db.Hobby,
           as:'hobbys'
         }   
      default:
        return null;
    }
  }

  find(id, params = {}) {
    //get all attributes on model.
    const rawAttrs = Object.keys(this.db.Student.rawAttributes) || [];

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
      return this.db.Student.findOne(option);
    } catch (err) {
      throw err;
    }
  }


  async findAll({ params }) {

    //get all attributes on model.
    const rawAttrs = Object.keys(this.db.Student.rawAttributes) || [];

    let {
      q,
      studentId,
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

      if (studentId) {
        this.where.studentId = studentId;
      }

      if (status) {
        this.where.status = status;
      }

      //search by query
      if (q) {
        this.where.firstname = {
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

      let collection = await this.db.Student.findAndCountAll(option);
      return responseRedactor(collection, {
        limit: this.limit,
        offset: this.offset
      });
    } catch (err) {
      throw err;
    }
  }


  async create({ params }) {
    this.include = [{
      model: this.db.Telephone,
      as:'telephone'
    }, {
      model: this.db.ClassRoom,
      as:'class'
    }
  ]
    let option = {
      include:this.include 
    } 
    try {
      let Students  = await  this.db.Student.create(params,option) 
      /* console.log(params.hobby) */
      _.forEach(params.hobby,async (Hobby)=>{
        let hobbi = await this.db.Hobby.findByPk(Hobby.id);
        if(!hobbi){
          winston.log('error', ' List hobby not found');
        }
       
        return  this.db.HobbyStudent.bulkCreate([
          {  
             studentId: Students.id, 
             hobbyId: Hobby.id
          },
        ]); 
      }); 

    } catch (err) {
      throw err;
    }
  }

  async update({ object, params }) {
    
    try {

      let telepon = await this.db.Telephone.findByPk(object.id,{
        include:[{
          model:this.db.Student,
          as:'phoneStudent'
          }]
        });
      

     let Result = _.forEach(params.hobby, async (Hobby)=>{
         let hobbi = await this.db.Hobby.findByPk(Hobby.id);
         if(!hobbi){
           winston.log('error', ' List hobby not found');
         }
          await this.db.HobbyStudent.destroy({
              where: {
                studentId: object.id
              }
            }) 
       
          await this.db.HobbyStudent.bulkCreate([
            {  
              studentId: object.id, 
              hobbyId: Hobby.id
            }
        ])
      })

      return Promise.all([
          object.update(params),
          telepon.update(params.telephone),
          Result
      ]);  
    } catch (err) {
      throw err;
    }
  }

  //REOMVE
  async remove({ object }) {
     
    let option = {
      isActive: false,
    };
    try {
      await object.update(option);
      return option;
    } catch (err) {
      throw err;
    }
  }

}

module.exports = StudentServices;