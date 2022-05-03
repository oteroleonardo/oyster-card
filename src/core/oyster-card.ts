import { Logger } from 'tslog';

import { FARE, TRANSPORT, ZONE } from '../constants';
import { Station } from '../interfaces';
import { Transport } from '../types';

const log: Logger = new Logger();

class OysterCard{
    private static MAX_DISTANCE = 3;

    private _balance: number;
    private _chargedFare: number;
    private _journey: Station[];
    constructor(balance: number = 0) {
        this._balance = balance;
        this._chargedFare = 0;
        this._journey = [];
    }

    set balance(balance: number) {
        this._balance = balance;
    }
    get balance(): number {
        return this._balance;
    }

    touchIn(station: Station, transport: Transport) {
        this._chargedFare =
            transport === TRANSPORT.BUS ? FARE.ANY_BUS_TRIP : FARE.MAX_FARE;
        if (this.balance < this._chargedFare) {
            log.silly(`Not enought 💰`);
            return 'Fare charge exeeds your card\'s balance';
        }
        this.balance -= this._chargedFare;

        if (transport !== TRANSPORT.BUS) {
            this._journey[0] = station;
        }
    }

    touchOut(station: Station, transport: Transport) {
        if (transport === TRANSPORT.BUS) {
            return; // Transport is BUS so nothing else to do here.
        }

        this._journey[1] = station;
        // Calculate fare to be charged as card was passed at the exit station
        this._chargedFare = this.calculateTubeFare(this.getDistanceInZones(), this._journey);
        // Restore MAX_FARE and charge new Fare
        this.balance += FARE.MAX_FARE - this._chargedFare;
    }

    getDistanceInZones(): number {
        return this.getDistanceInFavorOfCustomer(this._journey[0].zone, this._journey[1].zone);
    }

    getDistanceInFavorOfCustomer(from: number[], to: number[]): number {
        let distance = OysterCard.MAX_DISTANCE;

        from.forEach(function(fromZone: number){
            to.forEach(function(toZone: number){
                const currDistance = Math.abs(fromZone - toZone);
                distance = distance > currDistance ? currDistance : distance; // We look for the shorter distance here
            });
        });
        return distance;
    }

    calculateTubeFare(distanceInZonesTravelled: number, journey: Station[]): number {
        const from = journey[0].zone;
        const to = journey[1].zone;
        log.debug(`jorney: ${JSON.stringify(journey)}`);
        log.debug(`distanceInZonesTravelled: ${distanceInZonesTravelled}`);
        log.debug(`from: ${from}`);
        log.debug(`to: ${to}`);
        const ZERO_ZONES = 0;
        const ONE_ZONE = 1;
        const TWO_ZONES = 2;

        if (distanceInZonesTravelled === ZERO_ZONES
            && from.includes(ZONE.ZONE1) && to.includes(ZONE.ZONE1)) {
            log.debug('calculated FARE.ANYWHERE_IN_ZONE1');
            return FARE.ANYWHERE_IN_ZONE1;
        }

        if (distanceInZonesTravelled === ZERO_ZONES && (!from.includes(ZONE.ZONE1) || !to.includes(ZONE.ZONE1))) {
            // At this point "from", and "to" can't include ZONE1 at the same time
            log.debug('calculated FARE.ONE_ZONE_OUTSIDE_ZONE1');
            return FARE.ONE_ZONE_OUTSIDE_ZONE1;
        }
        if (distanceInZonesTravelled === ONE_ZONE && (from.includes(ZONE.ZONE1) || to.includes(ZONE.ZONE1))) {
            log.debug('calculated FARE.TWO_ZONES_INCLUDING_ZONE1');
            return FARE.TWO_ZONES_INCLUDING_ZONE1;
        }
        if (distanceInZonesTravelled === ONE_ZONE && !from.includes(ZONE.ZONE1) && !to.includes(ZONE.ZONE1)) {
            log.debug('calculated FARE.TWO_ZONES_EXCLUDING_ZONE1');
            return FARE.TWO_ZONES_EXCLUDING_ZONE1;
        }
        if (distanceInZonesTravelled === TWO_ZONES) {
            log.debug('calculated FARE.ANY_THREE_ZONES');
            return FARE.ANY_THREE_ZONES;
        }
        log.debug('calculated FARE.MAX_FARE');
        // Default fare
        return FARE.MAX_FARE;
    }

}

export default OysterCard;
