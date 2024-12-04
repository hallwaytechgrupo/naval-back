import { Board } from './board';
import { type Coordenada, Direcao } from './types';

export class TabuleiroPosicionamento extends Board {
  private navios: Coordenada[][];
  private conjuntoNavios: Set<string>;
  private naviosRestantes: number;
  private posicoesTotais: number;
  private posicoesAtingidas: number;

  constructor(tamanho: number) {
    super(tamanho);
    this.navios = [];
    this.conjuntoNavios = new Set();
    this.naviosRestantes = 0;
    this.posicoesTotais = 0;
    this.posicoesAtingidas = 0;
  }

  public getNaviosRestantes(): number {
    return this.naviosRestantes;
  }

  public getPosicoesTotais(): number {
    return this.posicoesTotais;
  }

  public getPositionAtingidas(): number {
    return this.posicoesAtingidas;
  }

  public getConjuntoNavios(): Set<string> {
    return this.conjuntoNavios;
  }

  private obterCoordenadas(inicio: Coordenada, comprimento: number, direcao: Direcao): Coordenada[] {
    const coordenadas: Coordenada[] = [];
    if (direcao === Direcao.Horizontal) {
      for (let x = inicio.x; x < inicio.x + comprimento; x++) {
        coordenadas.push({ x, y: inicio.y });
      }
    } else if (direcao === Direcao.Vertical) {
      for (let y = inicio.y; y < inicio.y + comprimento; y++) {
        coordenadas.push({ x: inicio.x, y });
      }
    }
    return coordenadas;
  }

  public posicionarNavio(
    inicio: Coordenada,
    comprimento: number,
    direcao: Direcao,
  ): { sucesso: boolean; coordenadas?: Coordenada[] } {
    const coordenadas = this.obterCoordenadas(inicio, comprimento, direcao);

    for (const coord of coordenadas) {
      const coordStr = `${coord.x},${coord.y}`;
      if (
        !this.coordenadaValida(coord)
          ||
        this.conjuntoNavios.has(coordStr)
      ) {
        return { sucesso: false, coordenadas };
      }
    }

    for (const coord of coordenadas) {
      this.grade[coord.y][coord.x] = 'N';
      this.conjuntoNavios.add(`${coord.x},${coord.y}`);
      this.posicoesTotais += 1;
    }

    this.navios.push(coordenadas);
    this.naviosRestantes += 1;

    console.log(`Navio posicionado nas coordenadas: ${JSON.stringify(coordenadas)}`);
    console.log('Navios posicionados', this.conjuntoNavios);

    return { sucesso: true, coordenadas };
  }

  private verificarNavioDestruido(navio: Coordenada[]): boolean {
    for (const pos of navio) {
      if (this.grade[pos.y][pos.x] !== 'X') {
        return false;
      }
    }
    return true;
  }

  public receberAtaque(coordenada: Coordenada): boolean {
    if (!this.coordenadaValida(coordenada)) {
      return false;
    }

    const coordStr = `${coordenada.x},${coordenada.y}`;
    if (this.conjuntoNavios.has(coordStr)) {
      this.grade[coordenada.y][coordenada.x] = 'X';
      this.posicoesAtingidas += 1;

      // Verifica se o navio foi destruído
      for (const navio of this.navios) {
        if (this.verificarNavioDestruido(navio)) {
          console.log(`Navio destruído nas coordenadas: ${JSON.stringify(navio)}`);
          this.naviosRestantes -= 1;
        }
      }

      return true;
    }

    this.grade[coordenada.y][coordenada.x] = 'O';
    return false;
  }

  public todasPosicoesAtingidas(): boolean {
    return this.posicoesAtingidas === this.posicoesTotais;
  }
}
