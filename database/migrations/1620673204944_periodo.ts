import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Periodo extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_AGENDA_PERIODO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_agendamento_situacao').unsigned().references('id').inTable('AGENDAMENTO_GLF_SITUACAO')
      table.string('descricao', 100).notNullable()
      table.dateTime('data_inicio').notNullable()
      table.dateTime('data_fim').notNullable()
      table.dateTime('data_hora_liberacao').notNullable()
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
