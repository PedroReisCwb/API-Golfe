import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Configuracao extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_CONFIGURACAO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_agendamento_agenda').unsigned().references('id').inTable('AGENDAMENTO_GLF_AGENDA_PERIODO')
      table.integer('id_agendamento_buraco').unsigned().references('id').inTable('AGENDAMENTO_GLF_BURACO')
      table.integer('id_agendamento_equipe').unsigned().references('id').inTable('AGENDAMENTO_GLF_TIPO_EQUIPE')
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
