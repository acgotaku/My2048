function showNumberWithAnimation( i , j , randNumber ){

    var numberCell = $('#number-cell-' + i + "-" + j );

    numberCell.css('background-color',support2048.getNumberBackgroundColor( randNumber ) );
    numberCell.css('color',support2048.getNumberColor( randNumber ) );
    numberCell.text( randNumber );

    numberCell.animate({
        width:"100px",
        height:"100px",
        top:support2048.getPosTop( i , j ),
        left:support2048.getPosLeft( i , j )
    },50);
}
function showMoveAnimation( fromx , fromy , tox, toy ){

    var numberCell = $('#number-cell-' + fromx + '-' + fromy );
    numberCell.animate({
        top:support2048.getPosTop( tox , toy ),
        left:support2048.getPosLeft( tox , toy )
    },200);
}
