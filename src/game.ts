import { TabuleiroPosicionamento } from './board-posicionamento';
import { TabuleiroAtaque } from './board-ataque';
import type { Coordenada, Direcao } from './types';
import { Fase } from './types';
import { Memento } from './memento';

// deixar parametro como 0 ou 1
// controlar a vez de quem jogar

interface TabuleirosJogador {
  dePosicionamento: TabuleiroPosicionamento;
  deAtaque: TabuleiroAtaque;
}

export class Game {
  private tabuleiros: TabuleirosJogador[];
  private fase: Fase;
  private naviosPosicionados: number[];
  private totalNavios: number;
  private turnoAtual: number;
  private comprimentosUsados: Set<number>[];

  constructor(tamanho: number, totalNavios: number) {
    this.tabuleiros = [
      {
        dePosicionamento: new TabuleiroPosicionamento(tamanho),
        deAtaque: new TabuleiroAtaque(tamanho),
      },
      {
        dePosicionamento: new TabuleiroPosicionamento(tamanho),
        deAtaque: new TabuleiroAtaque(tamanho),
      },
    ];
    this.fase = Fase.Posicionamento;
    this.naviosPosicionados = [0, 0];
    this.totalNavios = totalNavios;
    this.turnoAtual = 0;
    this.comprimentosUsados = [new Set(), new Set()];
  }

  public criarMemento(): Memento {
    const estado = {
      tabuleiros: this.tabuleiros,
      fase: this.fase,
      naviosPosicionados: this.naviosPosicionados,
      totalNavios: this.totalNavios,
      turnoAtual: this.turnoAtual,
      pontuacao: this.getPontuacao(),
    };
    return new Memento(estado);
  }

  public restaurarMemento(memento: Memento): void {
    const estado = memento.getState();
    console.log("Teste de restaurar memento", estado.tabuleiros)
    this.tabuleiros = estado.tabuleiros;
    this.fase = estado.fase;
    this.naviosPosicionados = estado.naviosPosicionados;
    this.totalNavios = estado.totalNavios;
    this.turnoAtual = estado.turnoAtual;
  }

  public getTurnoAtual(): number {
    return this.turnoAtual;
  }

  public setTurnoAtual(turno: number): void {
    this.turnoAtual = turno;
  }

  public alternarTurno(): void {
    this.turnoAtual = this.turnoAtual === 0 ? 1 : 0;
  }

  public getFase(): Fase {
    return this.fase;
  }

  public setFase(fase: Fase): void {
    this.fase = fase;
  }

  public getPontuacao(): { posicoesAtingidas: number; posicoesTotais: number }[] {
    return this.tabuleiros.map((tabuleiro, index) => {
      const adversarioIndex = index === 0 ? 1 : 0;
      return {
        posicoesAtingidas: this.tabuleiros[adversarioIndex].dePosicionamento.getPositionAtingidas(),
        posicoesTotais: tabuleiro.dePosicionamento.getPosicoesTotais(),
      };
    });
  }

  public getPosicoesAtingidasDosJogadores(): {
    player0: { playerId: number; posicoesAtingidasPeloInimigo: number };
    player1: { playerId: number; posicoesAtingidas: number };
  } {
    return {
      player0: { playerId: 0, posicoesAtingidasPeloInimigo: this.tabuleiros[0].dePosicionamento.getPositionAtingidas() },
      player1: { playerId: 1, posicoesAtingidas: this.tabuleiros[1].dePosicionamento.getPositionAtingidas() },
    };
  }

  public getPosicoesTotaisDosJogadores(): {
    player0: { playerId: number; posicoesTotais: number };
    player1: { playerId: number; posicoesTotais: number };
  } {
    return {
      player0: { playerId: 0, posicoesTotais: this.tabuleiros[0].dePosicionamento.getPosicoesTotais() },
      player1: { playerId: 1, posicoesTotais: this.tabuleiros[1].dePosicionamento.getPosicoesTotais() },
    };
  }

  public getGrade(jogador: number): {
    ataque: string[][];
    posicionamento: string[][];
  } {
    if (jogador !== 0 && jogador !== 1) {
      throw new Error('Jogador inválido. Deve ser 0 ou 1.');
    }

    return {
      posicionamento: this.tabuleiros[jogador].dePosicionamento.getGrade(),
      ataque: this.tabuleiros[jogador].deAtaque.getGrade(),
    };
  }

  public reiniciar(tamanho: number): void {
    this.tabuleiros = [
      {
        dePosicionamento: new TabuleiroPosicionamento(tamanho),
        deAtaque: new TabuleiroAtaque(tamanho),
      },
      {
        dePosicionamento: new TabuleiroPosicionamento(tamanho),
        deAtaque: new TabuleiroAtaque(tamanho),
      },
    ];
    this.fase = Fase.Posicionamento;
    this.naviosPosicionados = [0, 0];
    this.turnoAtual = 0;
    this.comprimentosUsados = [new Set(), new Set()];
  }

  public verificarTodosNaviosPosicionados(): boolean {
    for (let i = 0; i < this.naviosPosicionados.length; i++) {
      if (this.naviosPosicionados[i] < this.totalNavios) {
        return false;
      }
    }
    this.fase = Fase.Ataque;
    return true;
  }

  public getTodosDoJogadorPosicionados(jogadorId: number): boolean {
    if (jogadorId !== 0 && jogadorId !== 1) {
      throw new Error('Jogador inválido. Deve ser 0 ou 1.');
    }
    return this.naviosPosicionados[jogadorId] === this.totalNavios;
  }

  public posicionarNavio(
    jogador: number,
    inicio: Coordenada,
    comprimento: number,
    direcao: Direcao,
  ): {
    sucesso: boolean;
    mensagem?: string;
    coordenadas?: Coordenada[];
    tabuleiro?: {
      ataque: string[][];
      posicionamento: string[][];
    };
  } {
    if (this.fase !== Fase.Posicionamento) {
      this.fase = Fase.Ataque;
      return {
        sucesso: false,
        mensagem: 'Não estamos na fase de posicionamento.',
      };
    }

    if (this.naviosPosicionados[jogador] >= this.totalNavios) {
      this.fase = Fase.Ataque;
      return {
        sucesso: false,
        mensagem: 'Todos os seus navios já foram posicionados.',
      };
    }

    if (this.comprimentosUsados[jogador].has(comprimento)) {
      return {
        sucesso: false,
        mensagem: 'Você já posicionou um navio com este comprimento.',
      };
    }

    const resultado = this.tabuleiros[jogador].dePosicionamento.posicionarNavio(inicio, comprimento, direcao);

    if (jogador !== 0 && jogador !== 1) {
      return { sucesso: false, mensagem: 'Jogador inválido. Deve ser 0 ou 1.' };
    }

    if (resultado.sucesso) {
      this.naviosPosicionados[jogador]++;
      this.comprimentosUsados[jogador].add(comprimento);
      this.verificarTodosNaviosPosicionados();
    }

    return {
      sucesso: resultado.sucesso,
      mensagem: resultado.sucesso ? 'Navio posicionado com sucesso.' : 'Falha ao posicionar navio.',
      coordenadas: resultado.coordenadas,
      tabuleiro: this.getGrade(jogador),
    };
  }

  public ataque(
    jogador: number,
    coordenada: Coordenada,
  ): {
    sucesso: boolean;
    acerto?: boolean;
    mensagem?: string;
    coordenada?: Coordenada;
    tabuleiro?: { ataque: string[][]; posicionamento: string[][] };
  } {
    if (jogador !== 0 && jogador !== 1) {
      return { sucesso: false, mensagem: 'Jogador inválido. Deve ser 0 ou 1.' };
    }

    if (this.fase !== Fase.Ataque) {
      return { sucesso: false, mensagem: 'Não estamos na fase de ataque.' };
    }

    const oponente = jogador === 1 ? 0 : 1;
    const acerto = this.tabuleiros[oponente].dePosicionamento.receberAtaque(coordenada);
    if (acerto) {
      this.tabuleiros[jogador].deAtaque.marcarAcerto(coordenada);
    } else {
      this.tabuleiros[jogador].deAtaque.marcarErro(coordenada);
    }

    const naviosRestantes = this.tabuleiros[oponente].dePosicionamento.getNaviosRestantes();
    const acabou =
      this.tabuleiros[oponente].dePosicionamento.getPosicoesTotais() -
      this.tabuleiros[oponente].dePosicionamento.getPositionAtingidas();

    if (acabou === 0) {
      console.log('acabou');
      this.fase = Fase.Fim;
      return {
        sucesso: true,
        acerto,
        coordenada,
        mensagem: `Jogador ${jogador === 1 ? 1 : 0} venceu!`,
        tabuleiro: this.getGrade(jogador),
      };
    }

    return {
      sucesso: acerto,
      acerto,
      coordenada,
      mensagem: acerto ? 'Acertou!' : 'Errou!',
      tabuleiro: this.getGrade(jogador),
    };
  }

  public exibirTabuleiros(jogador: number): void {
    console.log(`Tabuleiro de Posicionamento do Jogador ${jogador + 1}:`);
    this.tabuleiros[jogador].dePosicionamento.exibir('Posicionamento');
    console.log(`Tabuleiro de Ataque do Jogador ${jogador + 1}:`);
    this.tabuleiros[jogador].deAtaque.exibir('Ataque');
  }
}
