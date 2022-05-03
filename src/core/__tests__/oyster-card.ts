import test from 'ava';
import sinon from 'sinon';

import {
    FARE,
    TRANSPORT,
    TUBE_STATION } from '../../constants';
import OysterCard from '../oyster-card';

const BUS = TRANSPORT.BUS;
const TUBE = TRANSPORT.TUBE;
const INITIAL_BALANCE = 30;

test('Should set initial balance correctly', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);

    t.is(card.balance, INITIAL_BALANCE);
});

test('Should charge MAX_FARE on touchIn', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.HOLBORN, TRANSPORT.TUBE);

    t.is(card.balance, INITIAL_BALANCE - FARE.MAX_FARE);
});

test('Should charge BUS_FARE on touchIn, touchOut sequence for TRANSPORT.BUS', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.EARLS_COURT, BUS);
    card.touchOut(TUBE_STATION.HAMMERSMITH, BUS);

    t.is(card.balance, INITIAL_BALANCE - FARE.ANY_BUS_TRIP);
});

test('Should charge BUS_FARE on single touchIn for TRANSPORT.BUS', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.EARLS_COURT, BUS);
    t.is(card.balance, INITIAL_BALANCE - FARE.ANY_BUS_TRIP);
    card.touchIn(TUBE_STATION.HAMMERSMITH, BUS);
    t.is(card.balance, INITIAL_BALANCE - FARE.ANY_BUS_TRIP - FARE.ANY_BUS_TRIP);
});

test('Should call function to calculate traveled zones correctly on touchOut event for TRANSPORT.TUBE', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    const spyGetDistanceInFavorOfCustomer = sinon.spy(card, 'getDistanceInFavorOfCustomer');
    card.touchIn(TUBE_STATION.HAMMERSMITH, TUBE);
    card.touchOut(TUBE_STATION.HOLBORN, TUBE);
    t.truthy(spyGetDistanceInFavorOfCustomer.called);
    t.truthy(spyGetDistanceInFavorOfCustomer.calledWith(TUBE_STATION.HAMMERSMITH.zone, TUBE_STATION.HOLBORN.zone));
    card.touchIn(TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(TUBE_STATION.WIMBLEDON, TUBE);

    t.truthy(spyGetDistanceInFavorOfCustomer.calledWith(TUBE_STATION.HOLBORN.zone, TUBE_STATION.WIMBLEDON.zone));
});

test('Should correctly calculate traveled distance zones in favor of the customer', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    let distanceInZones = card.getDistanceInFavorOfCustomer(TUBE_STATION.HAMMERSMITH.zone, TUBE_STATION.HOLBORN.zone);
    const ONE_ZONE = 1;

    t.is(distanceInZones, ONE_ZONE);

    const TWO_ZONES = 2;
    distanceInZones = card.getDistanceInFavorOfCustomer(TUBE_STATION.HOLBORN.zone, TUBE_STATION.WIMBLEDON.zone);

    t.is(distanceInZones, TWO_ZONES);
});

test('Should charge balance correctly when Anywhere in Zone 1', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(TUBE_STATION.EARLS_COURT, TUBE);

    t.is(card.balance, INITIAL_BALANCE - FARE.ANYWHERE_IN_ZONE1);
});

test('Should charge the right amount for any one zone outside zone 1', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.WIMBLEDON, TUBE);
    card.touchOut(TUBE_STATION.WIMBLEDON, TUBE);

    t.is(card.balance, INITIAL_BALANCE - FARE.ONE_ZONE_OUTSIDE_ZONE1);
});

test('Should charge the right amount for two zones including zone 1', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(TUBE_STATION.HAMMERSMITH, TUBE);

    t.is(card.balance, INITIAL_BALANCE - FARE.TWO_ZONES_INCLUDING_ZONE1);
});

test('Should charge in favor of customer for two stations having a zone in common (!= ZONE1)', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.EARLS_COURT, TUBE);
    card.touchOut(TUBE_STATION.HAMMERSMITH, TUBE);
    // distance in zones should be 0 as both are in ZONE2 (intrazone travel)

    t.is(card.balance, INITIAL_BALANCE - FARE.ONE_ZONE_OUTSIDE_ZONE1);
});

test('Should charge the right amount for two zones excluding zone 1', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.WIMBLEDON, TUBE);
    card.touchOut(TUBE_STATION.HAMMERSMITH, TUBE);

    t.is(card.balance, INITIAL_BALANCE - FARE.TWO_ZONES_EXCLUDING_ZONE1);
});

test('Should charge the right amount for any three zones', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(TUBE_STATION.WIMBLEDON, TUBE);

    t.is(card.balance, INITIAL_BALANCE - FARE.ANY_THREE_ZONES);
});

test('Should charge the right amount for any BUS journey', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.HOLBORN, BUS);
    card.touchOut(TUBE_STATION.WIMBLEDON, BUS);

    t.is(card.balance, INITIAL_BALANCE - FARE.ANY_BUS_TRIP);
});

test('Should charge the right amount for TUBE, BUS, TUBE journey', (t) => {
    const card = new OysterCard(INITIAL_BALANCE);
    card.touchIn(TUBE_STATION.HOLBORN, TUBE);
    card.touchOut(TUBE_STATION.EARLS_COURT, TUBE);

    card.touchIn(TUBE_STATION.EARLS_COURT, BUS);
    card.touchOut(TUBE_STATION.EARLS_COURT, BUS);

    card.touchIn(TUBE_STATION.EARLS_COURT, TUBE);
    card.touchOut(TUBE_STATION.HAMMERSMITH, TUBE);

    t.is(card.balance, INITIAL_BALANCE - FARE.ANYWHERE_IN_ZONE1 - FARE.ANY_BUS_TRIP - FARE.ONE_ZONE_OUTSIDE_ZONE1 );
});
