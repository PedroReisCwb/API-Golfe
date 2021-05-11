import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoAgendaPeriodo from './AgendamentoAgendaPeriodo'
import AgendamentoSituacao from './AgendamentoSituacao'

export default class AgendamentoRestricao extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public data_inicio: DateTime

  @column.dateTime()
  public data_fim: DateTime

  @column()
  public msg_resumida: string

  @column()
  public msg_detalhada: string

  @column()
  public bloquear: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public dt_status: DateTime

  @hasOne(() => AgendamentoAgendaPeriodo, {
    foreignKey: 'id_agendamento_agenda_periodo',
  })
  public agenda: HasOne<typeof AgendamentoAgendaPeriodo>

  @hasOne(() => AgendamentoSituacao, {
    foreignKey: 'id_agendamento_situacao',
  })
  public situacao: HasOne<typeof AgendamentoSituacao>
}
