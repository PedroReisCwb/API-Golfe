import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import AgendamentoSituacao from './AgendamentoSituacao'

export default class AgendamentoTipoEquipe extends BaseModel {
  public static table = 'AGENDAMENTO_GLF_TIPO_EQUIPE'

  @column({ isPrimary: true })
  public id: number

  @column()
  public id_agendamento_situacao: number

  @column()
  public limite_qtde: number

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
