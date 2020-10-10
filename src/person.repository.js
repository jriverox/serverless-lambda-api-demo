// person.repository.js
const PersonModel = require('./person.model');

module.exports = class PersonRepository {
  constructor(connection) {
    // this.connection = connection;
    this.model = PersonModel.getModel(connection);
  }
  /**
   *
   * @param {object} filter: puede contener una o mas propiedades del documento en MongoDB por el cual se desea buscar
   */
  async findOne(filter) {
    return await this.model.findOne(filter);
  }

  // /**
  //  *
  //  * @param {object} person: contiene las propiedades del documento que se desea guardar,
  //  * deberia coincidir con la colección people, con excepción del al propiedad _id que la
  //  * establece MongoDb automaticamente
  //  * @param {*} upsert: si es true (valor por defecto) indica que si no existe se inserte.
  //  */
  async save(person, upsert = true) {
    const filter = { index: person.index }
    const options = { upsert: upsert }
    await this.model.updateOne(filter, person, options)
  }

  async find(filter, page = 1, size = 10) {
    const skip = (page - 1) * size
    return await this.model.find(filter, null, { skip: skip, limit: size })
  }
}