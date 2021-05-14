import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoSituacao from './AgendamentoSituacao'

export default class AgendamentoBuraco extends BaseModel {
  public static table = 'AGENDAMENTO_GLF_BURACO'

  @column({ isPrimary: true })
  public id: number

  @column()
  public id_agendamento_situacao: number

  @column()
  public numero_buraco: number

  @column()
  public descricao: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public dt_status: DateTime

  @hasOne(() => AgendamentoSituacao, {
    foreignKey: 'id_agendamento_situacao',
  })
  public situacao: HasOne<typeof AgendamentoSituacao>
}
