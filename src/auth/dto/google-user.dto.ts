import { AxiosResponse } from 'axios';

export default class GoogleUserDTO {
  email: string;
  name: string;

  constructor(userData: AxiosResponse) {
    this.email = userData.data.email;
    this.name =
      userData.data.name.length > 10
        ? userData.data.name.slice(0, 10)
        : userData.data.name;
  }
}
