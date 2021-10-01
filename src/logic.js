function info() {
    console.log("INFO")
    const response = {
        apiversion: "1",
        author: "",
        color: "#328da8",
        head: "default",
        tail: "default"
    }
    return response
}

function start(gameState) {
    console.log(`START`)
}

function end(gameState) {
    console.log(`END\n`)
}

function move(gameState) {
    let possibleMoves = {
        left: 1,
        right: 1,
        up: 1,
        down: 1
    }

    const myHead = gameState.you.head
    const boardWidth = (gameState.board.width - 1)
    const boardHeight = (gameState.board.height - 1)
    const myLength = gameState.you.length
    if (gameState.turn == "1") {myLastLength = myLength}
    const snakes = gameState.board.snakes
    const food = gameState.board.food
    const myHealth = gameState.you.health

    if (myHead.x === 0) {
      possibleMoves.left = false
      // console.log(`wall; not left`)
    }
    if (myHead.x === boardWidth) {
      possibleMoves.right = false
      // console.log(`wall; not right`)
    }
    if (myHead.y === 0) {
      possibleMoves.down = false
      // console.log(`wall; not down`)
    }
    if (myHead.y === boardHeight) {
      possibleMoves.up = false
      // console.log(`wall; not up`)
    }
 
    for (let i = 0; i < snakes.length; i++) {
      var snake = snakes[i]

      for (let j = 0; j < snake.length; j++) {
        var snakeBody = snakes[i].body[j]
        
        if ((myHead.x === (snakeBody.x + 1)) && (myHead.y === snakeBody.y)) {
            possibleMoves.left = false
            // console.log(`body; not left`)
        }
        if (myHead.x === (snakeBody.x - 1) && (myHead.y === snakeBody.y)) {
            possibleMoves.right = false
            // console.log(`body; not right`)
        }
        if (myHead.y === (snakeBody.y + 1) && (myHead.x === snakeBody.x)) {
            possibleMoves.down = false
            // console.log(`body; not down`)
        }
        if (myHead.y === (snakeBody.y - 1) && (myHead.x === snakeBody.x)) {
            possibleMoves.up = false
            // console.log(`body; not up`)
        }
      }

      var snakeHead = snake.head
      
      if (((snakeHead.x === (myHead.x - 2)) && (snakeHead.y === myHead.y)) || ((snakeHead.x === (myHead.x - 1)) && ((snakeHead.y === (myHead.y - 1)) || (snakeHead.y === myHead.y + 1)))) {
          possibleMoves.left = false
          // console.log(`head; not left`)
      }
      if (((snakeHead.x === (myHead.x + 2)) && (snakeHead.y === myHead.y)) || ((snakeHead.x === (myHead.x + 1)) && ((snakeHead.y === (myHead.y - 1)) || (snakeHead.y === myHead.y + 1)))) {
          possibleMoves.right = false
          // console.log(`head; not right`)
      }
      if (((snakeHead.y === (myHead.y - 2)) && (snakeHead.x === myHead.x)) || ((snakeHead.y === (myHead.y - 1)) && ((snakeHead.x === (myHead.x - 1)) || (snakeHead.x === myHead.x + 1)))) {
          possibleMoves.down = false
          // console.log(`head; not down`)
      }
      if (((snakeHead.y === (myHead.y + 2)) && (snakeHead.x === myHead.x)) || ((snakeHead.y === (myHead.y + 1)) && ((snakeHead.x === (myHead.x - 1)) || (snakeHead.x === myHead.x + 1)))) {
          possibleMoves.up = false
          // console.log(`head; not up`)
      }
    }

    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    var response = { move: safeMoves[Math.floor(Math.random() * safeMoves.length)], }

    if (myHealth <= 10) {
      var myShortestDistance = Math.sqrt( ((boardWidth)*(boardWidth)) + ((boardHeight)*(boardHeight)) )
      var otherSnakeShortestDistance = myShortestDistance
      var myIndex = 0
      var otherSnakeIndex = 0

      for (let i = 0; i < food.length; i++) {
        var myFoodDistance = Math.sqrt( ((food[i].x - myHead.x)*(food[i].x - myHead.x)) + ((food[i].y - myHead.y)*(food[i].y - myHead.y)) )
        
        if (myFoodDistance < myShortestDistance) {
          myShortestDistance = myFoodDistance
          myIndex = i
        }

        for (let j = 0; j < snakes.length; j++) {
          var otherSnake = snakes[j]
          var otherSnakeHead = otherSnake.head

          if ((otherSnakeHead.x === myHead.x) && (otherSnakeHead.y === myHead.y)) {
            j++
            if (j >= snakes.length) {
              break
            }
            otherSnake = snakes[j]
            otherSnakeHead = otherSnake.head
          }

          var otherSnakeFoodDistance = Math.sqrt( ((food[myIndex].x - otherSnakeHead.x)*(food[myIndex].x - otherSnakeHead.x)) + ((food[myIndex].y - otherSnakeHead.y)*(food[myIndex].y - otherSnakeHead.y)) )

          if (otherSnakeFoodDistance < otherSnakeShortestDistance) {
            otherSnakeShortestDistance = otherSnakeFoodDistance
            otherSnakeIndex = myIndex
          }
        } 
      }

      if ((food.length > 0) && ( (myShortestDistance < otherSnakeShortestDistance) || (otherSnakeIndex != myIndex) )) {
        if (possibleMoves.left && (food[myIndex].x < myHead.x)) {
          response = { move: safeMoves[safeMoves.indexOf('left')], }
          // console.log(`going left`)
        }
        if (possibleMoves.right && (food[myIndex].x > myHead.x)) {
          response = { move: safeMoves[safeMoves.indexOf('right')], }
          // console.log(`going right`)
        }
        if (possibleMoves.up && (food[myIndex].y > myHead.y)) {
          response = { move: safeMoves[safeMoves.indexOf('up')], }
          // console.log(`going up`)
        }
        if (possibleMoves.down && (food[myIndex].y < myHead.y)) {
          response = { move: safeMoves[safeMoves.indexOf('down')], }
          // console.log(`going down`)
        }
      } else {
        const myTail = gameState.you.body[myLength - 1]

        if (possibleMoves.left && (myTail.x < myHead.x)) {
          response = { move: safeMoves[safeMoves.indexOf('left')], }
          // console.log(`going left`)
        }
        if (possibleMoves.right && (myTail.x > myHead.x)) {
          response = { move: safeMoves[safeMoves.indexOf('right')], }
          // console.log(`going right`)
        }
        if (possibleMoves.up && (myTail.y > myHead.y)) {
          response = { move: safeMoves[safeMoves.indexOf('up')], }
          // console.log(`going up`)
        }
        if (possibleMoves.down && (myTail.y < myHead.y)) {
          response = { move: safeMoves[safeMoves.indexOf('down')], }
          // console.log(`going down`)
        }
      }
    } else {
      const myTail = gameState.you.body[myLength - 1]

      if (possibleMoves.left && (myTail.x < myHead.x)) {
        response = { move: safeMoves[safeMoves.indexOf('left')], }
        // console.log(`going left`)
      }
      if (possibleMoves.right && (myTail.x > myHead.x)) {
        response = { move: safeMoves[safeMoves.indexOf('right')], }
        // console.log(`going right`)
      }
      if (possibleMoves.up && (myTail.y > myHead.y)) {
        response = { move: safeMoves[safeMoves.indexOf('up')], }
        // console.log(`going up`)
      }
      if (possibleMoves.down && (myTail.y < myHead.y)) {
        response = { move: safeMoves[safeMoves.indexOf('down')], }
        // console.log(`going down`)
      }
    }
    
    console.log(`MOVE ${gameState.turn}: ${response.move}`)
    return response
}

module.exports = {
    info: info,
    start: start,
    move: move,
    end: end
}
