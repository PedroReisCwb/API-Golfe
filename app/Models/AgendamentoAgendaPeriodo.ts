import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoSituacao from './AgendamentoSituacao'

export default class AgendamentoAgendaPeriodo extends BaseModel {
  public static table = 'AGENDAMENTO_GLF_AGENDA_PERIODO'

  @column({ isPrimary: true })
  public id: number

  @column()
  public id_agendamento_situacao: number

  @column()
  public descricao: string

  @column.dateTime()
  public data_inicio: DateTime

  @column.dateTime()
  public data_fim: DateTime

  @column.dateTime()
  public data_hora_liberacao: DateTime

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public dt_status: DateTime

  @hasOne(() => AgendamentoSituacao, {
    foreignKey: 'id_agendamento_situacao',
  })
  public situacao: HasOne<typeof AgendamentoSituacao>
}
