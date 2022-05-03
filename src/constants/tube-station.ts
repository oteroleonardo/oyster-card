
export const enum ZONE {
    ZONE1 = 1,
    ZONE2 = 2,
    ZONE3 = 3,
}
export const TUBE_STATION = {
    EARLS_COURT: {
        name: 'Earl\'s Court',
        zone: [ZONE.ZONE1, ZONE.ZONE2],
    },
    HAMMERSMITH: {
        name: 'Hammersmith',
        zone: [ZONE.ZONE2]
    },
    HOLBORN : {
        name: 'Holborn',
        zone: [ZONE.ZONE1],
    },
    WIMBLEDON: {
        name: 'Wimbledon',
        zone: [ZONE.ZONE3],
    },
};
