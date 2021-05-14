// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import AgendamentoHistorico from "App/Models/AgendamentoHistorico";

export default class AgendamentoHistoricoController {
  public async buscar() {
    const historicos = await AgendamentoHistorico.all();
    return historicos;
  }

  public async criar({ request }) {
    const data = request.only(['id_agendamento_historico','id_agendamento_agenda','id_agendamento_buraco','id_agendamento_equipe','id_agendamento_horario','id_agendamento_jogador','data_reserva', 'data_registro', 'data_acesso','status']);
    const historico = await AgendamentoHistorico.create(data);
    return historico;
  }

  public async atualizar({ request, params }) {
    const historico = await AgendamentoHistorico.findOrFail(params.id);
    historico.merge(request.only(['id_agendamento_historico','id_agendamento_agenda','id_agendamento_buraco','id_agendamento_equipe','id_agendamento_horario','id_agendamento_jogador','data_reserva', 'data_registro', 'data_acesso','status']));
    return await historico.save();
  }

  public async proximoJogo({ response, params }) {
    const proximo = await Database.rawQuery(`SELECT TOP 1 ahis.data_reserva, ah.horario, ae.descricao, ab.numero_buraco FROM AGENDAMENTO_GLF_HISTORICO ahis
      INNER JOIN AGENDAMENTO_GLF_HORARIO ah ON ahis.id_agendamento_horario = ah.id
      INNER JOIN AGENDAMENTO_GLF_TIPO_EQUIPE ae ON ahis.id_agendamento_equipe = ae.id
      INNER JOIN AGENDAMENTO_GLF_BURACO ab ON ahis.id_agendamento_buraco = ab.id
      WHERE ahis.id_agendamento_jogador=${params.id}
      AND CAST(ah.horario AS time) > CAST(GETDATE() AS time)
      AND CAST(ahis.data_reserva AS date) >= CAST(GETDATE() AS date)
      AND ahis.status <> 'E'
      AND ab.status <> 'E'
      AND ae.status <> 'E'
      AND ah.status <> 'E'
      ORDER BY ahis.data_reserva desc, ah.horario asc`)

    return response.json(proximo)
  }

  public async buscarHistorico({ response, params }) {

    const jogadores = ( await Database.rawQuery(`SELECT aj.id,
        ( CASE WHEN aj.id = 1
          THEN ac.nome
          ELSE aj.nome END ) AS nome
      FROM AGENDAMENTO_GLF_JOGADOR aj
      INNER JOIN AGENDAMENTO_GLF_HISTORICO ah ON ah.id_agendamento_jogador = aj.id
      LEFT JOIN AGENDAMENTO_GLF_CONVIDADO ac ON ac.id_agendamento_historico = ah.id
      WHERE ah.id_agendamento_historico = ${params.id}`) )

    const historico = ( await Database.query()
      .select('AGENDAMENTO_GLF_HISTORICO.id',
              'AGENDAMENTO_GLF_HISTORICO.data_reserva as data',
              'AGENDAMENTO_GLF_HORARIO.horario',
              'AGENDAMENTO_GLF_BURACO.numero_buraco as tee_saida')
      .from('AGENDAMENTO_GLF_HISTORICO')
      .where('AGENDAMENTO_GLF_HISTORICO.id', params.id)
      .andWhereNot('AGENDAMENTO_GLF_HISTORICO.status','E')
      .andWhereNot('AGENDAMENTO_GLF_HORARIO.status','E')
      .andWhereNot('AGENDAMENTO_GLF_BURACO.status','E')
      .andWhereNot('AGENDAMENTO_GLF_AGENDA_PERIODO.status','E')
      .innerJoin('AGENDAMENTO_GLF_AGENDA_PERIODO', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_agenda', 'AGENDAMENTO_GLF_AGENDA_PERIODO.id')
      .innerJoin('AGENDAMENTO_GLF_HORARIO', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_horario', 'AGENDAMENTO_GLF_HORARIO.id')
      .innerJoin('AGENDAMENTO_GLF_BURACO', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_buraco', 'AGENDAMENTO_GLF_BURACO.id')
      .limit(7) )


    const formato = ( await Database.query()
      .select('AGENDAMENTO_GLF_TIPO_EQUIPE.id',
              'AGENDAMENTO_GLF_TIPO_EQUIPE.descricao')
      .from('AGENDAMENTO_GLF_HISTORICO')
      .where('AGENDAMENTO_GLF_HISTORICO.id', params.id)
      .andWhereNot('AGENDAMENTO_GLF_HISTORICO.status','E')
      .andWhereNot('AGENDAMENTO_GLF_TIPO_EQUIPE.status','E')
      .innerJoin('AGENDAMENTO_GLF_TIPO_EQUIPE', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_equipe', 'AGENDAMENTO_GLF_TIPO_EQUIPE.id')
      .limit(7) )

    historico[0].jogadores = jogadores
    historico[0].formato = formato[0]

    return response.json(historico[0])
  }

  public async buscarHistoricoJogador({ response, params }) {
    const historico = ( await Database.query()
      .select('AGENDAMENTO_GLF_HISTORICO.id',
              'AGENDAMENTO_GLF_HISTORICO.data_reserva as data',
              'AGENDAMENTO_GLF_HORARIO.horario',
              'AGENDAMENTO_GLF_BURACO.numero_buraco as tee_saida')
      .from('AGENDAMENTO_GLF_HISTORICO')
      .where('AGENDAMENTO_GLF_HISTORICO.id_agendamento_jogador', params.id)
      .andWhereNot('AGENDAMENTO_GLF_HISTORICO.status','E')
      .andWhereNot('AGENDAMENTO_GLF_HORARIO.status','E')
      .andWhereNot('AGENDAMENTO_GLF_BURACO.status','E')
      .andWhereNot('AGENDAMENTO_GLF_AGENDA_PERIODO.status','E')
      .innerJoin('AGENDAMENTO_GLF_AGENDA_PERIODO', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_agenda', 'AGENDAMENTO_GLF_AGENDA_PERIODO.id')
      .innerJoin('AGENDAMENTO_GLF_HORARIO', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_horario', 'AGENDAMENTO_GLF_HORARIO.id')
      .innerJoin('AGENDAMENTO_GLF_BURACO', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_buraco', 'AGENDAMENTO_GLF_BURACO.id')
      .limit(7) )

    for (const key in historico) {
      if (Object.prototype.hasOwnProperty.call(historico, key)) {
        var item = historico[key];

        historico[key].jogadores = ( await Database.rawQuery(`SELECT aj.id,
            ( CASE WHEN aj.id = 1
              THEN ac.nome
              ELSE aj.nome END ) AS nome
          FROM AGENDAMENTO_GLF_JOGADOR aj
          INNER JOIN AGENDAMENTO_GLF_HISTORICO ah ON ah.id_agendamento_jogador = aj.id
          LEFT JOIN AGENDAMENTO_GLF_CONVIDADO ac ON ac.id_agendamento_historico = ah.id
          WHERE ah.id_agendamento_historico = ${item.id}`) )
      }

      const formato = ( await Database.query()
        .select('AGENDAMENTO_GLF_TIPO_EQUIPE.id',
                'AGENDAMENTO_GLF_TIPO_EQUIPE.descricao')
        .from('AGENDAMENTO_GLF_HISTORICO')
        .where('AGENDAMENTO_GLF_HISTORICO.id_agendamento_historico', item.id)
        .where('AGENDAMENTO_GLF_HISTORICO.id_agendamento_jogador', params.id)
        .andWhereNot('AGENDAMENTO_GLF_HISTORICO.status','E')
        .andWhereNot('AGENDAMENTO_GLF_TIPO_EQUIPE.status','E')
        .innerJoin('AGENDAMENTO_GLF_TIPO_EQUIPE', 'AGENDAMENTO_GLF_HISTORICO.id_agendamento_equipe', 'AGENDAMENTO_GLF_TIPO_EQUIPE.id')
        .limit(7) )

      historico[key].formato = formato[0]
    }

    return response.json(historico)
  }

  public async gravar({ request, response, params }) {
    const dia = params.dia
    const data = dia == 'hoje' ? 'GETDATE()' : 'GETDATE()+1';
    const jogadores = request.toJSON().body.jogadores;
    const participantes: string[] = [];

    // Valida se a reserva esta disponível
    const validaReserva = await Database.rawQuery(`IF EXISTS (	SELECT 1 FROM AGENDAMENTO_GLF_HISTORICO
      WHERE id_agendamento_agenda = ${request.toJSON().body.id_agenda}
      AND id_agendamento_buraco = ${request.toJSON().body.id_buraco}
      AND id_agendamento_equipe = ${request.toJSON().body.id_equipe}
      AND id_agendamento_horario = ${request.toJSON().body.id_horario}
      AND CAST(data_reserva AS DATE) = CAST(${data} AS DATE)
      AND status <> 'E' )
      BEGIN
        SELECT 1 AS EXISTE
      END
      ELSE
      BEGIN
        SELECT 0 AS EXISTE
      END` )

    // Se a reserva não estiver disponível, retorna mensagem de erro
    if (validaReserva[0].EXISTE == 1) {
      return response.json({
        erro: 'Reserva não disponível'
      })
    }

    // Valida se jogadores estão disponíveis
    for (const key in jogadores) {
      if (Object.prototype.hasOwnProperty.call(jogadores, key)) {
        const jogador = jogadores[key];
        const validaJogador  = ( await Database.rawQuery(`IF EXISTS (	SELECT 1 FROM AGENDAMENTO_GLF_HISTORICO
          WHERE id_agendamento_agenda = ${request.toJSON().body.id_agenda}
          AND id_agendamento_buraco = ${request.toJSON().body.id_buraco}
          AND id_agendamento_equipe = ${request.toJSON().body.id_equipe}
          AND id_agendamento_jogador = ${jogador.id}
          AND CAST(data_reserva AS DATE) = CAST(${data} AS DATE)
          AND status <> 'E' )
          BEGIN
            SELECT 1 AS EXISTE
          END
          ELSE
          BEGIN
            SELECT 0 AS EXISTE
          END`) )

        if (validaJogador[0].EXISTE == 1) {
          participantes.push(jogador);
        }
      }
    }

    // Se algum jogador não estiver disponível, retorna mensagem de erro com a lista de jogadores que já estão em outra reserva
    if (participantes.length > 0) {
      return response.json({
        erro: 'Jogadores não disponíveis',
        jogadores: participantes
      })
    }

    // Realiza inserts da reserva caso não haja restrições
    for (const key in jogadores) {
      if (Object.prototype.hasOwnProperty.call(jogadores, key)) {
        const jogador = jogadores[key];
        const id_agenda = request.toJSON().body.id_agenda
        const id_buraco = request.toJSON().body.id_buraco
        const id_equipe = request.toJSON().body.id_equipe
        const id_horario = request.toJSON().body.id_horario
        if (key == '0') {
          var reservaLider  = ( await Database.rawQuery(`DECLARE @id_historico INT
            INSERT INTO dbo.AGENDAMENTO_GLF_HISTORICO
            (id_agendamento_historico, id_agendamento_agenda, id_agendamento_buraco, id_agendamento_equipe, id_agendamento_horario, id_agendamento_jogador, data_reserva, data_registro, data_acesso, status, dt_status)
            VALUES(0, ${id_agenda}, ${id_buraco}, ${id_equipe}, ${id_horario}, ${jogador.id}, ${data}, GETDATE(), NULL, 'A', GETDATE())
            SET @id_historico = SCOPE_IDENTITY()
            UPDATE AGENDAMENTO_GLF_HISTORICO SET id_agendamento_historico = @id_historico WHERE id = @id_historico
            SELECT @id_historico AS id_historico `) )
        }else{
          var reservaParticipante  = ( await Database.rawQuery(`DECLARE @id_historico INT
            INSERT INTO dbo.AGENDAMENTO_GLF_HISTORICO
            (id_agendamento_historico, id_agendamento_agenda, id_agendamento_buraco, id_agendamento_equipe, id_agendamento_horario, id_agendamento_jogador, data_reserva, data_registro, data_acesso, status, dt_status)
            VALUES(${reservaLider[0].id_historico}, ${id_agenda}, ${id_buraco}, ${id_equipe}, ${id_horario}, ${jogador.id}, ${data}, GETDATE(), NULL, 'A', GETDATE())
            SET @id_historico = SCOPE_IDENTITY()
            SELECT @id_historico AS id_historico `) )

          if (jogador.id == '1') {
            var reservaConvidado = ( await Database.rawQuery(`INSERT INTO dbo.AGENDAMENTO_GLF_CONVIDADO
              (id_agendamento_historico, nome, status, dt_status)
              VALUES(${reservaParticipante[0].id_historico}, '${jogador.nome}', 'A', GETDATE()) `) )
          }
        }
      }
    }
    console.log('teste')
    // Retorno de sucesso
    return response.json({
      mensagem: 'Reserva realizada com sucesso'
    })
  }
}
