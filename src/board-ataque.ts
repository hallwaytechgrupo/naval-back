import { Board } from './board';
import type { Coordenada } from './types';

export class TabuleiroAtaque extends Board {
  // biome-ignore lint/complexity/noUselessConstructor: <explanation>
  constructor(tamanho: number) {
    super(tamanho);
  }

  public marcarAcerto(coordenada: Coordenada): void {
    if (this.coordenadaValida(coordenada)) {
      this.grade[coordenada.y][coordenada.x] = 'X';
    }
  }

  public marcarErro(coordenada: Coordenada): void {
    if (this.coordenadaValida(coordenada)) {
      this.grade[coordenada.y][coordenada.x] = 'O';
    }
  }
}
