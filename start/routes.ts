import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

Route.group(() => {
  Route.group(() => {

    // HISTÓRICO
    Route.group(() => {
      // Rota para buscar dados do próximo jogo do Jogador pelo ID
      Route.get('proximo/:id', async ({ response, params }) => {
        const proximo = await Database.rawQuery(`SELECT TOP 1 ahis.data_reserva, ah.horario, ae.descricao, ab.numero_buraco FROM AGENDAMENTO_HISTORICO ahis
          INNER JOIN AGENDAMENTO_HORARIO ah ON ahis.id_agendamento_horario = ah.id
          INNER JOIN AGENDAMENTO_EQUIPE ae ON ahis.id_agendamento_equipe = ae.id
          INNER JOIN AGENDAMENTO_BURACO ab ON ahis.id_agendamento_buraco = ab.id
          WHERE ahis.id_agendamento_jogador=${params.id}
          AND CAST(ah.horario AS time) > CAST(GETDATE() AS time)
          AND CAST(ahis.data_reserva AS date) >= CAST(GETDATE() AS date)
          AND ahis.status <> 'E'
          AND ab.status <> 'E'
          AND ae.status <> 'E'
          AND ah.status <> 'E'
          ORDER BY ahis.data_reserva desc, ah.horario asc`)

        return response.json({
          status: true,
          data: proximo
        })
      })

      // Rota para buscar dados de uma reserva pelo ID do Historico de reserva
      Route.get(':id', async ({ response, params }) => {
        const jogadores = (await Database.query()
          .select('AGENDAMENTO_JOGADOR.id', 'AGENDAMENTO_JOGADOR.nome')
          .from('AGENDAMENTO_JOGADOR')
          .where('AGENDAMENTO_HISTORICO.id_agendamento_historico', params.id)
          .innerJoin('AGENDAMENTO_HISTORICO', 'AGENDAMENTO_HISTORICO.id_agendamento_jogador', 'AGENDAMENTO_JOGADOR.id'))

        const historico = (await Database.query()
          .select('AGENDAMENTO_HISTORICO.id',
                  'AGENDAMENTO_HISTORICO.data_reserva as data',
                  'AGENDAMENTO_HORARIO.horario',
                  'AGENDAMENTO_BURACO.numero_buraco as tee_saida')
          .from('AGENDAMENTO_HISTORICO')
          .where('AGENDAMENTO_HISTORICO.id', params.id)
          .andWhereNot('AGENDAMENTO_HISTORICO.status','E')
          .andWhereNot('AGENDAMENTO_HORARIO.status','E')
          .andWhereNot('AGENDAMENTO_BURACO.status','E')
          .andWhereNot('AGENDAMENTO_AGENDA_PERIODO.status','E')
          .innerJoin('AGENDAMENTO_AGENDA_PERIODO', 'AGENDAMENTO_HISTORICO.id_agendamento_agenda', 'AGENDAMENTO_AGENDA_PERIODO.id')
          .innerJoin('AGENDAMENTO_HORARIO', 'AGENDAMENTO_HISTORICO.id_agendamento_horario', 'AGENDAMENTO_HORARIO.id')
          .innerJoin('AGENDAMENTO_BURACO', 'AGENDAMENTO_HISTORICO.id_agendamento_buraco', 'AGENDAMENTO_BURACO.id')
          .limit(7))

        historico[0].jogadores = jogadores

        return response.json({
          status: true,
          data: historico[0]
        })
      })

      // Rota para buscar dados de uma reserva pelo ID do Jodador
      Route.get('jogador/:id', async ({ response, params }) => {
        const historico = (await Database.query()
          .select('AGENDAMENTO_HISTORICO.id',
                  'AGENDAMENTO_HISTORICO.data_reserva as data',
                  'AGENDAMENTO_HORARIO.horario',
                  'AGENDAMENTO_BURACO.numero_buraco as tee_saida')
          .from('AGENDAMENTO_HISTORICO')
          .where('AGENDAMENTO_HISTORICO.id_agendamento_jogador', params.id)
          .andWhereNot('AGENDAMENTO_HISTORICO.status','E')
          .andWhereNot('AGENDAMENTO_HORARIO.status','E')
          .andWhereNot('AGENDAMENTO_BURACO.status','E')
          .andWhereNot('AGENDAMENTO_AGENDA_PERIODO.status','E')
          .innerJoin('AGENDAMENTO_AGENDA_PERIODO', 'AGENDAMENTO_HISTORICO.id_agendamento_agenda', 'AGENDAMENTO_AGENDA_PERIODO.id')
          .innerJoin('AGENDAMENTO_HORARIO', 'AGENDAMENTO_HISTORICO.id_agendamento_horario', 'AGENDAMENTO_HORARIO.id')
          .innerJoin('AGENDAMENTO_BURACO', 'AGENDAMENTO_HISTORICO.id_agendamento_buraco', 'AGENDAMENTO_BURACO.id')
          .limit(7))

        for (const key in historico) {
          if (Object.prototype.hasOwnProperty.call(historico, key)) {
            const item = historico[key];

            historico[key].jogadores  = (await Database.query()
              .select('AGENDAMENTO_JOGADOR.id', 'AGENDAMENTO_JOGADOR.nome')
              .from('AGENDAMENTO_JOGADOR')
              .where('AGENDAMENTO_HISTORICO.id_agendamento_historico', item.id)
              .innerJoin('AGENDAMENTO_HISTORICO', 'AGENDAMENTO_HISTORICO.id_agendamento_jogador', 'AGENDAMENTO_JOGADOR.id'))
            }
        }

        return response.json({
          status: true,
          data: historico
        })
      })

      // Rota para gravar reserva do Jogador (Hoje / Amanhã)
      Route.post('gravar/:dia', async ({request, response, params}) => {

        const gravar = await Database.rawQuery(``)

        return response.json({
          status: true,
          data: request.toJSON().body.ids_jogadores,
          dia: params.dia
        })
      })
    }).prefix('/historico')

    // CONFIGURAÇÃO
    Route.group(() => {

      // Rota para buscar todos os horários a partir da hora atual

      Route.get(':id', async ({response , params}) => {

        const agenda = await Database.rawQuery(`DECLARE @id_agendamento_agenda INT = ${params.id}
          SELECT AH.ID,ah.horario, ab.numero_buraco, ISNULL(ae.descricao,'') equipe
              , CASE WHEN HIST.ID_HISTORICO IS NULL THEN 'L' ELSE HIST.status END situacao
              , ISNULL([AS].descricao,'Livre') situacao_agendamento
              , ISNULL(HIST.QTDE_JOGADORES,0) qtde_jogadores
              , ISNULL(AE.limite_qtde,0) limite_equipe
          FROM AGENDAMENTO_CONFIGURACAO ac
          INNER JOIN AGENDAMENTO_HORARIO ah ON ah.id_agendamento_agenda = ac.id
          INNER JOIN AGENDAMENTO_BURACO ab ON ac.id_agendamento_buraco = ab.id
          LEFT JOIN (SELECT AH1.id_agendamento_horario
                , MIN(ah1.ID) ID_HISTORICO
                , MIN(AH1.status) STATUS
                , COUNT(*) QTDE_JOGADORES
                FROM AGENDAMENTO_HISTORICO ah1
                  LEFT JOIN AGENDAMENTO_HISTORICO AHJ ON AHJ.id_agendamento_historico = AH1.id
                WHERE  ah1.id_agendamento_agenda = @id_agendamento_agenda
                  AND CAST(ah1.data_reserva AS date) = CONVERT(DATE, GETDATE())
                  AND AH1.STATUS <> 'E'
                GROUP BY AH1.id_agendamento_horario
                ) HIST ON HIST.id_agendamento_horario = ah.id
          LEFT JOIN AGENDAMENTO_HISTORICO HIST_AGENDAMENTO ON HIST_AGENDAMENTO.id = HIST.ID_HISTORICO
          LEFT JOIN AGENDAMENTO_EQUIPE ae ON AE.ID = HIST_AGENDAMENTO.id_agendamento_equipe
          LEFT JOIN AGENDAMENTO_SITUACAO [AS] ON [AS].status = HIST_AGENDAMENTO.status
          WHERE ac.status <> 'E'
          AND ah.status <> 'E'
          AND ah.id_agendamento_agenda = @id_agendamento_agenda
          and hist.ID_HISTORICO is not null`)

        return response.json({
          status: true,
          data: agenda
        })
      })

      // Rota para buscar todos os horários por equipe (Hoje / Amanhã)
      Route.get(':equipe/:dia/:id', async ({response , params}) => {

        const diaParam = params.dia == 'hoje' ? 'GETDATE()' : 'GETDATE()+1';

        const agenda = await Database.rawQuery(`DECLARE @id_agendamento_agenda INT = ${params.id}
          SELECT AH.ID,ah.horario, ab.numero_buraco, ISNULL(ae.descricao,'') equipe
              , CASE WHEN HIST.ID_HISTORICO IS NULL THEN 'L' ELSE HIST.status END situacao
              , ISNULL([AS].descricao,'Livre') situacao_agendamento
              , ISNULL(HIST.QTDE_JOGADORES,0) qtde_jogadores
              , ISNULL(AE.limite_qtde,0) limite_equipe
          FROM AGENDAMENTO_CONFIGURACAO ac
          INNER JOIN AGENDAMENTO_HORARIO ah ON ah.id_agendamento_agenda = ac.id
          INNER JOIN AGENDAMENTO_BURACO ab ON ac.id_agendamento_buraco = ab.id
          LEFT JOIN (SELECT AH1.id_agendamento_horario
                , MIN(ah1.ID) ID_HISTORICO
                , MIN(AH1.status) STATUS
                , COUNT(*) QTDE_JOGADORES
                FROM AGENDAMENTO_HISTORICO ah1
                  LEFT JOIN AGENDAMENTO_HISTORICO AHJ ON AHJ.id_agendamento_historico = AH1.id
                  LEFT JOIN AGENDAMENTO_EQUIPE AEJ on AEJ.id = ah1.id_agendamento_equipe
                WHERE  ah1.id_agendamento_agenda = @id_agendamento_agenda
                  AND CAST(ah1.data_reserva AS date) = CONVERT(DATE, ${diaParam})
                  AND AH1.STATUS <> 'E'
                  and AEJ.descricao = '${params.equipe}'
                GROUP BY AH1.id_agendamento_horario
                ) HIST ON HIST.id_agendamento_horario = ah.id
          LEFT JOIN AGENDAMENTO_HISTORICO HIST_AGENDAMENTO ON HIST_AGENDAMENTO.id = HIST.ID_HISTORICO
          LEFT JOIN AGENDAMENTO_EQUIPE ae ON AE.ID = HIST_AGENDAMENTO.id_agendamento_equipe
          LEFT JOIN AGENDAMENTO_SITUACAO [AS] ON [AS].status = HIST_AGENDAMENTO.status
          WHERE ac.status <> 'E'
          AND ah.status <> 'E'
          AND ah.id_agendamento_agenda = @id_agendamento_agenda`)

        return response.json({
          status: true,
          data: agenda
        })
      })
    }).prefix('/configuracao')

  }).prefix('/golfe')

 }).prefix('/agendamentos')


