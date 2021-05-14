// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AgendamentoJogador from "App/Models/AgendamentoJogador";

export default class AgendamentoJogadorController {
  public async buscar() {
    const jogadores = await AgendamentoJogador.all();
    return jogadores;
  }

  public async criar({ request }) {
    const data = request.only(['geracao','categoria','matricula','num_dep','nome','status','id_agendamento_situacao']);
    const jogador = await AgendamentoJogador.create(data);
    return jogador;
  }

  public async atualizar({ request, params }) {
    const jogador = await AgendamentoJogador.findOrFail(params.id);
    jogador.merge(request.only(['geracao','categoria','matricula','num_dep','nome','status','id_agendamento_situacao']));
    return await jogador.save();
  }
}
