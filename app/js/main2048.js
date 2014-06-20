/**
 * Created by acgotaku on 14-6-18.
 */
var board = new Array();
var score = 0;
$(function() {
    var My2048 = {
        board: new Array(),
        init: function() {
            var self = this;
            for (var i = 0; i < 4; i ++)
                for (var j = 0; j < 4; j++) {
                    var gridCell = $('#grid-cell-' + i + "-" + j);
                    gridCell.css('top', support2048.getPosTop(i, j));
                    gridCell.css('left', support2048.getPosLeft(i, j));
                }
            for (var i = 0; i < 4; i++) {
                board[i] = new Array();
                for (var j = 0; j < 4; j++) {
                    board[i][j] = 0;
                }
            }
            self.updateBoardView();
            self.generateOneNumber();
            self.generateOneNumber();
            self.bindKey();
            $("#start").click(function() {
                self.newGame();
            });
        },
        newGame: function() {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    board[i][j] = 0;
                }
            }
            $(".game-message").removeClass("game-over")
            this.updateBoardView();
            this.generateOneNumber();
            this.generateOneNumber();
        },
        updateBoardView: function() {
            $(".number-cell").remove();
            for (var i = 0; i < 4; i ++)
                for (var j = 0; j < 4; j++) {
                    $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
                    var theNumberCell = $('#number-cell-' + i + '-' + j);

                    if (board[i][j] == 0) {
                        theNumberCell.css('width', '0px');
                        theNumberCell.css('height', '0px');
                        theNumberCell.css('top', support2048.getPosTop(i, j) + 50);
                        theNumberCell.css('left', support2048.getPosLeft(i, j) + 50);
                    }
                    else {
                        theNumberCell.css('width', '100px');
                        theNumberCell.css('height', '100px');
                        theNumberCell.css('top', support2048.getPosTop(i, j));
                        theNumberCell.css('left', support2048.getPosLeft(i, j));
                        theNumberCell.css('background-color', support2048.getNumberBackgroundColor(board[i][j]));
                        theNumberCell.css('color', support2048.getNumberColor(board[i][j]));
                        theNumberCell.text(board[i][j]);
                    }
                }
        },
        generateOneNumber: function() {
            if (support2048.nospace(board))
                return false;

            //随机一个位置
            var randx = parseInt(Math.floor(Math.random() * 4));
            var randy = parseInt(Math.floor(Math.random() * 4));

            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (board[randx][randy] == 0)
                        break;

                    randx = parseInt(Math.floor(Math.random() * 4));
                    randy = parseInt(Math.floor(Math.random() * 4));
                }
            }


            //随机一个数字
            var randNumber = Math.random() < 0.5 ? 2 : 4;

            //在随机位置显示随机数字
            board[randx][randy] = randNumber;
            showNumberWithAnimation(randx, randy, randNumber);

            return true;
        },
        bindKey: function() {
            var self = this;
            $(document).keydown(function(event) {
                switch (event.keyCode) {
                    case 37://left
                        if (self.moveLeft()) {
                            setTimeout(self.generateOneNumber.bind(self),210);
                            setTimeout(self.isGameOver.bind(self),360);
                        }
                        break;
                    case 38://up
                        if (self.moveUp()) {
                            setTimeout(self.generateOneNumber.bind(self),210);
                            setTimeout(self.isGameOver.bind(self),360);
                        }
                        break;
                    case 39: //right
                        if (self.moveRight()) {
                            setTimeout(self.generateOneNumber.bind(self),210);
                            setTimeout(self.isGameOver.bind(self),360);
                        }
                        break;
                    case 40: //down
                        if (self.moveDown()) {
                            setTimeout(self.generateOneNumber.bind(self),210);
                            setTimeout(self.isGameOver.bind(self),360);
                        }
                        break;
                    default:
                        break;
                }
            });
        },
        moveLeft: function() {
            if (!support2048.canMoveLeft(board)) {
                return false;
            }
            for (var i = 0; i < 4; i ++)
                for (var j = 1; j < 4; j++)
                {
                    if (board[i][j] != 0) {
                        for (var k = 0; k < j; k++) {
                            if (board[i][k] == 0 && support2048.noBlockHorizontal(i, k, j, board)) {
                                //move
                                showMoveAnimation(i, j, i, k);
                                board[i][k] = board[i][j];
                                board[i][j] = 0;
                                continue;
                            }
                            else if (board[i][k] == board[i][j] && support2048.noBlockHorizontal(i, k, j, board)) {
                                //move
                                showMoveAnimation(i, j, i, k);
                                //add
                                board[i][k] += board[i][j];
                                board[i][j] = 0;

                                continue;
                            }
                        }
                    }
                }
            setTimeout(this.updateBoardView.bind(this),200);
            return true;
        },
        moveRight: function() {
            if (!support2048.canMoveRight(board)) {
                return false;
            }
            for (var i = 0; i < 4; i ++)
                for (var j = 2; j >= 0; j--)
                {
                    if (board[i][j] != 0) {
                        for (var k = 3; k > j; k--) {
                            if (board[i][k] == 0 && support2048.noBlockHorizontal(i, k, j, board)) {
                                //move
                                showMoveAnimation(i, j, i, k);
                                board[i][k] = board[i][j];
                                board[i][j] = 0;
                                continue;
                            }
                            else if (board[i][k] == board[i][j] && support2048.noBlockHorizontal(i, k, j, board)) {
                                //move
                                showMoveAnimation(i, j, i, k);
                                //add
                                board[i][k] += board[i][j];
                                board[i][j] = 0;

                                continue;
                            }
                        }
                    }
                }
            setTimeout(this.updateBoardView.bind(this),200);
            return true;
        },
        moveUp: function() {
            if (!support2048.canMoveUp(board)) {
                return false;
            }
            for (var j = 0; j < 4; j ++)
                for (var i = 1; i < 4; i++)
                {
                    if (board[i][j] != 0) {
                        for (var k = 0; k < i; k++) {
                            if( board[k][j] == 0 && support2048.noBlockVertical( j , k , i , board ) ){
                                //move
                                showMoveAnimation(i, j, k, j);
                                board[k][j] = board[i][j];
                                board[i][j] = 0;
                                continue;
                            }
                            else if( board[k][j] == board[i][j] && support2048.noBlockVertical( j , k , i , board ) ){
                                //move
                                showMoveAnimation(i, j, k, j);
                                //add
                                board[k][j] *=2;
                                board[i][j] = 0;

                                continue;
                            }
                        }
                    }
                }
            setTimeout(this.updateBoardView.bind(this),200);
            return true;
        },
        moveDown: function() {
            if (!support2048.canMoveDown(board)) {
                return false;
            }
            for (var j = 0; j < 4; j ++)
                for (var i = 2; i >= 0; i--)
                {
                    if (board[i][j] != 0) {
                        for (var k = 3; k > i; k--) {
                            if( board[k][j] == 0 && support2048.noBlockVertical( j , k , i , board ) ){
                                //move
                                showMoveAnimation(i, j, k, j);
                                board[k][j] = board[i][j];
                                board[i][j] = 0;
                                continue;
                            }
                            else if( board[k][j] == board[i][j] && support2048.noBlockVertical( j , k , i , board ) ){
                                //move
                                showMoveAnimation(i, j, k, j);
                                //add
                                board[k][j] *=2;
                                board[i][j] = 0;

                                continue;
                            }
                        }
                    }
                }
            setTimeout(this.updateBoardView.bind(this),200);
            return true;
        },
        isGameOver: function() {
            if(support2048.nomove(board)){
                this.GameOver();
            }
        },
        GameOver:function(){
            if(!$(".game-message").hasClass("game-over")){
                $(".game-message").addClass("game-over");
            }
        }
    };
    My2048.init();
});
