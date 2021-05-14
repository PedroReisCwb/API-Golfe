import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoAgendaPeriodo from './AgendamentoAgendaPeriodo'
import AgendamentoBuraco from './AgendamentoBuraco'
import AgendamentoTipoEquipe from './AgendamentoTipoEquipe'
import AgendamentoHorario from './AgendamentoHorario'
import AgendamentoJogador from './AgendamentoJogador'

export default class AgendamentoHistorico extends BaseModel {
  public static table = 'AGENDAMENTO_GLF_HISTORICO'

  @column({ isPrimary: true })
  public id: number

  @column()
  public id_agendamento_historico: number

  @column()
  public id_agendamento_agenda: number

  @column()
  public id_agendamento_buraco: number

  @column()
  public id_agendamento_equipe: number

  @column()
  public id_agendamento_horario: number

  @column()
  public id_agendamento_jogador: number

  @column.dateTime()
  public data_reserva: DateTime

  @column.dateTime()
  public data_registro: DateTime

  @column.dateTime()
  public data_acesso: DateTime

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

  @hasOne(() => AgendamentoJogador, {
    foreignKey: 'id_agendamento_jogador',
  })
  public jogador: HasOne<typeof AgendamentoJogador>
}
