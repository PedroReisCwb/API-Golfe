import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoHistorico from './AgendamentoHistorico'

export default class AgendamentoConvidado extends BaseModel {
  public static table = 'AGENDAMENTO_GLF_CONVIDADO'

  @column({ isPrimary: true })
  public id: number

  @column()
  public id_agendamento_historico: number

  @column()
  public nome: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public dt_status: DateTime

  @hasOne(() => AgendamentoHistorico, {
    foreignKey: 'id_agendamento_historico',
  })
  public historico: HasOne<typeof AgendamentoHistorico>
}
