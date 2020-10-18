import PolarAuthorisation from "../entity/PolarAuthorisation";
import BaseService from "./BaseService";
import axios from "axios";
import qs from "qs";
import PolarUserData from "../entity/PolarUserData";

export default class PolarAuthorisationService extends BaseService<
  PolarAuthorisation
> {
  constructor(model: any) {
    super(model);
  }

  async receiveUserTokenFromPolar(
    authorisationCode: string
  ): Promise<PolarAuthorisation> {
    const AuthorizationString =
      "Basic " +
      Buffer.from(
        "cc84107f-03cf-4b81-a3a3-78e975299e59:f63cfae8-4a9f-42ab-9dc1-66eaafbbd6c5"
      ).toString("base64");

    try {
      const response = await axios.post(
        "https://polarremote.com/v2/oauth2/token",
        qs.stringify({
          code: authorisationCode,
          grant_type: "authorization_code",
        }),
        {
          headers: {
            Authorization: AuthorizationString,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json;charset=UTF-8",
          },
        }
      );
      const data = await response.data;
      const newToken: PolarAuthorisation = new PolarAuthorisation();
      newToken.accessToken = data.access_token;
      newToken.expiresIn = data.expires_in;
      newToken.tokenType = data.token_type;
      newToken.xUserId = data.x_user_id;

      return newToken;
    } catch (err) {
      console.log(err);
    }
  }
}
