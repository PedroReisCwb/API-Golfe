// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"

export default class AgendamentoUsuariosController {
  public async login({ response, params }) {
    // Rota para buscar todas as agendas
    const associado = await Database.rawQuery(`
      SELECT
        CASE WHEN AJ.id <> '' THEN AJ.id ELSE 0 END id,
        CASE WHEN AJ.nome <> '' THEN AJ.nome ELSE '' END nome,
        CAST(CASE WHEN AJ.id <> '' THEN 1 ELSE 0 END AS BIT) jogador
      FROM SOC_SOCIOS_SENHA SSC WITH (nolock)
      LEFT JOIN AGENDAMENTO_GLF_JOGADOR AJ ON AJ.categoria = SSC.CATEGORIA AND AJ.matricula = SSC.MATRICULA
      WHERE SSC.token = '${params.token}'
      AND SSC.STATUS <> 'E'
      AND SSC.GERACAO = 0`)

    if (associado[0]) {
      return response.json(associado[0])
    }else{
      return response.json({"Erro":"Token inválido"})
    }
  }
}
