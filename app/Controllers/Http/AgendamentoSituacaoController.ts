// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AgendamentoSituacao from "App/Models/AgendamentoSituacao";

export default class AgendamentoSituacaoController {
  public async buscar() {
    const situacoes = await AgendamentoSituacao.all();
    return situacoes;
  }

  public async criar({ request }) {
    const data = request.only(['descricao','status']);
    const situacao = await AgendamentoSituacao.create(data);
    return situacao;
  }

  public async atualizar({ request, params }) {
    const situacao = await AgendamentoSituacao.findOrFail(params.id);
    situacao.merge(request.only(['descricao','status','dt_status']));
    return await situacao.save();
  }
}
