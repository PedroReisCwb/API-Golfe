// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"

export default class AgendamentoUsuariosController {
  public async login({ response, params }) {
    // Rota para buscar todas as agendas
    const associado = await Database.rawQuery(`SELECT AJ.id id_jogador, AJ.nome nome_jogador, SSC.token FROM SOC_SOCIOS_SENHA SSC WITH (nolock)
        INNER JOIN AGENDAMENTO_GLF_JOGADOR AJ ON AJ.categoria = SSC.CATEGORIA AND AJ.matricula = SSC.MATRICULA
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
