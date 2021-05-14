// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import AgendamentoConfiguracao from "App/Models/AgendamentoConfiguracao";

export default class AgendamentoConfiguracaoController {
  public async buscar() {
    const configuracoes = await AgendamentoConfiguracao.all();
    return configuracoes;
  }

  public async criar({ request }) {
    const data = request.only(['id_agendamento_agenda','id_agendamento_buraco','id_agendamento_equipe','status']);
    const configuracao = await AgendamentoConfiguracao.create(data);
    return configuracao;
  }

  public async atualizar({ request, params }) {
    const configuracao = await AgendamentoConfiguracao.findOrFail(params.id);
    configuracao.merge(request.only(['id_agendamento_agenda','id_agendamento_buraco','id_agendamento_equipe','status']));
    return await configuracao.save();
  }

  public async buscarHorarios({ response, params }) {
    const agenda = await Database.rawQuery(`DECLARE @id_agendamento_agenda INT = ${params.id}
      SELECT ah.id_agendamento_agenda as id_agenda, ah.id as id_horario, ab.id as id_buraco
          , ISNULL(ae.id,0) as id_equipe
          , ISNULL(HIST.ID_HISTORICO,0) id_historico
          , ISNULL(HIST.QTDE_JOGADORES,0) qtde_jogadores
          , ISNULL(AE.limite_qtde,0) limite_equipe
          , ISNULL(HIST.DATA_RESERVA, GETDATE()) data
          , ah.horario, ab.numero_buraco as tee_saida
          --, ISNULL(ae.descricao,'') equipe
          , CASE WHEN HIST.ID_HISTORICO IS NULL THEN 'L' ELSE HIST.status END status
          , ISNULL([AS].descricao,'Livre') situacao_agendamento
      FROM AGENDAMENTO_GLF_CONFIGURACAO ac
      INNER JOIN AGENDAMENTO_GLF_HORARIO ah ON ah.id_agendamento_agenda = ac.id
      INNER JOIN AGENDAMENTO_GLF_BURACO ab ON ac.id_agendamento_buraco = ab.id
      LEFT JOIN (SELECT AH1.id_agendamento_horario
            , MIN(ah1.ID) ID_HISTORICO
            , MIN(AH1.status) STATUS
            , MIN(AH1.data_reserva) DATA_RESERVA
            , COUNT(*) QTDE_JOGADORES
            FROM AGENDAMENTO_GLF_HISTORICO ah1
              --LEFT JOIN AGENDAMENTO_GLF_HISTORICO AHJ ON AHJ.id_agendamento_historico = AH1.id
            WHERE  ah1.id_agendamento_agenda = @id_agendamento_agenda
              AND CAST(ah1.data_reserva AS date) = CONVERT(DATE, GETDATE())
              AND AH1.STATUS <> 'E'
            GROUP BY AH1.id_agendamento_horario
            ) HIST ON HIST.id_agendamento_horario = ah.id
      LEFT JOIN AGENDAMENTO_GLF_HISTORICO HIST_AGENDAMENTO ON HIST_AGENDAMENTO.id = HIST.ID_HISTORICO
      LEFT JOIN AGENDAMENTO_GLF_TIPO_EQUIPE ae ON AE.ID = HIST_AGENDAMENTO.id_agendamento_equipe
      LEFT JOIN AGENDAMENTO_GLF_SITUACAO [AS] ON [AS].status = HIST_AGENDAMENTO.status
      WHERE ac.status <> 'E'
      AND ah.status <> 'E'
      AND ah.id_agendamento_agenda = @id_agendamento_agenda
      and hist.ID_HISTORICO is not null`)

    for (const key in agenda) {
      if (Object.prototype.hasOwnProperty.call(agenda, key)) {
        var item = agenda[key];

        agenda[key].jogadores = ( await Database.rawQuery(`SELECT aj.id,
            ( CASE WHEN aj.id = 1
              THEN ac.nome
              ELSE aj.nome END ) AS nome
          FROM AGENDAMENTO_GLF_JOGADOR aj
          INNER JOIN AGENDAMENTO_GLF_HISTORICO ah ON ah.id_agendamento_jogador = aj.id
          LEFT JOIN AGENDAMENTO_GLF_CONVIDADO ac ON ac.id_agendamento_historico = ah.id
          WHERE ah.id_agendamento_historico = ${item.id_historico}`) )

        const formato = ( await Database.query()
          .select('AGENDAMENTO_GLF_TIPO_EQUIPE.id',
                  'AGENDAMENTO_GLF_TIPO_EQUIPE.descricao')
          .from('AGENDAMENTO_GLF_HISTORICO')
          .where('AGENDAMENTO_GLF_HISTORICO.id', item.id_historico)
          .andWhereNot('AGENDAMENTO_GLF_HISTORICO.status','E')
          .andWhereNot('AGENDAMENTO_GLF_TIPO_EQUIPE.status','E')
          .innerJoin('AGENDAMENTO_GLF_TIPO_EQUIPE', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_equipe', 'AGENDAMENTO_GLF_TIPO_EQUIPE.id')
          .limit(7) )

        if (formato[0] == null){
          formato[0] = []
        }

        agenda[key].formato = formato[0]
      }
    }

    return response.json(agenda)
  }

  public async buscarHorariosEquipe({ response, params }) {
    const diaParam = params.dia == 'hoje' ? 'GETDATE()' : 'GETDATE()+1';

    const agenda = await Database.rawQuery(`DECLARE @id_agendamento_agenda INT = ${params.id}
      SELECT ah.id_agendamento_agenda as id_agenda, ah.id as id_horario, ab.id as id_buraco
          , ISNULL(ae.id,0) as id_equipe
          , ISNULL(HIST.ID_HISTORICO,0) id_historico
          , ISNULL(HIST.QTDE_JOGADORES,0) qtde_jogadores
          , ISNULL(AE.limite_qtde,0) limite_equipe
          , ISNULL(HIST.DATA_RESERVA, ${diaParam}) data
          , ah.horario, ab.numero_buraco as tee_saida
          --, ISNULL(ae.descricao,'') equipe
          , CASE WHEN HIST.ID_HISTORICO IS NULL THEN 'L' ELSE HIST.status END status
          , ISNULL([AS].descricao,'Livre') situacao_agendamento
      FROM AGENDAMENTO_GLF_CONFIGURACAO ac
      INNER JOIN AGENDAMENTO_GLF_HORARIO ah ON ah.id_agendamento_agenda = ac.id
      INNER JOIN AGENDAMENTO_GLF_BURACO ab ON ac.id_agendamento_buraco = ab.id
      LEFT JOIN (SELECT AH1.id_agendamento_horario
            , MIN(ah1.ID) ID_HISTORICO
            , MIN(AH1.status) STATUS
            , MIN(AH1.data_reserva) DATA_RESERVA
            , COUNT(*) QTDE_JOGADORES
            FROM AGENDAMENTO_GLF_HISTORICO ah1
              LEFT JOIN AGENDAMENTO_GLF_TIPO_EQUIPE AEJ on AEJ.id = ah1.id_agendamento_equipe
            WHERE  ah1.id_agendamento_agenda = @id_agendamento_agenda
              AND CAST(ah1.data_reserva AS date) = CONVERT(DATE, ${diaParam})
              AND AH1.STATUS <> 'E'
              and AEJ.descricao = '${params.equipe}'
            GROUP BY AH1.id_agendamento_horario
            ) HIST ON HIST.id_agendamento_horario = ah.id
      LEFT JOIN AGENDAMENTO_GLF_HISTORICO HIST_AGENDAMENTO ON HIST_AGENDAMENTO.id = HIST.ID_HISTORICO
      LEFT JOIN AGENDAMENTO_GLF_TIPO_EQUIPE ae ON AE.ID = HIST_AGENDAMENTO.id_agendamento_equipe
      LEFT JOIN AGENDAMENTO_GLF_SITUACAO [AS] ON [AS].status = HIST_AGENDAMENTO.status
      WHERE ac.status <> 'E'
      AND ah.status <> 'E'
      AND ah.id_agendamento_agenda = @id_agendamento_agenda`)

    for (const key in agenda) {
      if (Object.prototype.hasOwnProperty.call(agenda, key)) {
        var item = agenda[key];

        agenda[key].jogadores = ( await Database.rawQuery(`SELECT aj.id,
            ( CASE WHEN aj.id = 1
              THEN ac.nome
              ELSE aj.nome END ) AS nome
          FROM AGENDAMENTO_GLF_JOGADOR aj
          INNER JOIN AGENDAMENTO_GLF_HISTORICO ah ON ah.id_agendamento_jogador = aj.id
          LEFT JOIN AGENDAMENTO_GLF_CONVIDADO ac ON ac.id_agendamento_historico = ah.id
          WHERE ah.id_agendamento_historico = ${item.id_historico}`) )

        const formato = ( await Database.query()
          .select('AGENDAMENTO_GLF_TIPO_EQUIPE.id',
                  'AGENDAMENTO_GLF_TIPO_EQUIPE.descricao')
          .from('AGENDAMENTO_GLF_HISTORICO')
          .where('AGENDAMENTO_GLF_HISTORICO.id', item.id_historico)
          .andWhereNot('AGENDAMENTO_GLF_HISTORICO.status','E')
          .andWhereNot('AGENDAMENTO_GLF_TIPO_EQUIPE.status','E')
          .innerJoin('AGENDAMENTO_GLF_TIPO_EQUIPE', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_equipe', 'AGENDAMENTO_GLF_TIPO_EQUIPE.id')
          .limit(7) )

        if (formato[0] == null){
          formato[0] = []
        }

        agenda[key].formato = formato[0]
      }
    }

    return response.json(agenda)
  }
}
