// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AgendamentoTipoEquipe from "App/Models/AgendamentoTipoEquipe";

export default class AgendamentoTipoEquipeController {
  public async buscar() {
    const equipes = await AgendamentoTipoEquipe.all();
    return equipes;
  }

  public async criar({ request }) {
    const data = request.only(['id_agendamento_situacao','limite_qtde','descricao','status']);
    const equipe = await AgendamentoTipoEquipe.create(data);
    return equipe;
  }

  public async atualizar({ request, params }) {
    const equipe = await AgendamentoTipoEquipe.findOrFail(params.id);
    equipe.merge(request.only(['id_agendamento_situacao','limite_qtde','descricao','status']));
    return await equipe.save();
  }
}
