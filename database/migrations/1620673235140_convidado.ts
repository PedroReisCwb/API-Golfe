import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Convidado extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_CONVIDADO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_agendamento_historico').unsigned().references('id').inTable('AGENDAMENTO_GLF_HISTORICO')
      table.string('nome', 70).notNullable()
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
