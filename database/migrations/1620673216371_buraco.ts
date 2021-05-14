import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Buraco extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_BURACO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_agendamento_situacao').unsigned().references('id').inTable('AGENDAMENTO_GLF_SITUACAO')
      table.integer('numero_buraco').notNullable()
      table.string('descricao', 100).notNullable()
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
