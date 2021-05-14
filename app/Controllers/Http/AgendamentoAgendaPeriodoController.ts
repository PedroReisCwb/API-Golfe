// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AgendamentoAgendaPeriodo from "App/Models/AgendamentoAgendaPeriodo";

export default class AgendamentoAgendaPeriodoController {
  public async buscar() {
    const agendas = await AgendamentoAgendaPeriodo.all();
    return agendas;
  }

  public async criar({ request }) {
    const data = request.only(['id_agendamento_situacao','descricao','data_inicio','data_fim','data_hora_liberacao','status']);
    const agenda = await AgendamentoAgendaPeriodo.create(data);
    return agenda;
  }

  public async atualizar({ request, params }) {
    const agenda = await AgendamentoAgendaPeriodo.findOrFail(params.id);
    agenda.merge(request.only(['id_agendamento_situacao','descricao','data_inicio','data_fim','data_hora_liberacao','status']));
    return await agenda.save();
  }
}
