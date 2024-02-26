import { EGender } from "src/domain/entities";

export class ICharacterOwner {
  name: string;
  picture?: string;
}

export class IGetCharacters {
  name: string;
  age: number;
  gender: EGender;
  picture?: string;
  owner?: ICharacterOwner;
}
