import Route from '@ioc:Adonis/Core/Route'
import Redis from '@ioc:Adonis/Addons/Redis'

Route.get('/', async () => {
  return '<BR><BR><BR><CENTER><FONT COLOR="GREEN"><H1>CLUBE CURITIBANO <BR><BR> API AGENDMENTO GOLFE</FONT></H1></CENTER>'
})

// Rota para recuperar todos os usuarios logados
Route.get('/agendamentos/golfe/redis/getall', async () => {
  const lockTimeList: Array<string> = []

  await Redis.keys('GLF-LT-*', function( error, keys ){
      if( error ){
          return console.log( error );
      }

      keys.forEach( function( key ){
          Redis.get(key, function( err, value: string ){
              if( err ){
                  return console.log( err );
              }

              lockTimeList.push( JSON.parse( value ))
          });
      });
  });

  return lockTimeList
})

// Rota para limpar cache de usuarios
Route.get('/agendamentos/golfe/redis/clear/all', async () => {
  await Redis.keys('GLF-LT-*', function( error, keys ){
    if( error ){
      return console.log( error );
    }

    keys.forEach( function( key ){
      Redis.del( key )
    });
  });

  return 'Finish!'
})

Route.group(() => {
  Route.group(() => {

    // USUARIO
    Route.group(() => {
      // Rota para validar token do usuario
      Route.get(':token','AgendamentoUsuariosController.login')
    }).prefix('/usuario')

    // AGENDA PERÍODO
    Route.group(() => {
      // Rota para buscar todas as agendas
      Route.get('/','AgendamentoAgendaPeriodoController.buscar')
      // Rota para criar uma agenda
      Route.post('/','AgendamentoAgendaPeriodoController.criar')
      // Rota para atualizar uma agenda
      Route.put(':id','AgendamentoAgendaPeriodoController.atualizar')
    }).prefix('/agenda')

    // RESTRIÇÃO
    Route.group(() => {
      // Rota para buscar todas as restrições
      Route.get('/','AgendamentoRestricaoController.buscar')
      // Rota para criar uma restrição
      Route.post('/','AgendamentoRestricaoController.criar')
      // Rota para atualizar uma restrição
      Route.put(':id','AgendamentoRestricaoController.atualizar')
    }).prefix('/restricao')

    // CONVIDADO
    Route.group(() => {
      // Rota para buscar todos os convidados
      Route.get('/','AgendamentoConvidadoController.buscar')
      // Rota para criar um convidado
      Route.post('/','AgendamentoConvidadoController.criar')
      // Rota para atualizar um convidado
      Route.put(':id','AgendamentoConvidadoController.atualizar')
    }).prefix('/convidado')

    // BURACO
    Route.group(() => {
      // Rota para buscar todos os buracos
      Route.get('/','AgendamentoBuracoController.buscar')
      // Rota para criar um buraco
      Route.post('/','AgendamentoBuracoController.criar')
      // Rota para atualizar um buraco
      Route.put(':id','AgendamentoBuracoController.atualizar')
    }).prefix('/buraco')

    // HORÁRIO
    Route.group(() => {
      // Rota para buscar todos os horários
      Route.get('/','AgendamentoHorarioController.buscar')
      // Rota para criar um horário
      Route.post('/','AgendamentoHorarioController.criar')
      // Rota para atualizar um horário
      Route.put(':id','AgendamentoHorarioController.atualizar')
    }).prefix('/horario')

    // EQUIPE
    Route.group(() => {
      // Rota para buscar todas as equipes
      Route.get('/','AgendamentoTipoEquipeController.buscar')
      // Rota para criar uma equipe
      Route.post('/','AgendamentoTipoEquipeController.criar')
      // Rota para atualizar uma equipe
      Route.put(':id','AgendamentoTipoEquipeController.atualizar')
    }).prefix('/equipe')

    // JOGADOR
    Route.group(() => {
      // Rota para buscar todos os jogadores
      Route.get('/','AgendamentoJogadorController.buscar')
      // Rota para criar um jogador
      Route.post('/','AgendamentoJogadorController.criar')
      // Rota para atualizar um jogador
      Route.put(':id','AgendamentoJogadorController.atualizar')
    }).prefix('/jogador')

    // SITUACAO
    Route.group(() => {
      // Rota para buscar todas as situações
      Route.get('/','AgendamentoSituacaoController.buscar')
      // Rota para criar uma situação
      Route.post('/','AgendamentoSituacaoController.criar')
      // Rota para atualizar uma situação
      Route.put(':id','AgendamentoSituacaoController.atualizar')
    }).prefix('/situacao')

    // HISTÓRICO
    Route.group(() =>{
      // Rota para buscar todos os históricos
      Route.get('/','AgendamentoHistoricoController.buscar')
      // Rota para criar um histórico
      Route.post('/','AgendamentoHistoricoController.criar')
      // Rota para atualizar um histórico
      Route.put(':id','AgendamentoHistoricoController.atualizar')
      // Rota para buscar dados do próximo jogo do Jogador pelo ID
      Route.get('/proximo/:id','AgendamentoHistoricoController.proximoJogo')
      // Rota para buscar dados de uma reserva pelo ID do Historico de reserva
      Route.get(':id','AgendamentoHistoricoController.buscarHistorico')
      // Rota para buscar dados de uma reserva pelo ID do Jodador
      Route.get('/jogador/:id','AgendamentoHistoricoController.buscarHistoricoJogador')
      // Rota para gravar reserva do Jogador (Hoje / Amanhã)
      Route.post('/gravar/:dia','AgendamentoHistoricoController.gravar')
    }).prefix('/historico')

    // CONFIGURAÇÃO
    Route.group(() =>{
      // Rota para buscar todas as configurações
      Route.get('/','AgendamentoConfiguracaoController.buscar')
      // Rota para criar uma configuração
      Route.post('/','AgendamentoConfiguracaoController.criar')
      // Rota para atualizar uma configuração
      Route.put(':id','AgendamentoConfiguracaoController.atualizar')
      // Rota para buscar todos os horários a partir da hora atual
      Route.get(':id','AgendamentoConfiguracaoController.buscarHorarios')
      // Rota para buscar todos os horários por equipe (Hoje / Amanhã)
      Route.get(':equipe/:dia/:id','AgendamentoConfiguracaoController.buscarHorariosEquipe')
    }).prefix('/configuracao')

  }).prefix('/golfe')

 }).prefix('/agendamentos')


