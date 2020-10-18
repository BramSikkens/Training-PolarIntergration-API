import PolarUserData from "../entity/PolarUserData";
import BaseService from "./BaseService";
import axios from "axios";

export default class PolarUserDataService extends BaseService<PolarUserData> {
  constructor(model: any) {
    super(model);
  }

  async registerUserWithPolar(
    userid: string,
    token: string
  ): Promise<PolarUserData> {
    console.log("userId", userid);
    try {
      const polarResponse = await axios.post(
        "https://www.polaraccesslink.com/v3/users",
        {
          "member-id": userid,
          "Access-Control-Allow-Origin": "*",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const polarResponseData = await polarResponse.data;
      const polarUserData: PolarUserData = new PolarUserData();
      polarUserData.polarUserId = polarResponseData["polar-user-id"];
      polarUserData.memberId = polarResponseData["member-id"];
      polarUserData.registrationdate = polarResponseData["registration-date"];
      polarUserData.firstName = polarResponseData["first-name"];
      polarUserData.lastName = polarResponseData["last-name"];
      polarUserData.birthdate = polarResponseData.birthdate;
      polarUserData.gender = polarResponseData.gender;
      polarUserData.weight = polarResponseData.weight;
      polarUserData.height = polarResponseData.height;

      return polarUserData;
    } catch (err) {
      return err;
    }
  }

  async deRegisterWithPolar(
    polarUser: string,
    token: string
  ): Promise<boolean> {
    try {
      const deleteResponse = await axios.delete(
        "https://www.polaraccesslink.com/v3/users/" + polarUser,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (deleteResponse.status === 204) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
