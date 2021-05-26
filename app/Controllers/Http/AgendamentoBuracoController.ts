// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AgendamentoBuraco from "App/Models/AgendamentoBuraco";

export default class AgendamentoBuracoController {
  public async buscar() {
    const buracos = await AgendamentoBuraco.all();
    return buracos;
  }

  public async criar({ request }) {
    const data = request.only(['id_agendamento_situacao','numero_buraco','descricao','status']);
    const buraco = await AgendamentoBuraco.create(data);
    return buraco;
  }

  public async atualizar({ request, params }) {
    const buraco = await AgendamentoBuraco.findOrFail(params.id);
    buraco.merge(request.only(['id_agendamento_situacao','numero_buraco','descricao','status']));
    return await buraco.save();
  }
}
