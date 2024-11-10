# Blackjack

🔗 [Link](https://blackjack-game-server.vercel.app)

## MongoDB

- Place `x509-cert.pem` into `/server/config/`. (Ask me for credential file)

## Definition

### 牌桌上的遊戲者(莊家/玩家)
```javascript
class BasePlayer {
    private id: string;                 // UUID
    private hand: Card[] = [];          // 手牌
    private name: string;               // 名稱

    public isBusted: boolean = false;   // 是否超過21點
}
```

### 莊家
```javascript
class Dealer extends BasePlayer {
    super();                                        // id, hand, name
    private readonly pointThreshold: number = 17;   // 手牌點數>=閾值(17)時停止抽牌
}
```

### 玩家動作
```javascript
enum Action {
    Hit = 0,            // 要牌
    Stand = 1,          // 停牌
    DoubleDown = 2,     // 加倍賭注
    Surrender = 3,      // 投降
    Split = 4           // 分牌
}
```

### 玩家
```javascript
class Player extends BasePlayer {
    super();                            // id, hand, name
    private seat: number;               // 座位編號
    private chips: number               // 籌碼
    private insuranceBet: number = 0;   // 保險金額，莊家第一張牌是A時，玩家可選擇購買保險
}
```

