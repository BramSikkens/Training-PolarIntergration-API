import axios from "axios";
import xmlJs from "xml-js";

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
    await Promise.all(
      urls &&
        urls.map(async (url: any) => {
          // get TrainingData
          const exerciseData = await this.fetchPolarTraining(
            url,
            userAccessToken
          );
          // add HeartRateData
          exerciseData.heartRateZones = await JSON.stringify(
            this.fetchHeartRateDataFromPolarTraining(url, userAccessToken)
          );
          // addGPSData
          exerciseData.gps = this.fetchGPSDataFromPolarTraining(
            url,
            userAccessToken
          );

          newTrainings.push(exerciseData);
        })
    );

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