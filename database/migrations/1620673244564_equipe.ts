import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Equipe extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_TIPO_EQUIPE'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_agendamento_situacao').unsigned().references('id').inTable('AGENDAMENTO_GLF_SITUACAO')
      table.integer('limite_qtde', 2)
      table.string('descricao', 100).notNullable()
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
