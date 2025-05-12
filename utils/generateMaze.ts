// utils/generateMaze.ts

export function generateMaze(rows: number, cols: number): number[][] {
    const maze = Array.from({ length: rows }, () => Array(cols).fill(1)); // 1 = wall, 0 = path
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  
    const directions = [
      [0, -1], // up
      [0, 1],  // down
      [-1, 0], // left
      [1, 0],  // right
    ];
  
    function shuffle<T>(array: T[]): T[] {
      return [...array].sort(() => Math.random() - 0.5);
    }
  
    function dfs(x: number, y: number) {
      visited[y][x] = true;
      maze[y][x] = 0;
  
      for (const [dx, dy] of shuffle(directions)) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
  
        if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && !visited[ny][nx]) {
          maze[y + dy][x + dx] = 0; // carve path between
          dfs(nx, ny);
        }
      }
    }
  
    // Start DFS at (0, 0)
    dfs(0, 0);
  
    return maze;
  }
  