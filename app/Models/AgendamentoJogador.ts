import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoSituacao from './AgendamentoSituacao'

export default class AgendamentoJogador extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_agendamento_situacao: number

  @column()
  public geracao: number

  @column()
  public categoria: string

  @column()
  public matricula: number

  @column()
  public num_dep: number

  @column()
  public nome: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public dt_status: DateTime

  @hasOne(() => AgendamentoSituacao, {
    foreignKey: 'id_agendamento_situacao',
  })
  public situacao: HasOne<typeof AgendamentoSituacao>
}
