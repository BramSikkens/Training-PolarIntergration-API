import express, { Request, Response } from "express";

import IRoutableController from "../interfaces/IRoutableController";

import { getTimeInTrainingZone } from "../helpers/PolarUtils";

class TestController implements IRoutableController {
  public path: string = "/test";
  public router: express.Router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(this.path, this.test.bind(this));
  }

  async test(req: Request, res: Response) {
    const trainingZones = [
      {
        id: 13,
        zoneType: "R1",
        maxHr: 90,
        minHr: 75,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 10,
        maxSpd: 11,
        dateCreated: "2020-10-03T10:11:57.000Z",
      },
      {
        id: 14,
        zoneType: "R2",
        maxHr: 150,
        minHr: 90,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 0,
        maxSpd: 0,
        dateCreated: "2020-10-03T10:11:57.000Z",
      },
      {
        id: 15,
        zoneType: "R3+",
        maxHr: 0,
        minHr: 0,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 0,
        maxSpd: 0,
        dateCreated: "2020-10-03T10:11:57.000Z",
      },
      {
        id: 16,
        zoneType: "R4",
        maxHr: 0,
        minHr: 0,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 0,
        maxSpd: 0,
        dateCreated: "2020-10-03T10:11:57.000Z",
      },
      {
        id: 17,
        zoneType: "R5",
        maxHr: 0,
        minHr: 0,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 0,
        maxSpd: 0,
        dateCreated: "2020-10-03T10:11:57.000Z",
      },
      {
        id: 18,
        zoneType: "R6",
        maxHr: 0,
        minHr: 0,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 0,
        maxSpd: 0,
        dateCreated: "2020-10-03T10:11:57.000Z",
      },
      {
        id: 19,
        zoneType: "R7",
        maxHr: 0,
        minHr: 0,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 0,
        maxSpd: 0,
        dateCreated: "2020-10-03T10:11:57.000Z",
      },
      {
        id: 20,
        zoneType: "R3+",
        maxHr: 0,
        minHr: 5,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 0,
        maxSpd: 0,
        dateCreated: "2020-10-03T10:11:57.000Z",
      },
      {
        id: 21,
        zoneType: "R5 rst",
        maxHr: 0,
        minHr: 0,
        minPwr: 0,
        maxPwr: 0,
        minSpd: 0,
        maxSpd: 0,
        dateCreated: "2020-10-03T10:11:58.000Z",
      },
    ];

    /* tslint:disable  */
    const trackpoint = [
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:27.973Z",
        seq: 1,
        latitude: 37.413335,
        longitude: -5.99084833,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 0.10000000149011612,
        distance_miles: 0.00006213712014964862,
        distance_km: 0.00010000000149011611,
        distance_yds: 0.10936133146338156,
        heart_rate_bpm: 93,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99084833, 37.413335],
        },
        elapsed_sec: 0,
        elapsed_hhmmss: "00:00:00",
        epoch_ms: 1607675007973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:28.973Z",
        seq: 2,
        latitude: 37.41336333,
        longitude: -5.99079333,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 0.6000000238418579,
        distance_miles: 0.000372822730157044,
        distance_km: 0.0006000000238418579,
        distance_yds: 0.6561680050763975,
        heart_rate_bpm: 91,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99079333, 37.41336333],
        },
        elapsed_sec: 1,
        elapsed_hhmmss: "00:00:01",
        epoch_ms: 1607675008973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:29.973Z",
        seq: 3,
        latitude: 37.41335,
        longitude: -5.99075167,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 6.599999904632568,
        distance_miles: 0.0041010498095078295,
        distance_km: 0.006599999904632568,
        distance_yds: 7.21784766473378,
        heart_rate_bpm: 91,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99075167, 37.41335],
        },
        elapsed_sec: 2,
        elapsed_hhmmss: "00:00:02",
        epoch_ms: 1607675009973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:30.973Z",
        seq: 4,
        latitude: 37.41335833,
        longitude: -5.990745,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 11.199999809265137,
        distance_miles: 0.00695935723454099,
        distance_km: 0.011199999809265136,
        distance_yds: 12.248468732792142,
        heart_rate_bpm: 90,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.990745, 37.41335833],
        },
        elapsed_sec: 3,
        elapsed_hhmmss: "00:00:03",
        epoch_ms: 1607675010973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:31.973Z",
        seq: 5,
        latitude: 37.41337333,
        longitude: -5.99074667,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 15.5,
        distance_miles: 0.009631253479678676,
        distance_km: 0.0155,
        distance_yds: 16.95100612423447,
        heart_rate_bpm: 90,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99074667, 37.41337333],
        },
        elapsed_sec: 4,
        elapsed_hhmmss: "00:00:04",
        epoch_ms: 1607675011973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:32.973Z",
        seq: 6,
        latitude: 37.41339667,
        longitude: -5.990725,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 19.100000381469727,
        distance_miles: 0.011868190008767376,
        distance_km: 0.019100000381469726,
        distance_yds: 20.888014415430582,
        heart_rate_bpm: 91,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.990725, 37.41339667],
        },
        elapsed_sec: 5,
        elapsed_hhmmss: "00:00:05",
        epoch_ms: 1607675012973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:33.973Z",
        seq: 7,
        latitude: 37.41343333,
        longitude: -5.9907,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 24,
        distance_miles: 0.014912908613696015,
        distance_km: 0.024,
        distance_yds: 26.246719160104988,
        heart_rate_bpm: 95,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.9907, 37.41343333],
        },
        elapsed_sec: 6,
        elapsed_hhmmss: "00:00:06",
        epoch_ms: 1607675013973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:34.973Z",
        seq: 8,
        latitude: 37.41347833,
        longitude: -5.99067667,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 30.100000381469727,
        distance_miles: 0.01870327312337805,
        distance_km: 0.030100000381469726,
        distance_yds: 32.91776069714537,
        heart_rate_bpm: 98,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99067667, 37.41347833],
        },
        elapsed_sec: 7,
        elapsed_hhmmss: "00:00:07",
        epoch_ms: 1607675014973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:35.973Z",
        seq: 9,
        latitude: 37.413515,
        longitude: -5.99066333,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 36.099998474121094,
        distance_miles: 0.022431499091630558,
        distance_km: 0.03609999847412109,
        distance_yds: 39.47943840126978,
        heart_rate_bpm: 101,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99066333, 37.413515],
        },
        elapsed_sec: 8,
        elapsed_hhmmss: "00:00:08",
        epoch_ms: 1607675015973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:36.973Z",
        seq: 10,
        latitude: 37.41355,
        longitude: -5.99065833,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 36.099998474121094,
        distance_miles: 0.022431499091630558,
        distance_km: 0.03609999847412109,
        distance_yds: 39.47943840126978,
        heart_rate_bpm: 104,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99065833, 37.41355],
        },
        elapsed_sec: 9,
        elapsed_hhmmss: "00:00:09",
        epoch_ms: 1607675016973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:37.973Z",
        seq: 11,
        latitude: 37.413585,
        longitude: -5.99065167,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 38.5,
        distance_miles: 0.023922790901137355,
        distance_km: 0.0385,
        distance_yds: 42.10411198600175,
        heart_rate_bpm: 105,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99065167, 37.413585],
        },
        elapsed_sec: 10,
        elapsed_hhmmss: "00:00:10",
        epoch_ms: 1607675017973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:38.973Z",
        seq: 12,
        latitude: 37.41361667,
        longitude: -5.990645,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 41.20000076293945,
        distance_miles: 0.025600493594246758,
        distance_km: 0.041200000762939455,
        distance_yds: 45.056868725874295,
        heart_rate_bpm: 107,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.990645, 37.41361667],
        },
        elapsed_sec: 11,
        elapsed_hhmmss: "00:00:11",
        epoch_ms: 1607675018973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:39.973Z",
        seq: 13,
        latitude: 37.41365,
        longitude: -5.990635,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 46.5,
        distance_miles: 0.028893760439036027,
        distance_km: 0.0465,
        distance_yds: 50.85301837270341,
        heart_rate_bpm: 109,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.990635, 37.41365],
        },
        elapsed_sec: 12,
        elapsed_hhmmss: "00:00:12",
        epoch_ms: 1607675019973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:40.973Z",
        seq: 14,
        latitude: 37.41368167,
        longitude: -5.990625,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 51.900001525878906,
        distance_miles: 0.032249165825254826,
        distance_km: 0.051900001525878904,
        distance_yds: 56.75853185244849,
        heart_rate_bpm: 110,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.990625, 37.41368167],
        },
        elapsed_sec: 13,
        elapsed_hhmmss: "00:00:13",
        epoch_ms: 1607675020973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:41.973Z",
        seq: 15,
        latitude: 37.41371167,
        longitude: -5.99061,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 56.900001525878906,
        distance_miles: 0.0353560217864415,
        distance_km: 0.05690000152587891,
        distance_yds: 62.22659834413703,
        heart_rate_bpm: 111,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99061, 37.41371167],
        },
        elapsed_sec: 14,
        elapsed_hhmmss: "00:00:14",
        epoch_ms: 1607675021973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:42.973Z",
        seq: 16,
        latitude: 37.41374333,
        longitude: -5.99059667,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 61,
        distance_miles: 0.03790364272647737,
        distance_km: 0.061,
        distance_yds: 66.71041119860017,
        heart_rate_bpm: 112,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99059667, 37.41374333],
        },
        elapsed_sec: 15,
        elapsed_hhmmss: "00:00:15",
        epoch_ms: 1607675022973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:43.973Z",
        seq: 17,
        latitude: 37.41377333,
        longitude: -5.99058333,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 64.4000015258789,
        distance_miles: 0.040016305728221506,
        distance_km: 0.06440000152587891,
        distance_yds: 70.42869808166985,
        heart_rate_bpm: 113,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99058333, 37.41377333],
        },
        elapsed_sec: 16,
        elapsed_hhmmss: "00:00:16",
        epoch_ms: 1607675023973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:44.973Z",
        seq: 18,
        latitude: 37.41380167,
        longitude: -5.99057,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 67.19999694824219,
        distance_miles: 0.04175614222207445,
        distance_km: 0.06719999694824219,
        distance_yds: 73.49081031085103,
        heart_rate_bpm: 113,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99057, 37.41380167],
        },
        elapsed_sec: 17,
        elapsed_hhmmss: "00:00:17",
        epoch_ms: 1607675024973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:45.973Z",
        seq: 19,
        latitude: 37.41383167,
        longitude: -5.99055833,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 70.5,
        distance_miles: 0.04380666905273204,
        distance_km: 0.0705,
        distance_yds: 77.09973753280839,
        heart_rate_bpm: 113,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99055833, 37.41383167],
        },
        elapsed_sec: 18,
        elapsed_hhmmss: "00:00:18",
        epoch_ms: 1607675025973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:46.973Z",
        seq: 20,
        latitude: 37.41386,
        longitude: -5.99054667,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 73.80000305175781,
        distance_miles: 0.045857195883389636,
        distance_km: 0.07380000305175781,
        distance_yds: 80.70866475476576,
        heart_rate_bpm: 113,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99054667, 37.41386],
        },
        elapsed_sec: 19,
        elapsed_hhmmss: "00:00:19",
        epoch_ms: 1607675026973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:47.973Z",
        seq: 21,
        latitude: 37.41389,
        longitude: -5.990535,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 77.0999984741211,
        distance_miles: 0.04790771797336125,
        distance_km: 0.07709999847412109,
        distance_yds: 84.3175836331158,
        heart_rate_bpm: 113,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.990535, 37.41389],
        },
        elapsed_sec: 20,
        elapsed_hhmmss: "00:00:20",
        epoch_ms: 1607675027973,
      },
      {
        doctype: "trackpoint",
        time: "2020-12-11T08:23:48.973Z",
        seq: 22,
        latitude: 37.41392167,
        longitude: -5.99052667,
        altitude_meters: null,
        altitude_feet: null,
        distance_meters: 80.5999984741211,
        distance_miles: 0.05008251714619192,
        distance_km: 0.0805999984741211,
        distance_yds: 88.14523017729778,
        heart_rate_bpm: 113,
        speed: null,
        cadence: null,
        watts: 0,
        location: {
          type: "Point",
          coordinates: [-5.99052667, 37.41392167],
        },
        elapsed_sec: 21,
        elapsed_hhmmss: "00:00:21",
        epoch_ms: 1607675028973,
      },
    ];

    getTimeInTrainingZone(trainingZones, trackpoint);

    return res.send("ok");
  }
}

export default new TestController();
