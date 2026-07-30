import ApiClient from "./api-client";
import { RawApplicationData } from "./models";

export default class RawClient extends ApiClient {

  getRawData() {
    return this.get<RawApplicationData>(
      "/raw",
    );
  }
}

