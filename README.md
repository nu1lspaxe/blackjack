# Blackjack

## Build

1. `npm build:client` - 打包網頁程式
2. `npm build:server` - 打包伺服器程式
3. `npm start` - 執行程式

## Transmission Message

### 創建新玩家

```ts
interface IPlayer {
    code?: string   // 房號，用 TableId(uuid) 計算代號
    name?: string   // 玩家名稱，預設 "NoName"
}
```

### 創建牌桌


## Definition

### 牌桌當前狀態

```ts
enum TableStatus {
    OPEN = 'open',      // 開放玩家進入
    GOING = 'going',    // 遊戲進行中
    CLOSED = 'closed'   // 結束
}
```

### 牌桌資訊

```ts
class Table {
    status: TableStatus // 牌桌狀態
    dealer: Dealer      // 當局莊家
    players: Player[]   // 桌上玩家
    hands: Card[][]     // 所有人手牌
    deck: Card[]        // 剩餘牌庫
    isBusted: boolean[] // 爆牌狀態
    points: number[]    // 結算點數
}
```

### 牌桌上的遊戲者(莊家/玩家)

```ts
class BasePlayer {
    private _id: string;                // uuid
    private _hand: Card[] = [];         // 手牌
    private _name: string;              // 名稱
}
```

### 莊家

```ts
class Dealer extends BasePlayer {
    super();    // id, hand, name
}
```

### 玩家動作

```ts
enum PlayerAction {
    Hit = 'hit',                // 要牌
    Stand = 'stand',            // 停牌
    DoubleDown = 'double down', // 加倍賭注
    Surrender = 'surrender',    // 投降
    Split = 'split'             // 分牌
}
```

### 玩家

```ts
class Player extends BasePlayer {
    super();                            // id, hand, name
    private seat: number;               // 座位編號
    private chips: number               // 籌碼
    private insuranceBet: number = 0;   // 保險金額，莊家第一張牌是A時，玩家可選擇購買保險
}
```

## OpenTelemetry

### Run docker for Jaeger(with cmd)

```cmd
docker run --rm ^
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 ^
  -p 16686:16686 ^
  -p 4317:4317 ^
  -p 4318:4318 ^
  -p 9411:9411 ^
  jaegertracing/all-in-one:latest
```

### Then see Jaeger on <http://localhost:16686>
