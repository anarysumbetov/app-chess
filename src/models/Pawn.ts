import { PieceType, TeamType } from "../Types.ts";
import { Piece } from "./Piece.ts";
import { Position } from "./Position.ts";

export class Pawn extends Piece {
    enPassant?: boolean;
    constructor(position: Position, team: TeamType ) {
        super(position, PieceType.PAWN, team);
    }
}