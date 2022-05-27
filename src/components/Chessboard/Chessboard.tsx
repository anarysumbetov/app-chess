import { useRef, useState } from "react";
import './Chessboard.css';
import Tile from '../Tile/Tile.tsx';
import Referee from "../../referee/Referee.tsx";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
    image: string;
    x: number;
    y: number;
    type: PieceType;
    team: TeamType;
}

export enum TeamType {
    OPPONENT,
    OUR
}

export enum PieceType {
    PAWN, 
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN, 
    KING
}

const initialBoardState: Piece[] = [];
const pieces: Piece[] = [];

for(let p = 0; p < 2; p++) {
    const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR;
    const type = (teamType === TeamType.OPPONENT) ? "b" : "w";
    const y = (teamType === TeamType.OPPONENT) ? 7 : 0;

    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 0, y, type: PieceType.ROOK, team: teamType });
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 7, y, type: PieceType.ROOK, team: teamType });
    initialBoardState.push({
        image: `assets/images/knight_${type}.png`, 
        x: 1, 
        y, 
        type: PieceType.KNIGHT,
        team: teamType });
    initialBoardState.push({
        image: `assets/images/knight_${type}.png`,
        x: 6, 
        y, 
        type: PieceType.KNIGHT, 
        team: teamType });
    initialBoardState.push({
        image: `assets/images/bishop_${type}.png`, 
        x: 2, 
        y, 
        type: PieceType.BISHOP, 
        team: teamType });
    initialBoardState.push({
        image: `assets/images/bishop_${type}.png`, 
        x: 5, 
        y, 
        type: PieceType.BISHOP, 
        team: teamType });
    initialBoardState.push({image: `assets/images/queen_${type}.png`, x: 3, y, type: PieceType.QUEEN, team: teamType });
    initialBoardState.push({image: `assets/images/king_${type}.png`, x: 4, y, type: PieceType.KING, team: teamType });
}   

for(let i = 0; i < 8; i++) {
    initialBoardState.push({image: "assets/images/pawn_b.png", x: i, y: 6, type: PieceType.PAWN, team: TeamType.OPPONENT })
}

for(let i = 0; i < 8; i++) {
    initialBoardState.push({image: "assets/images/pawn_w.png", x: i, y: 1, type: PieceType.PAWN, team: TeamType.OUR })
}

export default function Chessboard() {
    let board = [];
    
    for(let j = verticalAxis.length - 1; j >= 0; j--){
        for(let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            let image = undefined;

            pieces.forEach((p) => {
                if (p.x === i && p.y === j) {
                    image = p.image;
                }
            });

            board.push(<Tile key={`${j}, ${i}`} image={image} number={number} />);
        }
    }
    return <div id="chessboard">{board}</div>
}