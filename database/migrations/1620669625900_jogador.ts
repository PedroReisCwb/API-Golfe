import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Jogador extends BaseSchema {
  protected tableName = 'AGENDAMENTO_GLF_JOGADOR'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('id_agendamento_situacao').unsigned().references('id').inTable('AGENDAMENTO_GLF_SITUACAO')
      table.integer('geracao', 1).notNullable()
      table.string('categoria', 1).notNullable()
      table.integer('matricula', 5).notNullable()
      table.integer('num_dep', 1).notNullable()
      table.string('nome', 70).notNullable()
      table.string('status', 1).notNullable()
      table.dateTime('dt_status').defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
