// do not make changes to this file
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const environment = process.env.NODE_ENV || 'development';

module.exports = knex(knexConfig[environment]);

// SELECT project_id, project_completed from Projects

// [
//   {
//     project_id 1,
//     project_completed: 0
//   },
//   {
//     project_id 2,
//     project_completed: 0
//   }
// ]

// SELECT * from Projects
// [
//   {
//     project_id 1,
//     project_name: 'name',
//     project_description: 'description',
//     project_completed: 0
//   },
//   {
//     project_id 2,
//     project_name: 'name',
//     project_description: 'description',
//     project_completed: 0
//   },
// ]

// SELECT project_id, project_completed from Projects WHERE project_id = 2
// {
//   project_id 2,
//   project_completed: 0
// }

// SELECT * from Projects WHERE project_id = 2
// {
//   project_id 2,
//   project_name: 'name',
//   project_description: 'description',
//   project_completed: 0
// }

// SELECT project_id, project_completed from Projects WHERE project_name = 'name'
// [
//   {
//     project_id 1,
//     project_completed: 0
//   },
//   {
//     project_id 2,
//     project_completed: 0
//   }
// ]

// SELECT * from Projects WHERE project_name = 'name'
// [
//   {
//     project_id 1,
//     project_name: 'name',
//     project_description: 'description',
//     project_completed: 0
//   },
//   {
//     project_id 2,
//     project_name: 'name',
//     project_description: 'description',
//     project_completed: 0
//   },
// ]



// Table: Projects
//        Columns:     id     |    name    |    descritption     |     completed
// Row 1 "record" -     1     |   'build'  |    'build it'       |     false
// Row 2 "record" -     2     |   'screw'  |    "screw it"       |     true