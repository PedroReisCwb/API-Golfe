// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AgendamentoRestricao from "App/Models/AgendamentoRestricao";

export default class AgendamentoRestricaoController {
  public async buscar() {
    const restricoes = await AgendamentoRestricao.all();
    return restricoes;
  }

  public async criar({ request }) {
    const data = request.only(['id_agendamento_agenda','id_agendamento_situacao','data_inicio','data_fim','msg_resumida','msg_detalhada','bloquear','status']);
    const restricao = await AgendamentoRestricao.create(data);
    return restricao;
  }

  public async atualizar({ request, params }) {
    const restricao = await AgendamentoRestricao.findOrFail(params.id);
    restricao.merge(request.only(['id_agendamento_agenda','id_agendamento_situacao','data_inicio','data_fim','msg_resumida','msg_detalhada','bloquear','status']));
    return await restricao.save();
  }
}
