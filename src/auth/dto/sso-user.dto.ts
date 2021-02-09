export default class SSOUserDTO {
  public readonly id: number;
  public readonly email: string;
  public readonly name: string;
  public readonly studentNumber: string;
  public readonly membershipYear: number;
  public readonly avatar: string;
  public readonly isVerified: boolean;
  public readonly isAdmin: boolean;
}
