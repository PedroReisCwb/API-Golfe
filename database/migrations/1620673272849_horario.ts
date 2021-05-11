import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Horario extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_HORARIO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_agendamento_agenda_periodo').unsigned().references('id').inTable('AGENDAMENTO_GLF_AGENDA_PERIODO')
      table.integer('id_agendamento_situacao').unsigned().references('id').inTable('AGENDAMENTO_GLF_SITUACAO')
      table.string('horario', 5).notNullable()
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
