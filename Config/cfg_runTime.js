/**
 * @type {'Development'|'Production'}
 */
const Runtime_Type = process.env.RUNMODE || 'Development';
module.exports = { Runtime_Type };