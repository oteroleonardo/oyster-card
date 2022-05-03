"use strict";
exports.__esModule = true;
var ava_1 = require("ava");
var sinon_1 = require("sinon");
var constants_1 = require("../../constants");
var oyster_card_1 = require("../oyster-card");
var BUS = constants_1.TRANSPORT.BUS;
var TUBE = constants_1.TRANSPORT.TUBE;
var INITIAL_BALANCE = 30;
ava_1["default"]('Should set initial balance correctly', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    t.is(card.balance, INITIAL_BALANCE);
});
ava_1["default"]('Should charge MAX_FARE on touchIn', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.HOLBORN, constants_1.TRANSPORT.TUBE);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.MAX_FARE);
});
ava_1["default"]('Should charge BUS_FARE on touchIn, touchOut sequence for TRANSPORT.BUS', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.EARLS_COURT, BUS);
    card.touchOut(constants_1.TUBE_STATION.HAMMERSMITH, BUS);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ANY_BUS_TRIP);
});
ava_1["default"]('Should charge BUS_FARE on single touchIn for TRANSPORT.BUS', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.EARLS_COURT, BUS);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ANY_BUS_TRIP);
    card.touchIn(constants_1.TUBE_STATION.HAMMERSMITH, BUS);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ANY_BUS_TRIP - constants_1.FARE.ANY_BUS_TRIP);
});
ava_1["default"]('Should call function to calculate traveled zones correctly on touchOut event for TRANSPORT.TUBE', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    var spyGetDistanceInFavorOfCustomer = sinon_1["default"].spy(card, 'getDistanceInFavorOfCustomer');
    card.touchIn(constants_1.TUBE_STATION.HAMMERSMITH, TUBE);
    card.touchOut(constants_1.TUBE_STATION.HOLBORN, TUBE);
    t.truthy(spyGetDistanceInFavorOfCustomer.called);
    t.truthy(spyGetDistanceInFavorOfCustomer.calledWith(constants_1.TUBE_STATION.HAMMERSMITH.zone, constants_1.TUBE_STATION.HOLBORN.zone));
    card.touchIn(constants_1.TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(constants_1.TUBE_STATION.WIMBLEDON, TUBE);
    t.truthy(spyGetDistanceInFavorOfCustomer.calledWith(constants_1.TUBE_STATION.HOLBORN.zone, constants_1.TUBE_STATION.WIMBLEDON.zone));
});
ava_1["default"]('Should correctly calculate traveled distance zones in favor of the customer', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    var distanceInZones = card.getDistanceInFavorOfCustomer(constants_1.TUBE_STATION.HAMMERSMITH.zone, constants_1.TUBE_STATION.HOLBORN.zone);
    var ONE_ZONE = 1;
    t.is(distanceInZones, ONE_ZONE);
    var TWO_ZONES = 2;
    distanceInZones = card.getDistanceInFavorOfCustomer(constants_1.TUBE_STATION.HOLBORN.zone, constants_1.TUBE_STATION.WIMBLEDON.zone);
    t.is(distanceInZones, TWO_ZONES);
});
ava_1["default"]('Should charge balance correctly when Anywhere in Zone 1', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(constants_1.TUBE_STATION.EARLS_COURT, TUBE);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ANYWHERE_IN_ZONE1);
});
ava_1["default"]('Should charge the right amount for any one zone outside zone 1', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.WIMBLEDON, TUBE);
    card.touchOut(constants_1.TUBE_STATION.WIMBLEDON, TUBE);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ONE_ZONE_OUTSIDE_ZONE1);
});
ava_1["default"]('Should charge the right amount for two zones including zone 1', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(constants_1.TUBE_STATION.HAMMERSMITH, TUBE);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.TWO_ZONES_INCLUDING_ZONE1);
});
ava_1["default"]('Should charge in favor of customer for two stations having a zone in common (!= ZONE1)', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.EARLS_COURT, TUBE);
    card.touchOut(constants_1.TUBE_STATION.HAMMERSMITH, TUBE);
    //distance in zones should be 0 as both are in ZONE2 (intrazone travel) 
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ONE_ZONE_OUTSIDE_ZONE1);
});
ava_1["default"]('Should charge the right amount for two zones excluding zone 1', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.WIMBLEDON, TUBE);
    card.touchOut(constants_1.TUBE_STATION.HAMMERSMITH, TUBE);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.TWO_ZONES_EXCLUDING_ZONE1);
});
ava_1["default"]('Should charge the right amount for any three zones', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(constants_1.TUBE_STATION.WIMBLEDON, TUBE);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ANY_THREE_ZONES);
});
ava_1["default"]('Should charge the right amount for any BUS journey', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.HOLBORN, BUS);
    card.touchOut(constants_1.TUBE_STATION.WIMBLEDON, BUS);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ANY_BUS_TRIP);
});
ava_1["default"]('Should charge the right amount for TUBE, BUS, TUBE journey', function (t) {
    var card = new oyster_card_1["default"](INITIAL_BALANCE);
    card.touchIn(constants_1.TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(constants_1.TUBE_STATION.EARLS_COURT, TUBE);
    card.touchIn(constants_1.TUBE_STATION.EARLS_COURT, BUS);
    card.touchOut(constants_1.TUBE_STATION.EARLS_COURT, BUS);
    card.touchIn(constants_1.TUBE_STATION.EARLS_COURT, TUBE);
    card.touchOut(constants_1.TUBE_STATION.HAMMERSMITH, TUBE);
    t.is(card.balance, INITIAL_BALANCE - constants_1.FARE.ANYWHERE_IN_ZONE1 - constants_1.FARE.ANY_BUS_TRIP - constants_1.FARE.ONE_ZONE_OUTSIDE_ZONE1);
});
