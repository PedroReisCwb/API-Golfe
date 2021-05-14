// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AgendamentoHorario from "App/Models/AgendamentoHorario";

export default class AgendamentoHorarioController {
  public async buscar() {
    const horarios = await AgendamentoHorario.all();
    return horarios;
  }

  public async criar({ request }) {
    const data = request.only(['id_agendamento_agenda','id_agendamento_situacao','horario','status']);
    const horario = await AgendamentoHorario.create(data);
    return horario;
  }

  public async atualizar({ request, params }) {
    const horario = await AgendamentoHorario.findOrFail(params.id);
    horario.merge(request.only(['id_agendamento_agenda','id_agendamento_situacao','horario','status']));
    return await horario.save();
  }
}
