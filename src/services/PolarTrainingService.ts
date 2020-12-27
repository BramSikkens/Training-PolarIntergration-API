import axios from "axios";
import xmlJs from "xml-js";
import * as fs from "fs";
import { Parser } from "tcx-js";
import { getTimeInTrainingZone } from "../helpers/PolarUtils";

class PolarTrainingService {
  // constructor() {}

  async checkAvailableTrainings(): Promise<any> {
    // Check For new Data
    const pullDataRequest = await axios.get(
      "https://www.polaraccesslink.com/v3/notifications",
      {
        headers: {
          Authorization:
            "Basic Y2M4NDEwN2YtMDNjZi00YjgxLWEzYTMtNzhlOTc1Mjk5ZTU5OmY2M2NmYWU4LTRhOWYtNDJhYi05ZGMxLTY2ZWFhZmJiZDZjNQ==",
        },
      }
    );

    // CHECK FOR EXERCISES
    const availableTrainings = await pullDataRequest.data[
      "available-user-data"
    ].filter((data: any) => data["data-type"] === "EXERCISE")[0];

    if (availableTrainings) {
      return availableTrainings.url;
    } else {
      return false;
    }
  }

  async setupTransaction(transactionUrl: string, userAccessToken: string) {
    try {
      const transactionRequest = await axios.post(transactionUrl, null, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + userAccessToken,
        },
      });

      return await transactionRequest.data["resource-uri"];
    } catch (err) {
      console.log(err);
    }
  }

  async completeTransaction(url: string, userAccessToken: string) {
    const transactionCommitRequest = await axios.put(url, null, {
      headers: {
        Authorization: "Bearer " + userAccessToken,
      },
    });

    const transactionCommit = await transactionCommitRequest.data;
    return transactionCommit;
  }

  async getAvailableTrainingUrls(url: string, userAccessToken: string) {
    const availableTrainingUriRequest = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + userAccessToken,
      },
    });
    const exerciseUrls = await availableTrainingUriRequest.data.exercises;
    return exerciseUrls;
  }

  async fetchTrainingFromUrls(urls: string[], userAccessToken: string) {
    const newTrainings: any[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < urls.length; i++) {
      // get TrainingData
      let exerciseData = await this.fetchPolarTraining(
        urls[i],
        userAccessToken
      );

      const heartRateData = await this.fetchHeartRateDataFromPolarTraining(
        urls[i],
        userAccessToken
      );

      const TCXData = await this.fetchTCXFromPolarTraining(
        urls[i],
        userAccessToken
      );

      // add HeartRateData
      exerciseData = {
        ...exerciseData,
        hrData: heartRateData,
        tcx: TCXData,
      };
      // addGPSData
      // exerciseData.gps = await this.fetchGPSDataFromPolarTraining(
      //   urls[i],
      //   userAccessToken
      // );
      newTrainings.push(exerciseData);
    }

    return newTrainings;
  }

  async fetchPolarTraining(url: string, userAccessToken: string) {
    const newExerciseRequest = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + userAccessToken,
      },
    });
    const exerciseData = await newExerciseRequest.data;
    return exerciseData;
  }

  async fetchTCXFromPolarTraining(url: string, userAccessToken: string) {
    const TCXRequest = await axios.get(url + "/tcx", {
      headers: {
        Accept: "application/vnd.garmin.tcx+xml",
        Authorization: "Bearer " + userAccessToken,
      },
    });

    const txcData = await TCXRequest.data;

    const tcxJSon = JSON.parse(
      xmlJs.xml2json(txcData, {
        compact: true,
        ignoreDoctype: true,
        ignoreComment: true,
      })
    );

    const newParser = new Parser(txcData);
    const TrackPoints = newParser.activity.trackpoints;

    return TrackPoints;
  }

  async fetchGPSDataFromPolarTraining(url: string, userAccessToken: string) {
    const newExerciseGPSRequest = await axios.get(url + "/gpx", {
      headers: {
        Accept: "application/gpx+xml",
        Authorization: "Bearer " + userAccessToken,
      },
    });

    const gpsData = await newExerciseGPSRequest.data;
    return xmlJs.xml2json(gpsData, {
      compact: true,
      ignoreDoctype: true,
      ignoreComment: true,
    });
  }

  async fetchHeartRateDataFromPolarTraining(
    url: string,
    userAccessToken: string
  ) {
    const newExercisHeartRatesRequest = await axios.get(
      url + "/heart-rate-zones",
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + userAccessToken,
        },
      }
    );

    return await newExercisHeartRatesRequest.data;
  }
}

export default new PolarTrainingService();
