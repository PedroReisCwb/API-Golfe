import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AgendamentoSituacao extends BaseModel {
  public static table = 'AGENDAMENTO_GLF_SITUACAO'

  @column({ isPrimary: true })
  public id: number

  @column()
  public descricao: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public dt_status: DateTime
}
