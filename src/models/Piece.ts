// import { TeamType, PieceType } from "../Types.ts";
import { Position } from "./Position.ts";
import { TeamType, PieceType } from "../Constants.ts";

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    team: TeamType;
    enPassant?: boolean;
    possibleMoves?: Position[];
    constructor(position: Position, type: PieceType, team: TeamType) {
        this.image = require(`../images/${type}_${team}.png`);
        this.position = position;
        this.type = type;
        this.team = team;
    }
}