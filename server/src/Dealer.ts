import BasePlayer from "../src/BasePlayer";
import Deck from "../src/Deck";
import { Card } from "./Card";

class Dealer extends BasePlayer {

  constructor(name: string, cards: Card[]) {
    super(name, cards);
  }

}
