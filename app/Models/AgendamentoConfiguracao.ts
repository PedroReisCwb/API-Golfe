import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoAgendaPeriodo from './AgendamentoAgendaPeriodo'
import AgendamentoBuraco from './AgendamentoBuraco'
import AgendamentoTipoEquipe from './AgendamentoTipoEquipe'
import AgendamentoHorario from './AgendamentoHorario'

export default class AgendamentoConfiguracao extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_agendamento_agenda_periodo: number

  @column()
  public id_agendamento_buraco: number

  @column()
  public id_agendamento_tipo_equipe: number

  @column()
  public id_agendamento_horario: number

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public dt_status: DateTime

  @hasOne(() => AgendamentoAgendaPeriodo, {
    foreignKey: 'id_agendamento_agenda_periodo',
  })
  public agenda: HasOne<typeof AgendamentoAgendaPeriodo>

  @hasOne(() => AgendamentoBuraco, {
    foreignKey: 'id_agendamento_buraco',
  })
  public buraco: HasOne<typeof AgendamentoBuraco>

  @hasOne(() => AgendamentoTipoEquipe, {
    foreignKey: 'id_agendamento_tipo_equipe',
  })
  public equipe: HasOne<typeof AgendamentoTipoEquipe>

  @hasOne(() => AgendamentoHorario, {
    foreignKey: 'id_agendamento_horario',
  })
  public horario: HasOne<typeof AgendamentoHorario>
}
