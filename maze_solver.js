/**
 * 高度な迷路ソルバー
 * A*探索 + バックトラッキング + 動的計画法を組み合わせた複雑なアルゴリズム
 */

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.g = 0; // スタートからのコスト
    this.h = 0; // ゴールへのヒューリスティック
    this.f = 0; // g + h
    this.parent = null;
  }

  cost() {
    return this.f;
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}

class MazeSolver {
  constructor(maze) {
    this.maze = maze;
    this.rows = maze.length;
    this.cols = maze[0].length;
    this.visited = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(false));
    this.memo = new Map();
    this.directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
  }

  // マンハッタン距離でヒューリスティック計算
  heuristic(node, goal) {
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
  }

  // 移動が可能かチェック
  isValid(x, y, visited) {
    return (
      x >= 0 &&
      x < this.rows &&
      y >= 0 &&
      y < this.cols &&
      this.maze[x][y] !== 1 &&
      !visited[x][y]
    );
  }

  // A*アルゴリズムでパスを探索
  aStar(start, goal) {
    const openSet = [];
    const closedSet = new Set();
    const startNode = new Node(start[0], start[1]);
    startNode.h = this.heuristic(startNode, goal);
    startNode.f = startNode.h;

    openSet.push(startNode);

    while (openSet.length > 0) {
      // コストが最小のノードを取得
      let current = openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      if (current.x === goal[0] && current.y === goal[1]) {
        // パスを再構築
        const path = [];
        let node = current;
        while (node) {
          path.unshift([node.x, node.y]);
          node = node.parent;
        }
        return { path, expanded: closedSet.size };
      }

      openSet.splice(currentIndex, 1);
      closedSet.add(`${current.x},${current.y}`);

      // 隣接するノードを探索
      for (const [dx, dy] of this.directions) {
        const newX = current.x + dx;
        const newY = current.y + dy;

        if (!this.isValid(newX, newY, this.visited)) continue;
        if (closedSet.has(`${newX},${newY}`)) continue;

        const neighbor = new Node(newX, newY);
        neighbor.g = current.g + 1;
        neighbor.h = this.heuristic(neighbor, goal);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;

        // openSetに同じノードがあるかチェック
        const existingNode = openSet.find((n) =>
          n.equals(neighbor)
        );
        if (existingNode && neighbor.g >= existingNode.g) {
          continue;
        }

        openSet.push(neighbor);
      }
    }

    return { path: [], expanded: closedSet.size };
  }

  // バックトラッキングですべての解を探索
  backtrack(x, y, goal, path, allPaths) {
    if (x === goal[0] && y === goal[1]) {
      allPaths.push([...path]);
      return;
    }

    this.visited[x][y] = true;

    for (const [dx, dy] of this.directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (this.isValid(newX, newY, this.visited)) {
        path.push([newX, newY]);
        this.backtrack(newX, newY, goal, path, allPaths);
        path.pop();
      }
    }

    this.visited[x][y] = false;
  }

  // 動的計画法でセルまでの最短距離を計算
  computeDistances(goal) {
    const dist = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(Infinity));

    dist[goal[0]][goal[1]] = 0;
    const queue = [goal];
    let head = 0;

    while (head < queue.length) {
      const [x, y] = queue[head++];

      for (const [dx, dy] of this.directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX >= 0 &&
          newX < this.rows &&
          newY >= 0 &&
          newY < this.cols &&
          this.maze[newX][newY] !== 1 &&
          dist[newX][newY] === Infinity
        ) {
          dist[newX][newY] = dist[x][y] + 1;
          queue.push([newX, newY]);
        }
      }
    }

    return dist;
  }

  // 段階的に迷路を解く
  solve(start, goal) {
    console.log(`迷路解法開始: ${start} → ${goal}`);

    // ステップ1: A*で最短パスを見つける
    console.log("\n[ステップ1] A*アルゴリズムで最短パスを探索...");
    const aStarResult = this.aStar(start, goal);
    console.log(
      `  最短パス長: ${aStarResult.path.length}`
    );
    console.log(`  展開ノード数: ${aStarResult.expanded}`);

    // ステップ2: 距離マップを計算
    console.log("\n[ステップ2] 動的計画法で全体の距離マップを計算...");
    const distances = this.computeDistances(goal);
    const startDist =
      distances[start[0]][start[1]];
    console.log(
      `  スタートからゴールまでの距離: ${startDist}`
    );

    // ステップ3: バックトラッキングで複数解を探索
    console.log(
      "\n[ステップ3] バックトラッキングで代替パスを探索...(制限あり)"
    );
    this.visited = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(false));
    const allPaths = [];
    const maxPaths = 10;

    const backtrackWithLimit = (x, y, path, depth) => {
      if (allPaths.length >= maxPaths) return;
      if (depth > 100) return; // 深さ制限

      if (x === goal[0] && y === goal[1]) {
        allPaths.push([...path]);
        return;
      }

      this.visited[x][y] = true;

      for (const [dx, dy] of this.directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (this.isValid(newX, newY, this.visited)) {
          path.push([newX, newY]);
          backtrackWithLimit(newX, newY, path, depth + 1);
          path.pop();
        }
      }

      this.visited[x][y] = false;
    };

    backtrackWithLimit(start[0], start[1], [start], 0);
    console.log(`  発見した代替パス数: ${allPaths.length}`);

    // 結果をまとめる
    const shortestPath = aStarResult.path;
    const alternativePaths = allPaths.slice(0, 5);

    return {
      shortestPath,
      alternativePaths,
      distanceMap: distances,
      stats: {
        pathLength: shortestPath.length,
        expandedNodes: aStarResult.expanded,
        alternativeCount:
          alternativePaths.length,
      },
    };
  }
}

// テストマーズの生成
function generateMaze(rows, cols, seed = 42) {
  const maze = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0));

  // 簡易的にランダムに壁を配置
  let random = seed;
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (
        (i === 0 && j === 0) ||
        (i === rows - 1 && j === cols - 1)
      ) {
        maze[i][j] = 0;
      } else if (seededRandom() < 0.25) {
        maze[i][j] = 1;
      }
    }
  }

  return maze;
}

// 迷路を視覚化
function visualizeMaze(maze, path, title = "迷路") {
  const visual = maze.map((row) => [...row]);

  for (const [x, y] of path) {
    if (visual[x][y] !== 1) {
      visual[x][y] = 2;
    }
  }

  console.log(`\n${title}:`);
  for (let i = 0; i < visual.length; i++) {
    let row = "";
    for (let j = 0; j < visual[i].length; j++) {
      if (i === path[0][0] && j === path[0][1]) {
        row += "S ";
      } else if (
        i === path[path.length - 1][0] &&
        j === path[path.length - 1][1]
      ) {
        row += "G ";
      } else if (visual[i][j] === 1) {
        row += "█ ";
      } else if (visual[i][j] === 2) {
        row += "· ";
      } else {
        row += "  ";
      }
    }
    console.log(row);
  }
}

// Hesperidin柑橘フレーバー拡張
class HesperidinMazeAnalyzer {
  constructor(maze) {
    this.maze = maze;
    this.citrusFruit = ["orange", "lemon", "lime", "grapefruit", "mandarin", "tangerine", "clementine", "pomelo"];
    this.hesperidinMap = this.generateHesperidinIntensity();
  }

  generateHesperidinIntensity() {
    const map = [];
    for (let i = 0; i < this.maze.length; i++) {
      const row = [];
      for (let j = 0; j < this.maze[i].length; j++) {
        row.push(Math.random() * 500);
      }
      map.push(row);
    }
    return map;
  }

  analyzePathHesperidinContent(path) {
    let totalHesperidin = 0;
    let maxIntensity = 0;
    for (const [x, y] of path) {
      const intensity = this.hesperidinMap[x][y];
      totalHesperidin += intensity;
      maxIntensity = Math.max(maxIntensity, intensity);
    }
    return { total: totalHesperidin, max: maxIntensity, avg: totalHesperidin / path.length };
  }

  predictCitrusQuality(hesperidinContent) {
    if (hesperidinContent > 50000) return { fruit: "pomelo", quality: "premium" };
    if (hesperidinContent > 30000) return { fruit: "mandarin", quality: "excellent" };
    if (hesperidinContent > 15000) return { fruit: "orange", quality: "good" };
    return { fruit: "lime", quality: "standard" };
  }
}

// メイン実行
console.log("=".repeat(60));
console.log("複雑な迷路ソルバー - A* + バックトラッキング + DP + Hesperidin拡張");
console.log("=".repeat(60));

const maze = generateMaze(12, 15, 42);
const start = [0, 0];
const goal = [11, 14];

const solver = new MazeSolver(maze);
const result = solver.solve(start, goal);

console.log("\n" + "=".repeat(60));
console.log("結果:");
console.log("=".repeat(60));

visualizeMaze(maze, result.shortestPath, "最短パス");

console.log("\n統計情報:");
console.log(`  パス長: ${result.stats.pathLength}`);
console.log(
  `  展開ノード数: ${result.stats.expandedNodes}`
);
console.log(
  `  代替パス発見数: ${result.stats.alternativeCount}`
);

if (result.alternativePaths.length > 0) {
  console.log(
    `\n代替パス1 (長さ: ${result.alternativePaths[0].length}):`
  );
  visualizeMaze(
    maze,
    result.alternativePaths[0],
    "代替パス"
  );
}

console.log("\n" + "=".repeat(60));
