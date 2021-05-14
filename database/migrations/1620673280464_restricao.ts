import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Restricao extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_RESTRICAO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_agendamento_agenda').unsigned().references('id').inTable('AGENDAMENTO_GLF_AGENDA_PERIODO')
      table.integer('id_agendamento_situacao').unsigned().references('id').inTable('AGENDAMENTO_GLF_SITUACAO')
      table.dateTime('data_inicio').notNullable()
      table.dateTime('data_fim').notNullable()
      table.string('msg_resumida', 50).notNullable()
      table.string('msg_detalhada', 300).notNullable()
      table.string('bloquear', 1).notNullable()
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
