import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoAgendaPeriodo from './AgendamentoAgendaPeriodo'
import AgendamentoSituacao from './AgendamentoSituacao'

export default class AgendamentoHorario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_agendamento_agenda_periodo: number

  @column()
  public id_agendamento_situacao: number

  @column()
  public horario: string

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
