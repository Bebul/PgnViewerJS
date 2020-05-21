/**
 * Ensure that the div element for the board is empty.
 */
var clearHTML = function(boardId) {
    var divBoard = document.getElementById(boardId);
    var child;
    while (child = divBoard.firstChild) {
        divBoard.removeChild(child);
    }
};

describe("PGN Viewer", function() {
    var pgnv;
    beforeEach(function() {
        clearHTML("b");
    });

    describe("When reading only moves", function() {
        beforeEach(function() {
            clearHTML("b");
            var pgn = "1. e4 e5 2. Nf3 Nc6  3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4 Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6 Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8 23.Bd7+ Kf8 24. Bxe7#";
            pgnView("b", {pgn: pgn, position: "start"});
            pgnv = window.pgnTestRegistry['b'];
        });

        it("should have 47 half-moves", function() {
            expect(pgnv.getPgn().getMoves().length).toEqual(47);
        })
    });

    describe("When reading PGN with headers", function() {
        beforeEach(function() {
            clearHTML("b");
            var pgn = ['[Event "Casual Game"]',
                '[Site "Berlin GER"] [Date "1852.??.??"] [EventDate "?"] [Round "?"]',
                '[Result "1-0"] [White "Adolf Anderssen"] [Black "Jean Dufresne"] [ECO "C52"]',
                '[WhiteElo "?"] [BlackElo "?"] [PlyCount "47"]',
                '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O',
                'd3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4',
                'Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6',
                'Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8',
                '23.Bd7+ Kf8 24. Bxe7#'].join(" ");
            pgnView("b", {pgn: pgn, position: 'start'});
            pgnv = window.pgnTestRegistry['b'];
        });

        it("should have these headers read", function() {
            expect(Object.keys(pgnv.getPgn().getHeaders()).length).toBeGreaterThan(1);
        })

    });
    describe("When reading PGN with comments", function() {
        beforeEach(function() {
            clearHTML("b");
            var pgn = '1. e4 { first comment } e5 { second comment } 2. {now before } Nf3';
            pgnView("b", {pgn: pgn, position: 'start'});
            pgnv = window.pgnTestRegistry['b'];
        });

        it ("should have seen these comments", function() {
            var moves = pgnv.getPgn().getMoves();
            expect(moves[0].commentAfter).toEqual("first comment");
            expect(moves[0].commentBefore).toBeNull();
            expect(moves[1].commentAfter).toEqual("second comment");
            expect(moves[1].commentBefore).toBeNull();
            expect(moves[2].commentBefore).toEqual("now before");
            expect(moves[2].commentAfter).toBeNull();
        });
    });

    describe("When reading PGN with variations", function() {
        beforeEach(function() {
            clearHTML("b");
        });

        it("should understand comments for variation with white", function() {
            pgnView("b", {pgn: "1. d4 ({START} 1. {BEFORE} e4 {AFTER} e5) 1... d5"});
            pgnv = window.pgnTestRegistry['b'];
            var var_first = pgnv.getPgn().getMove(0).variations[0];
            expect(var_first.commentMove).toEqual("START");
            expect(var_first.commentBefore).toEqual("BEFORE");
            expect(var_first.commentAfter).toEqual("AFTER");
            expect(var_first.notation.notation).toEqual("e4");
        })
    });
    describe("When only displaying a board", function() {
        beforeEach(function() {
            clearHTML("b");
            pgnBoard("b",
                {position: 'start', pieceStyle: 'maya', theme: 'blue'});
            pgnv = window.pgnTestRegistry['b'];
        });

        xit ("should have the start position", function() {
            //$('#bInner');
        })
    });

    describe("When opening an editor", function() {
        beforeEach(function() {
            clearHTML("b");
            pgnEdit("b",
                {position: 'start'});
        });

        xit ("should have the start position", function() {
            //
        })
    });

    describe("When making moves in PGN", function() {
        beforeEach(function() {
            clearHTML("b");
            var pgn = "1. e4 e5 2. Nf3 Nc6";
            pgnView("b", {pgn: pgn, position: "start"});
            pgnv = window.pgnTestRegistry['b'];
        });

        xit("should have an additional move", function() {

        })
    })

    describe("When working with base commands", function () {
        it("should return base and board from calling pgnView", function () {
            let res = pgnView('b', { pgn: ''})
            expect(typeof res.base).toBe("object")
            expect(res.base.chess).toBeDefined()
            expect(res.base.getPgn()).toBeDefined()
            expect(res.board).toBeDefined()
        })
        it("should return base and board from calling pgnEdit", function () {
            let res = pgnView('b', { pgn: ''})
            expect(typeof res.base).toBe("object")
            expect(res.base.chess).toBeDefined()
            expect(res.base.getPgn()).toBeDefined()
            expect(res.board).toBeDefined()
        })
        it("should return base and board from calling pgnBoard", function () {
            let res = pgnBoard('b', { pgn: ''})
            expect(typeof res.base).toBe("object")
            expect(res.base.chess).toBeDefined()
            expect(res.base.getPgn()).toBeDefined()
            expect(res.board).toBeDefined()
        })
        it("should return base and board from calling pgnPrint", function () {
            let res = pgnPrint('b', { pgn: ''})
            expect(typeof res).toBe("object")
        })
    })
});