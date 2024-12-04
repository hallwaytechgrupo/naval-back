import Table from 'cli-table3';
import type { Coordenada } from './types';

export class Board {
  protected grade: string[][];
  protected tamanho: number;

  constructor(tamanho: number) {
    this.tamanho = tamanho;
    this.grade = Array.from({ length: tamanho }, () => Array(tamanho).fill('~'));
  }

  protected coordenadaValida(coordenada: Coordenada): boolean {
    return coordenada.x >= 0 && coordenada.x < this.tamanho && coordenada.y >= 0 && coordenada.y < this.tamanho;
  }

  public getGrade(): string[][] {
    return this.grade;
  }

  public exibir(nome: string): void {
    const table = new Table({
      head: [nome, ...Array.from({ length: this.tamanho }, (_, i) => i.toString())],
      colWidths: Array(this.tamanho + 1).fill(3),
    });

    this.grade.forEach((linha, y) => table.push([y.toString(), ...linha]));

    console.log(table.toString());
  }
}
