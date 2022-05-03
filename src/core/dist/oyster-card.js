"use strict";
exports.__esModule = true;
var tslog_1 = require("tslog");
var constants_1 = require("../constants");
var log = new tslog_1.Logger();
var OysterCard = /** @class */ (function () {
    function OysterCard(balance) {
        if (balance === void 0) { balance = 0; }
        this._balance = balance;
        this._chargedFare = 0;
        this._journey = [];
    }
    Object.defineProperty(OysterCard.prototype, "balance", {
        get: function () {
            return this._balance;
        },
        set: function (balance) {
            this._balance = balance;
        },
        enumerable: false,
        configurable: true
    });
    OysterCard.prototype.touchIn = function (station, transport) {
        this._chargedFare =
            transport === constants_1.TRANSPORT.BUS ? constants_1.FARE.ANY_BUS_TRIP : constants_1.FARE.MAX_FARE;
        if (this.balance < this._chargedFare) {
            log.silly("Not enought \uD83D\uDCB0");
            return 'Fare charge exeeds your card\'s balance';
        }
        this.balance -= this._chargedFare;
        if (transport !== constants_1.TRANSPORT.BUS) {
            this._journey[0] = station;
        }
    };
    OysterCard.prototype.touchOut = function (station, transport) {
        if (transport === constants_1.TRANSPORT.BUS) {
            return; // Transport is BUS so nothing else to do here.
        }
        this._journey[1] = station;
        // Calculate fare to be charged as card was passed at the exit station
        this._chargedFare = this.calculateTubeFare(this.getDistanceInZones(), this._journey);
        // Restore MAX_FARE and charge new Fare
        this.balance += constants_1.FARE.MAX_FARE - this._chargedFare;
    };
    OysterCard.prototype.getDistanceInZones = function () {
        return this.getDistanceInFavorOfCustomer(this._journey[0].zone, this._journey[1].zone);
    };
    OysterCard.prototype.getDistanceInFavorOfCustomer = function (from, to) {
        var distance = OysterCard.MAX_DISTANCE;
        from.forEach(function (fromZone) {
            to.forEach(function (toZone) {
                var currDistance = Math.abs(fromZone - toZone);
                distance = distance > currDistance ? currDistance : distance; // We look for the shorter distance here
            });
        });
        return distance;
    };
    OysterCard.prototype.calculateTubeFare = function (distanceInZonesTravelled, journey) {
        var from = journey[0].zone;
        var to = journey[1].zone;
        log.debug("jorney: " + JSON.stringify(journey));
        log.debug("distanceInZonesTravelled: " + distanceInZonesTravelled);
        log.debug("from: " + from);
        log.debug("to: " + to);
        var ZERO_ZONES = 0;
        var ONE_ZONE = 1;
        var TWO_ZONES = 2;
        if (distanceInZonesTravelled === ZERO_ZONES
            && from.includes(1 /* ZONE1 */) && to.includes(1 /* ZONE1 */)) {
            log.debug('calculated FARE.ANYWHERE_IN_ZONE1');
            return constants_1.FARE.ANYWHERE_IN_ZONE1;
        }
        if (distanceInZonesTravelled === ZERO_ZONES && (!from.includes(1 /* ZONE1 */) || !to.includes(1 /* ZONE1 */))) {
            // At this point "from", and "to" can't include ZONE1 at the same time
            log.debug('calculated FARE.ONE_ZONE_OUTSIDE_ZONE1');
            return constants_1.FARE.ONE_ZONE_OUTSIDE_ZONE1;
        }
        if (distanceInZonesTravelled === ONE_ZONE && (from.includes(1 /* ZONE1 */) || to.includes(1 /* ZONE1 */))) {
            log.debug('calculated FARE.TWO_ZONES_INCLUDING_ZONE1');
            return constants_1.FARE.TWO_ZONES_INCLUDING_ZONE1;
        }
        if (distanceInZonesTravelled === ONE_ZONE && !from.includes(1 /* ZONE1 */) && !to.includes(1 /* ZONE1 */)) {
            log.debug('calculated FARE.TWO_ZONES_EXCLUDING_ZONE1');
            return constants_1.FARE.TWO_ZONES_EXCLUDING_ZONE1;
        }
        if (distanceInZonesTravelled === TWO_ZONES) {
            log.debug('calculated FARE.ANY_THREE_ZONES');
            return constants_1.FARE.ANY_THREE_ZONES;
        }
        log.debug('calculated FARE.MAX_FARE');
        // Default fare
        return constants_1.FARE.MAX_FARE;
    };
    OysterCard.MAX_DISTANCE = 3;
    return OysterCard;
}());
exports["default"] = OysterCard;
