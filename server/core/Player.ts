import { ERROR } from '@utils/utils';
import BasePlayer from './BasePlayer';

enum PlayerAction {
    Hit = 'hit',
    Stand = 'stand',
    DoubleDown = 'double down',
    Surrender = 'surrender',   
    Split = 'split'     
}

class Player extends BasePlayer {

    public seat: number;
    public readyStatus: boolean = false;
    public standStatus: boolean = false;
    public chips: number;         
    private betAmount: number = 0; 
    private insuranceBet: number = 0; 

    private _ws: WebSocket | null = null;

    /**
     * Creates an instance of a player.
     * @param {number} seat - The seat number of the player
     * @param {number} chips - The number of chips the player starts with
     * @param {string} [name="NoName"] - The name of the player (default is "NoName")
     */
    constructor(seat: number, chips: number, name: string = "NoName") {
        super(name);
        this.seat = seat;
        this.chips = chips;
        this._ws = new WebSocket('ws://localhost:8080');
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

    /**
     * Toggles the ready status of the player.
     */
    public toggleReadyStatus(): void {
        this.readyStatus = !this.readyStatus;
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
}

export default Player;