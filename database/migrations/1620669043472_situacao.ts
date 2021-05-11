import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Situacao extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_SITUACAO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('descricao', 100).notNullable()
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
