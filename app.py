from flask import Flask, render_template, request, jsonify
import random
import time
import heapq
import json
import os

app = Flask(__name__)

# =============================
# GLOBAL VARIABLES
# =============================

GOAL = [1,2,3,4,5,6,7,8,0]

board = GOAL[:]
initial_board = GOAL[:]

steps = 0
start_time = time.time()

history = []

current_difficulty = "easy"

LEADERBOARD_FILE = "leaderboard.json"


# =============================
# LEADERBOARD FUNCTIONS
# =============================

def load_leaderboard():

    if not os.path.exists(LEADERBOARD_FILE):
        return []

    try:
        with open(LEADERBOARD_FILE,"r") as f:
            return json.load(f)
    except:
        return []


def save_leaderboard(data):

    with open(LEADERBOARD_FILE,"w") as f:
        json.dump(data,f,indent=4)


@app.route("/leaderboard")
def leaderboard():

    return jsonify(load_leaderboard())


@app.route("/save_score", methods=["POST"])
def save_score():

    data = request.json

    leaderboard = load_leaderboard()

    leaderboard.append({

        "name": data["name"],
        "steps": int(data["steps"]),
        "time": int(data["time"]),
        "difficulty": data["difficulty"]

    })

    leaderboard = sorted(
        leaderboard,
        key=lambda x: (x["steps"], x["time"])
    )[:10]

    save_leaderboard(leaderboard)

    return jsonify(success=True)


# =============================
# HEURISTIC
# =============================

def manhattan(state):

    distance = 0

    for i,value in enumerate(state):

        if value != 0:

            goal_index = GOAL.index(value)

            distance += abs(i//3 - goal_index//3) + abs(i%3 - goal_index%3)

    return distance


# =============================
# GET NEIGHBORS
# =============================

def neighbors(state):

    result = []

    zero = state.index(0)

    row, col = zero//3, zero%3

    moves = [(-1,0),(1,0),(0,-1),(0,1)]

    for dr,dc in moves:

        nr = row + dr
        nc = col + dc

        if 0 <= nr < 3 and 0 <= nc < 3:

            new = state[:]

            ni = nr*3 + nc

            new[zero], new[ni] = new[ni], new[zero]

            result.append(new)

    return result


# =============================
# A STAR SOLVER
# =============================

def astar(start):

    pq = []

    heapq.heappush(pq,(manhattan(start),0,start,[]))

    visited = set()

    while pq:

        f,g,state,path = heapq.heappop(pq)

        if state == GOAL:
            return path

        visited.add(tuple(state))

        for n in neighbors(state):

            if tuple(n) not in visited:

                heapq.heappush(
                    pq,
                    (
                        g+1+manhattan(n),
                        g+1,
                        n,
                        path+[n]
                    )
                )

    return []


# =============================
# SHUFFLE BASED ON DIFFICULTY
# =============================

def shuffle_level(level):

    global board, initial_board, steps, start_time, history, current_difficulty

    current_difficulty = level

    difficulty_moves = {

        "easy": 10,
        "medium": 25,
        "hard": 50,
        "expert": 80

    }

    moves = difficulty_moves[level]

    board = GOAL[:]

    for _ in range(moves):

        board = random.choice(neighbors(board))

    initial_board = board[:]

    steps = 0

    history = []

    start_time = time.time()


# =============================
# ROUTES
# =============================

@app.route("/")
def index():

    return render_template("index.html")


@app.route("/shuffle/<level>")
def shuffle(level):

    shuffle_level(level)

    response = jsonify(

        board=board,
        steps=steps,
        time=int(time.time()-start_time),
        md=manhattan(board),
        solved=False

    )

    response.headers["Cache-Control"] = "no-store"

    return response


@app.route("/move", methods=["POST"])
def move():

    global steps, history

    index = request.json["i"]

    zero = board.index(0)

    if abs(zero//3 - index//3) + abs(zero%3 - index%3) == 1:

        history.append(board[:])

        board[zero], board[index] = board[index], board[zero]

        steps += 1

    return jsonify(

        board=board,
        steps=steps,
        time=int(time.time()-start_time),
        md=manhattan(board),
        solved=(board==GOAL)

    )


@app.route("/undo")
def undo():

    global board, steps

    if history:

        board = history.pop()

        steps -= 1

    return jsonify(

        board=board,
        steps=steps,
        time=int(time.time()-start_time),
        md=manhattan(board),
        solved=False

    )


@app.route("/restart")
def restart():

    global board, steps, start_time, history

    board = initial_board[:]

    steps = 0

    history = []

    start_time = time.time()

    return jsonify(

        board=board,
        steps=steps,
        time=0,
        md=manhattan(board),
        solved=False

    )


@app.route("/solve")
def solve():

    path = astar(board)

    states = []

    temp_steps = steps

    temp_time = int(time.time()-start_time)

    for s in path:

        temp_steps += 1

        states.append({

            "board": s,
            "steps": temp_steps,
            "time": temp_time + temp_steps,
            "md": manhattan(s),
            "solved": s == GOAL

        })

    return jsonify(states=states)


# =============================
# START APP
# =============================

if __name__ == "__main__":

    if not os.path.exists(LEADERBOARD_FILE):
        save_leaderboard([])

    shuffle_level("easy")

    app.run(host="0.0.0.0", port=5000, debug=True)