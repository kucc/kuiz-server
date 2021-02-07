export class KUCCRequestDTO{

  constructor(email: string, name: string){
    this.email = email;
    this.name = name;
  }
  public email:string;
  public name: string;
}