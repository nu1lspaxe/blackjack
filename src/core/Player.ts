import { ERROR } from './utils';
import BasePlayer from './BasePlayer';
import PublishSubscribe from './PublishSubscribe';

import WebSocket from 'ws';

enum PlayerAction {
    Hit = 'hit',
    Stand = 'stand',
    DoubleDown = 'double down',
    Surrender = 'surrender',   
    Split = 'split'     
}

/**
 * Represents a player in the game.
 * @extends BasePlayer
 * @property {number} seat - The seat number of the player
 * @property {boolean} readyStatus - Represents whether the player is ready to start the game
 * @property {boolean} standStatus - Represents whether the player has ended their turn
 * @property {number} chips - The number of chips the player has
 * @property {number} betAmount - The amount the player has bet
 * @property {number} insuranceBet - The amount the player has bet for insurance
 * @property {WebSocket} _ws - The WebSocket connection of the player
 */
class Player extends BasePlayer {

    public seat: number;
    public readyStatus: boolean = true;   
    public standStatus: boolean = false;
    private chips: number;         
    private betAmount: number = 0; 
    private insuranceBet: number = 0; 

    public _ws: WebSocket;

    /**
     * Creates an instance of a player.
     * @param {number} seat - The seat number of the player
     * @param {number} chips - The number of chips the player starts with
     * @param {string} [name="NoName"] - The name of the player (default is "NoName")
     */
    constructor(ws: WebSocket, code: string, seat: number, chips: number, name: string = "NoName") {
        super(code, name);
        this._ws = ws;
        this.seat = seat;

        if (chips <= 0) {
            throw new Error(ERROR.INVALID_VALUE);
        }
        this.chips = chips;
    }

    /**
     * Allows the player to place a bet.
     * @param {number} amount - The amount to bet
     * @return {boolean} - Returns true if the bet was placed successfully, false if there are insufficient chips
     */
    public placeBet(amount: number): boolean {
        if (amount <= 0 || amount > this.chips) {
            throw new Error(ERROR.INVALID_VALUE);
        }
        this.betAmount = amount;
        this.chips -= amount;
        return true;
    }

    /**
     * Allows the player to place an insurance bet (half of the current bet).
     * @return {boolean} - Returns true if the insurance bet was placed successfully, false if there are insufficient chips
     */
    public placeInsuranceBet(): boolean {
        const insuranceAmount = Math.floor(this.betAmount / 2);
        if (insuranceAmount > this.chips) {
            console.error(ERROR.INVALID_VALUE);
            return false;
        }
        this.insuranceBet = insuranceAmount;
        this.chips -= insuranceAmount;
        return true;
    }

    /**
     * Handles the scenario where the player wins the bet.
     * @param {number} [multiplier=1] - The multiplier for the winnings (default is 1x)
     */
    public winBet(multiplier: number = 1): void {
        const winnings = this.betAmount * multiplier;
        this.chips += winnings;
        this.resetBet();
    }

    /**
     * Handles the scenario where the player wins the insurance bet.
     */
    public winInsurance(): void {
        const insuranceWinnings = this.insuranceBet * 2;
        this.chips += insuranceWinnings;
        this.insuranceBet = 0;
    }

    /**
     * Handles the bust scenario where the player loses the bet and ends their turn.
     */
    public bust(): void {
        this.standStatus = true;
        this.betAmount = 0;
        this.insuranceBet = 0;
    }

    /**
     * Marks the player as having stood (ended their turn).
     */
    public stand(): void {
        this.standStatus = true;
    }

    /**
     * Resets the bet and insurance bet amounts.
     * @private
     */
    private resetBet(): void {
        this.betAmount = 0;
        this.insuranceBet = 0;
    }

    /**
     * Gets the current number of chips the player has.
     * @return {number} - The current chip count of the player
     */
    public getChips(): number {
        return this.chips;
    }

    public setChips(chips: number): void {
        if (chips < 0) {
            throw new Error(ERROR.INVALID_VALUE);
        }
        this.chips = chips;
    }

    public setReadyStatus(status: boolean): void {
        this.readyStatus = status;
    }

    /**
     * Resets the player's hand, status, and bet.
     * This is usually called when the player prepares for a new round.
     */
    public resetHandAndStatus(): void {
        this.resetHand();
        this.standStatus = false;
        this.readyStatus = false;
        this.resetBet();
    }


    public toString(): string {
        return "{seat:" + this.seat.toString() + 
        ", readyStatus:" + this.readyStatus + 
        ", standStatus" + this.standStatus + 
        ", chips:" + this.chips + 
        ", betAmount;" + this.betAmount +
        ", insuranceBet:" + this.insuranceBet + "}"
    }
    /**
     * Player make a double down bet, draw one more card and stand
     * @return {boolean} - Returns true if the double down was successful, false if there are insufficient chips
     */
    public doubleDown(): boolean {
        if (this.betAmount > this.chips) {
            console.error(ERROR.INVALID_VALUE);
            return false;
        }

        this.betAmount *= 2;
        this.chips -= this.betAmount;

        // end the turn after double down
        this.standStatus = true;
        return true;
    }

    /**
     * Player surrender the game, get half of the bet amount back
     */
    public surrender(): void {
        this.chips += Math.floor(this.betAmount / 2);
        this.standStatus = true;
        this.resetBet();
    }
}

export default Player;