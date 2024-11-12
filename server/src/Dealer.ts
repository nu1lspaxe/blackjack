import BasePlayer from "../src/BasePlayer";
import Deck from "../src/Deck";
import { Card } from "./Card";

class Dealer extends BasePlayer {

  constructor(name: string = "Dealer") {
    super(name);
  }

  /**
   * Determines whether the dealer should take another card.
   * The dealer must hit until their hand's value is at least 17.
   * @returns {boolean} True if the dealer should hit, false otherwise.
   */
  public shouldHit(): boolean {
    return this.calculateHand() < 17;
  } 

}

export default Dealer;