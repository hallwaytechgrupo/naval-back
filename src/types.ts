export type Coordenada = {
  x: number;
  y: number;
};

export enum Direcao {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export type Navio = {
  coordenadas: Coordenada[];
};

export enum Fase {
  Posicionamento = 0,
  Ataque = 1,
  Fim = 2,
}
