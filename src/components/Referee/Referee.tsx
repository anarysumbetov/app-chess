import { useRef, useState, useEffect } from "react";
import { initialBoard } from "../../Constants.ts";

import { pawnMove, knightMove, bishopMove, rookMove, queenMove, kingMove } from "../../referee/rules/index.ts";
import Chessboard from "../Chessboard/Chessboard.tsx";
import { Piece, Position } from "../../models";
import { PieceType, TeamType } from "../../Types.ts";
import { Pawn } from "../../models/Pawn.ts";
import { Board } from "../../models/Board.ts";

export default function Referee() {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line
    useEffect(() => {
        updatePossibleMoves();
    }, []);

    function updatePossibleMoves() {
        board.calculateAllMoves()
    }

    function playMove(playedPiece: Piece, destination: Position) : boolean {
        let playedMoveIsValid = false;

        const validMove = isValidMove(
            playedPiece.position,
            destination,
            playedPiece.type, 
            playedPiece.team
        );

        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team
        );

        // playMove modifies the board thus we
        // need to call setBoard
        setBoard(() => {
            const clonedBoard = board.clone();
            
            // Playing the move
            playedMoveIsValid = clonedBoard.playMove(
                enPassantMove, 
                validMove, 
                playedPiece, 
                destination
            );

            return clonedBoard;
        })

        // This is for promoting a pawn
        let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn((previousPromotionPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;            
            });
        }

        return playedMoveIsValid;
    }

    function isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType, 
        team: TeamType,
        ) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if(type === PieceType.PAWN) {
            if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
                const piece = board.pieces.find(
                    (p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.isPawn && (p as Pawn).enPassant
                );
                if(piece) {
                    return true;
                }
            }
        }

        return false;
    }

    //TODO
    //Pawn promotion!
    //Prevent the king from moving into danger!
    //Add castling!
    //Add check!
    //Add checkmate!
    //Add stalemate!
    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);
        }

        return validMove;
    }

    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }

        setBoard(() => {
            const clonedBoard = board.clone();

            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team));
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[])

            clonedBoard.calculateAllMoves();

            return clonedBoard;
        })
        
        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
    }

    return (
        <>
            <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
                <div className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)} src={require(`../../images/rook_${promotionTeamType()}.png`)} alt="rook" />
                    <img onClick={() => promotePawn(PieceType.BISHOP)} src={require(`../../images/bishop_${promotionTeamType()}.png`)} alt="bishop" />
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} src={require(`../../images/knight_${promotionTeamType()}.png`)} alt="knight" />
                    <img onClick={() => promotePawn(PieceType.QUEEN)} src={require(`../../images/queen_${promotionTeamType()}.png`)} alt="queen" />
                </div>
            </div>
            <Chessboard playMove={playMove} pieces={board.pieces} />
        </>
    )
}