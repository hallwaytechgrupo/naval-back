# Projeto de Batalha Naval

Este projeto implementa um jogo de Batalha Naval utilizando TypeScript, Node.js, e WebSockets. Abaixo está uma descrição detalhada de cada arquivo, suas funções principais e como eles se interligam.
- Utilizamos a tática "dividir para conquistar", pois por ser um projeto com muita lógica necessária, precisamos dividir em "escopos" e "funcionalidades" para que fosse possível o desenvolvimento.

- Em suma, criamos primeiro a lógica do tabuleiro, onde existem tabuleiros de posicionamento e de ataque, cada um com sua lógica, mas todos com um comportamento em comum: tem um tamanho, são um array bidimensional, possuem métodos para ver se uma coordenada é válida e por fim, um método para retornar a o array própriamente dito.
- Depois, criamos o arquivo `game.ts`, que é responsável pela lógica do jogo, ou seja, a definição do tipo TabuleirosJogador (onde cada jogador tem um tabuleiro de posicionamento e um ataque), a definição das fases, os naviosPosicionados, o total de navios do jogo, como também o turno do jogo (vez de quem jogar).
- E por fim, o socket.ts que faz a leitura do game.ts e utiliza WebSockets (utilizamos o Socket.IO pela maior facilidade), para permitir um game multiplayer.

## Estrutura do Projeto
```
biome.json
package.json
README.md
src/
  board-ataque.ts
  board-posicionamento.ts
  board.ts
  client.ts
  game.ts
  memento.ts
  socket.ts
  types.ts
tsconfig.json
```

## Aplicações Matemáticas:

### Domínio e Imagem:
- **Domínio:**refere-se ao conjunto de todas as possíveis coordenadas válidas no tabuleiro. No seu projeto, isso é representado pelo conjunto de todas as coordenadas (x, y) onde 0 <= x < tamanho e 0 <= y < tamanho. Em termos de código, isso é verificado pela função **coordenadaValida** na classe **Board**.

- **Imagem:** refere-se ao conjunto de todas as possíveis saídas ou estados do tabuleiro após uma série de ações (como posicionar navios e realizar ataques). Isso é representado pelo estado atual do tabuleiro, que pode ser visualizado através do método **getGrade** na classe **Board**:

### Função Matemática
- Função **obterCoordenadas**: Esta função recebe uma coordenada inicial, um comprimento e uma direção, e retorna um array de coordenadas que representam a posição de um navio no tabuleiro.

**Horizontal:**
$$ \text{CoordenadasNavio} = { (x, y) \in \mathbb{Z}^2 \mid x = x_{\text{inicio}} + i \text{ e } y = y_{\text{inicio}} \text{ para } i \in [0, \text{comprimento} - 1] } $$

**Vertical:** 
$$ \text{CoordenadasNavio} = { (x, y) \in \mathbb{Z}^2 \mid x = x_{\text{inicio}} \text{ e } y = y_{\text{inicio}} + i \text{ para } i \in [0, \text{comprimento} - 1] } $$

### Definições Matemáticas 
1. **Coordenada**
   ```typescript
   export type Coordenada = {
     x: number;
     y: number;
   };
   ```
   - **Definição Denotativa**: 
Coordenada é um tipo que representa um ponto no tabuleiro com propriedades x e y, ambas do tipo `number`.
   - **Uso**: Utilizado para especificar posições no tabuleiro.

2. **Direcao**
   ```typescript
   export enum Direcao {
     Horizontal = 'horizontal',
     Vertical = 'vertical',
   }
   ```
   - **Enumeração**: Direcao é um enum que define duas direções possíveis para posicionar navios:  Horizontal e Vertical.
   - **Uso**: Utilizado para indicar a orientação de um navio no tabuleiro.

3. **Navio**
   ```typescript
   export type Navio = {
     coordenadas: Coordenada[];
   };
   ```
   - **Definição Denotativa**: Navio é um tipo que representa um navio no tabuleiro, composto por um array de Coordenada.
   - **Uso**: Utilizado para armazenar as coordenadas ocupadas por um navio.

4. **Fase**
   ```typescript
   export enum Fase {
     Posicionamento = 0,
     Ataque = 1,
     Fim = 2,
   }
   ```
   - **Enumeração**: Fase é um enum que define as fases do jogo: Posicionamento, Ataque, e Fim.
   - **Uso**: Utilizado para controlar o estado atual do jogo.

### Interligação com Definições Denotativas e Enumeração

- **Definições Denotativas**: 
  - Coordenada e Navio são exemplos de definições denotativas, onde os tipos são definidos explicitamente com suas propriedades. Eles descrevem claramente o que representam no contexto do jogo.
  - Coordenada denota um ponto no tabuleiro com x e y.
  - Navio denota um conjunto de coordenadas que representam a posição de um navio no tabuleiro.

- **Enumeração**:
  - Direcao e Fase  são enums que enumeram valores possíveis para direções e fases do jogo, respectivamente.
  - Direcao enumera as possíveis orientações de um navio (Horizontal e Vertical).
  - Fase enumera os estados do jogo (Posicionamento, Ataque, Fim).

### Como se Interligam

- **Coordenada**:
  - Utilizada em Navio para definir as posições ocupadas por um navio.
  - Utilizada em métodos como `posicionarNavio` e `receberAtaque` para especificar posições no tabuleiro.
- **Direcao**:
  - Utilizada em `posicionarNavio` para indicar a orientação do navio ao ser posicionado no tabuleiro.
- **Navio**:
  - Utilizado para armazenar e manipular as posições dos navios no tabuleiro.
  - Verificado em métodos como `verificarNavioDestruido` para determinar se um navio foi completamente atingido.
- **Fase**:
  - Utilizada para controlar o fluxo do jogo, determinando se os jogadores estão na fase de posicionamento, ataque ou se o jogo terminou.


## Descrição dos Arquivos
- `src/board.ts`:
  - Define a classe base `Board` que representa um tabuleiro genérico. Contém métodos para validar coordenadas, obter a grade do tabuleiro e exibir o tabuleiro no console.
- `src/board-ataque.ts`:
  - Define a classe `TabuleiroAtaque` que estende `Board`. Adiciona métodos específicos para marcar acertos e erros no tabuleiro de ataque.
- `src/board-posicionamento.ts`
  - Define a classe `TabuleiroPosicionamento` que estende `Board`. Adiciona métodos para posicionar navios, receber ataques e verificar se um navio foi destruído.
- `src/client.ts`:
  - Simula um cliente que se conecta ao servidor e realiza ações como posicionar navios e atacar.
- `src/game.ts`:
  - Define a classe `Game` que gerencia o estado do jogo, incluindo os tabuleiros dos jogadores, a fase do jogo, e o turno atual. Contém métodos para posicionar navios, realizar ataques, alternar turnos, e criar/restaurar mementos.
- `src/memento.ts`:
  - Implementa o padrão Memento para salvar e restaurar o estado do jogo.
- `src/socket.ts`:
  - Configura o servidor WebSocket utilizando `socket.io`. Gerencia a comunicação em tempo real entre o servidor e os clientes, incluindo eventos para posicionar navios, realizar ataques, e obter o estado atual do jogo.
- `src/types.ts`:
  - Define tipos e enums utilizados no projeto, como `Coordenada`, `Direcao`, `Navio`, e `Fase`.
- `biome.json`:
  - Configurações do Biome, um linter e formatador de código.
- `package.json`:
  - Arquivo de configuração do npm, contendo as dependências do projeto e scripts de build e desenvolvimento.
- `tsconfig.json`:
  - Configurações do compilador TypeScript.

## Interligação dos Arquivos

1. **Tabuleiros (`board.ts`, `board-ataque.ts`, `board-posicionamento.ts`)**:
   - `Board` é a classe base para `TabuleiroAtaque` e `TabuleiroPosicionamento`.
   - `TabuleiroAtaque` adiciona funcionalidades específicas para marcar acertos e erros.
   - `TabuleiroPosicionamento` adiciona funcionalidades para posicionar navios e receber ataques.

2. **Jogo (`game.ts`)**:
   - `Game` utiliza `TabuleiroPosicionamento` e `TabuleiroAtaque` para gerenciar os tabuleiros dos jogadores.
   - Contém a lógica principal do jogo, como alternar turnos, verificar o estado do jogo, e gerenciar a fase atual.

4. **Servidor WebSocket (`socket.ts`)**:
   - Configura o servidor WebSocket e gerencia eventos de comunicação em tempo real.
   - Utiliza a classe `Game` para manipular o estado do jogo com base nos eventos recebidos dos clientes.

5. **Memento (`memento.ts`)**:
   - Implementa o padrão Memento para salvar e restaurar o estado do jogo.
   - Utilizado pela classe `Game` para criar e restaurar estados do jogo.

6. **Tipos (`types.ts`)**:
   - Define tipos e enums utilizados em todo o projeto para garantir a tipagem estática e evitar erros.

## Funções Principais e Interligações

### `Board`
- `coordenadaValida(coordenada: Coordenada): boolean`: Verifica se uma coordenada é válida dentro do tabuleiro.
- `getGrade(): string[][]`: Retorna a grade do tabuleiro.
- `exibir(nome: string): void`: Exibe o tabuleiro no console.

### `TabuleiroAtaque`
- `marcarAcerto(coordenada: Coordenada): void`: Marca um acerto no tabuleiro de ataque.
- `marcarErro(coordenada: Coordenada): void`: Marca um erro no tabuleiro de ataque.

### `TabuleiroPosicionamento`
- `posicionarNavio(inicio: Coordenada, comprimento: number, direcao: Direcao): { sucesso: boolean; coordenadas?: Coordenada[] }`: Posiciona um navio no tabuleiro.
- `receberAtaque(coordenada: Coordenada): boolean`: Recebe um ataque e verifica se acertou um navio.
- `verificarNavioDestruido(navio: Coordenada[]): boolean`: Verifica se um navio foi destruído.

### `Game`
- `posicionarNavio(jogador: number, inicio: Coordenada, comprimento: number, direcao: Direcao): { sucesso: boolean; mensagem?: string; coordenadas?: Coordenada[]; tabuleiro?: { ataque: string[][]; posicionamento: string[][] } }`: Posiciona um navio para um jogador.
- `ataque(jogador: number, coordenada: Coordenada): { sucesso: boolean; acerto?: boolean; mensagem?: string; coordenada?: Coordenada; tabuleiro?: { ataque: string[][]; posicionamento: string[][] } }`: Realiza um ataque.
- `alternarTurno(): void`: Alterna o turno entre os jogadores.
- `criarMemento(): Memento`: Cria um memento do estado atual do jogo.
- `restaurarMemento(memento: Memento): void`: Restaura o estado do jogo a partir de um memento.

### `Socket`
- `io.on('connection', (socket) => { ... })`: Gerencia a conexão de novos clientes e define eventos para posicionar navios, realizar ataques, e obter o estado atual do jogo.
