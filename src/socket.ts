import { Game } from './game';
import { Fase, type Coordenada, type Direcao } from './types';
import { Server } from 'socket.io';
import http from 'node:http';
import type { Memento } from './memento';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3001;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const game = new Game(10, 5);
let primeiroJogadorPosicionou: number | null = null;
let memento: Memento | null = null;

io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  // if (memento) {
  //   console.log("memento teste")
  //   socket.emit('estadoAtual', memento);
  // }
  

  socket.on('posicionarNavio', (data) => {
    const { playerId, inicio, comprimento, direcao } = data;
    const todosPosicionadosJogador = game.getTodosDoJogadorPosicionados(playerId);
    
    if (game.verificarTodosNaviosPosicionados()) {
      console.log("Verificar todos navios posicionados")
      socket.emit('navioPosicionado', { sucesso: false, mensagem: 'Todos os navios já foram posicionados.' });
      return;
    }

    // Cria um memento se a fase for Posicionamento
    if (game.getFase() === Fase.Posicionamento) {
      memento = game.criarMemento();
    }

    if (todosPosicionadosJogador) {
      socket.emit('navioPosicionado', { sucesso: false, mensagem: 'Todos os seus navios já foram posicionados.' });
      game.alternarTurno();
      io.emit('turnoAlterado', { turnoAtual: game.getTurnoAtual() });
      return;
    }

    if (primeiroJogadorPosicionou === null) {
      primeiroJogadorPosicionou = playerId;
    }

    console.log('Posicionar navio', playerId, inicio, comprimento, direcao);
    const resultado = game.posicionarNavio(playerId, inicio as Coordenada, comprimento, direcao as Direcao);
    console.log('Resultado');
    socket.emit('navioPosicionado', resultado);

    if (game.getFase() === Fase.Ataque) {
      if (primeiroJogadorPosicionou !== null) {
        game.setTurnoAtual(primeiroJogadorPosicionou);
      }
      io.emit('faseAlterada', { fase: game.getFase() });
      io.emit('turnoAlterado', { turnoAtual: game.getTurnoAtual() });
      
      memento = game.criarMemento();
    } else if (game.getFase() === Fase.Fim) {
      memento = null;
    }
  });

  socket.on('atacar', (data) => {
    const { playerId, coordenada } = data;
    console.log('Tentando atacar');
    console.log('playerId', playerId);
    console.log('vez de quem', game.getTurnoAtual());

    if (game.getTurnoAtual() !== playerId) {
      console.log("não é a sua vez de atacar...")
      socket.emit('erro', { mensagem: 'Não é o seu turno de atacar.' });
      return;
    }

    console.log('Atacar', playerId, coordenada);
    const resultado = game.ataque(playerId, coordenada as Coordenada);
    console.log('Resultado', resultado);
    socket.emit('ataqueResultado', resultado);

    const adversarioId = playerId === 1 ? 0 : 1;
    const tabuleiro = game.getGrade(adversarioId);

    const tabuleiroTransformado = {
      ...tabuleiro,
      posicionamento: tabuleiro.posicionamento.map((row) => row.map((cell) => (cell === 'N' ? '~' : cell))),
    };

    io.emit('ataqueRecebido', { tabuleiro: tabuleiroTransformado, playerId, sucesso: resultado.sucesso, coordenada: resultado.coordenada });

    if (!resultado.acerto) {
      game.alternarTurno();
      io.emit('turnoAlterado', { turnoAtual: game.getTurnoAtual() });
    }

    const pontuacao = game.getPontuacao();
    socket.emit('pontuacao', pontuacao);

    if (game.getFase() === Fase.Ataque) {
      memento = game.criarMemento();
    }

    if (game.getFase() === Fase.Fim) {
      game.reiniciar(10);
      memento = null;
      io.emit('fimDeJogo', { fase: game.getFase(), vencedor: playerId });
    }
  });

  socket.on('getTabuleiro', (playerId) => {
    try {
      const tabuleiro = game.getGrade(Number(playerId));
      socket.emit('tabuleiro', tabuleiro);
    } catch (error) {
      socket.emit('erro', { mensagem: 'Erro ao obter o tabuleiro' });
    }
  });

  socket.on('getFase', () => {
    const fase = game.getFase();
    socket.emit('fase', { fase });
  });

  socket.on('restaurarEstado', () => {
    if (memento) {
      game.restaurarMemento(memento);
      console.log('Estado do jogo restaurado a partir do memento');
      socket.emit('estadoRestaurado', { sucesso: true, estado: memento.getState() });
    } else {
      socket.emit('estadoRestaurado', { sucesso: false, mensagem: 'Nenhum estado salvo encontrado' });
    }
  });

  socket.on('solicitarEstado', () => {
    if (memento) {
      socket.emit('estadoAtual', { sucesso: true, estado: memento.getState() });
    } else {
      socket.emit('estadoAtual', { sucesso: false, mensagem: 'Nenhum estado salvo encontrado' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// server.on('restaurarEstado', () => {
//   console.log("Teste de restaurar memento")
//     if (memento) {
//       game.restaurarMemento(memento);
//       server.emit('estadoRestaurado', { sucesso: true });
//     } else {
//       server.emit('estadoRestaurado', { sucesso: false, mensagem: 'Nenhum estado salvo encontrado.' });
//     }
//   });

server.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
