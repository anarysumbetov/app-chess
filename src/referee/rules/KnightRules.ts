import { Position, TeamType } from "../../Constants.ts";
import { Piece } from "../../models/Piece.ts";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules.ts";

export const knightMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    for (let i = -1; i < 2; i+=2) {
        for (let j = -1; j < 2; j+=2) {
            //TOP AND BOTTOM SIDE MOVEMENT
            if (desiredPosition.y - initialPosition.y === 2 * i) {
                if (desiredPosition.x - initialPosition.x === j) {
                    if (tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                        return true;
                    }
                }
            }

            //RIGHT AND LEFT SIDE MOVEMENT
            if (desiredPosition.x - initialPosition.x === 2 * i) {
                if (desiredPosition.y - initialPosition.y === j) {
                    if (tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

export const getPossibleKnightMoves = (knight: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];

    for (let i = -1; i < 2; i+=2) {
        for (let j = -1; j < 2; j+=2) {
            const verticalMove: Position = {x: knight.position.x + j, y: knight.position.y + i * 2};
            const horizontalMove: Position = {x: knight.position.x + i * 2, y: knight.position.y + j};

            if (tileIsEmptyOrOccupiedByOpponent(verticalMove, boardState, knight.team)) {
                possibleMoves.push(verticalMove);
            }

            if (tileIsEmptyOrOccupiedByOpponent(horizontalMove, boardState, knight.team)) {
                possibleMoves.push(horizontalMove);
            }
        }
    }

    return possibleMoves;
}