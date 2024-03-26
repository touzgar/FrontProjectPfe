import { Coach } from "../coach/coach.model";
import { Player } from "../player/player";

export class Team {
  idTeam?: number;
  teamName: string;
  description: string;
  dateCreation: Date | string;
  clubName: string;
  coachName: String;
  coaches: Coach[]; // This should match the structure sent by your backend
  players:Player[];
  leagalefullname: string;
}
