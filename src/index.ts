import "./style.css";

declare global {
  interface Window {
    mouseX: Number;
    mouseY: Number;
  }
}

// variables
let startCoords: string = `${Math.floor(Math.random() * 24) + 1}:${
  Math.floor(Math.random() * 24) + 1
}`;

let endCoords: string = `${Math.floor(Math.random() * 24) + 1}:${
  Math.floor(Math.random() * 24) + 1
}`;

let mouseIsDown: boolean = false;

let nodeType: string = "barrier";

// functions
function changeInfoText(text: string) {
  const panel = document.querySelector(".controlpanel");

  if (panel) {
    panel.childNodes[4].textContent = `${text}`;
  }
  nodeType = `${text}`;
}

function StartEndNodeBehaviour(
  cell: HTMLTableCellElement,
  nodes: Array<string>,
  modifier?: string
) {
  let node: HTMLElement | null = document.getElementById(
    modifier == "start" ? startCoords : endCoords
  );

  if (node) {
    if (nodes[0] == "cell" && nodes[1] == undefined) {
      node.classList.replace(modifier == "start" ? "start" : "end", "cell");
      cell.classList.add(modifier == "start" ? "start" : "end");
      // console.log(`${cell.id}`);
      modifier == "start" ? (startCoords = cell.id) : (endCoords = cell.id);
    } else if (nodes[1] != undefined) {
      nodeType = nodes[1];
      changeInfoText(nodes[1]);
    }
  }
}

function setBarrier(ev: any) {
  const cell: HTMLTableDataCellElement = ev.path[0];

  const nodes = cell.className.split(" "); // classname = 'cell barrier|end|start|null'

  if (mouseIsDown) {
    // prevent drawing barrier on end or start cell
    if (nodes[0] == "cell" && nodes[1] != "end" && nodes[1] != "start") {
      ev.target.classList.toggle("barrier");
    }
  }
}

function removeFromOpenList(
  openList: Array<HTMLTableCellElement>,
  current: HTMLTableCellElement
) {
  for (let i = openList.length; i >= 0; i--) {
    if (openList[i] == current) {
      openList.splice(i, 1);
    }
  }
}

function addNeighbours(currentNode: HTMLTableCellElement): string {
  // const currentNode = document.getElementById(startCoords);
  let x: number = parseInt(currentNode.id.split(":")[0]);
  let y: number = parseInt(currentNode.id.split(":")[1]);

  if (currentNode) {
    // console.log(`tworzymy sasiadow dla `);
    // console.log(currentNode);

    // console.log(currentNode.id);
    currentNode.setAttribute(
      "neighbours",
      JSON.stringify({
        left: `${x - 1}:${y}`,
        right: `${x + 1}:${y}`,
        top: `${x}:${y - 1}`,
        bottom: `${x}:${y + 1}`,
      })
    );
    // console.log(
    //   JSON.stringify({
    //     left: `${x - 1}:${y}`,
    //     right: `${x + 1}:${y}`,
    //     top: `${x}:${y - 1}`,
    //     bottom: `${x}:${y + 1}`,
    //   })
    // );
  }
  return JSON.stringify({
    left: `${x - 1}:${y}`,
    right: `${x + 1}:${y}`,
    top: `${x}:${y - 1}`,
    bottom: `${x}:${y + 1}`,
  });
}

function heuristic(
  neighbour: HTMLTableCellElement,
  endNode: HTMLTableCellElement
): number {
  const neighbourX: number = parseInt(neighbour.id.split(":")[0]);
  const neighbourY: number = parseInt(neighbour.id.split(":")[1]);

  const endNodeX: number = parseInt(endNode.id.split(":")[0]);
  const endNodeY: number = parseInt(endNode.id.split(":")[1]);
  // console.log(neighbourX, neighbourY, endNodeX, endNodeY);

  let h = Math.floor(
    Math.sqrt(
      Math.pow(endNodeX - neighbourX, 2) + Math.pow(endNodeY - neighbourY, 2)
    )
  );
  return h;
}

function findLowestCostInOpenList(openList: Array<HTMLTableCellElement>) {
  let currentNode: Array<number> = [];
  for (let i = 0; i < openList.length; i++) {
    currentNode.push(parseInt(openList[i].getAttribute("cost") as string));
  }

  // console.log(currentNode);
}

function distanceBetweenStartAndNeighbourThroughCurrent(
  startNode: HTMLTableCellElement,
  current: HTMLTableCellElement,
  currentNeighbour: string
): number {
  let startNodeX: number = parseInt(startNode.id.split(":")[0]);
  let startNodeY: number = parseInt(startNode.id.split(":")[1]);

  let currentNodeX: number = parseInt(current.id.split(":")[0]);
  let currentNodeY: number = parseInt(current.id.split(":")[1]);

  let currentNeighbourNode: HTMLTableCellElement = document.getElementById(
    currentNeighbour
  ) as HTMLTableCellElement;

  let currentNeighbourNodeX: number = parseInt(
    currentNeighbourNode.id.split(":")[0]
  );
  let currentNeighbourNodeY: number = parseInt(
    currentNeighbourNode.id.split(":")[1]
  );

  // console.log("Start Node X:Y: ", startNodeX, startNodeY);
  // console.log("Current X:Y: ", currentNodeX, currentNodeY);
  // console.log(
  //   "Current neighbour X:Y: ",
  //   currentNeighbourNodeX,
  //   currentNeighbourNodeY
  // );

  let distance = Math.floor(
    Math.sqrt(
      Math.pow(currentNodeX - startNodeX, 2) +
        Math.pow(currentNodeY - startNodeY, 2)
    ) +
      Math.sqrt(
        Math.pow(currentNeighbourNodeX - currentNodeX, 2) +
          Math.pow(currentNeighbourNodeY - currentNodeY, 2)
      )
  );

  // console.log(distance);

  return distance;
}

function reconstructPath(cameFrom: any, current: HTMLTableCellElement) {
  console.log(current);

  console.log(cameFrom);
}

class Node {
  constructor(x: number, y: number) {
    const X: number = x;
    const Y: number = y;

    const g: number = 0;
    const h: number = 0;
    const cost: number = g + h;

    const neighbours = [];
  }
}

class Grid {
  constructor() {
    const table: HTMLTableElement = document.createElement("table");

    table.classList.add("container");

    // drawing 25x25 graph
    for (let x = 1; x <= 25; x++) {
      let tr: HTMLTableRowElement = document.createElement("tr");
      tr.id = x.toString();

      for (let y = 1; y <= 25; y++) {
        let cell: HTMLTableDataCellElement = this.createCell(x, y);
        tr.appendChild(cell);
      }
      table.appendChild(tr);
    }

    document.body.appendChild(table);

    this.createStartNode(startCoords);
    this.createEndNode(endCoords);
  }

  createCell(posX: number, posY: number): HTMLTableCellElement {
    let cell: HTMLTableCellElement = document.createElement("td");
    cell.id = `${posY}:${posX}`;
    cell.classList.add("cell");
    cell.onclick = this.changeNode;

    cell.addEventListener("mouseover", setBarrier);

    cell.addEventListener("mousedown", () => {
      mouseIsDown = true;
    });

    cell.addEventListener("mouseup", () => {
      mouseIsDown = false;
    });

    cell.setAttribute("cost", "0");

    cell.setAttribute("h", "0");

    cell.setAttribute("g", "0");

    cell.setAttribute(
      "neighbours",
      JSON.stringify({
        left: "0:0",
        right: "0:0",
        top: "0:0",
        bottom: "0:0",
      })
    );
    return cell;
  }

  // creating start node
  createStartNode(startNodeCoords: string) {
    const startNode: HTMLElement | null = document.getElementById(
      startNodeCoords
    );

    if (startNode) {
      startNode.classList.add("start");
      startNode.setAttribute("cost", "0");
    }
  }

  // creating end node
  createEndNode(endNodeCoords: string) {
    const endNode: HTMLElement | null = document.getElementById(endNodeCoords);

    if (endNode) {
      endNode.classList.add("end");
    }
  }

  changeNode(ev: any) {
    const cell: HTMLTableDataCellElement = ev.path[0];
    const nodes = cell.className.split(" "); // classname = 'cell barrier|end|start|null'

    if (nodeType == "barrier") {
      if (nodes[0] == "cell" && nodes[1] == undefined) {
        cell.classList.add("barrier");
        // console.log(`${cell.id}`);
      } else if (nodes[1] == "barrier") {
        cell.classList.replace("barrier", "cell");
      } else if (nodes[1] != undefined) {
        nodeType = nodes[1];
        changeInfoText(nodes[1]);
      }
    } else if (nodeType == "start") {
      StartEndNodeBehaviour(cell, nodes, "start");
    } else if (nodeType == "end") {
      StartEndNodeBehaviour(cell, nodes, "end");
    }
  }
}

class ControlPanel {
  constructor() {
    const controlPanel: HTMLDivElement = document.createElement("div");
    controlPanel.classList.add("controlpanel");

    const startButton = this.createButton("Start node");
    startButton.onclick = this.onClickStart;
    controlPanel.appendChild(startButton);

    const endButton = this.createButton("End node");
    endButton.onclick = this.onClickEnd;
    controlPanel.appendChild(endButton);

    const barrierButton = this.createButton("Barrier node");
    barrierButton.onclick = this.onClickBarrier;
    controlPanel.appendChild(barrierButton);

    const findPathButton = this.createButton("Find path");
    findPathButton.onclick = this.findPath;
    controlPanel.appendChild(findPathButton);

    const info: HTMLSpanElement = document.createElement("span");

    info.textContent = `${nodeType}`;

    controlPanel.appendChild(info);

    document.body.appendChild(controlPanel);
  }

  createButton(text: string): HTMLButtonElement {
    const button: HTMLButtonElement = document.createElement("button");
    button.textContent = text;

    return button;
  }

  onClickStart() {
    changeInfoText("start");
  }
  onClickEnd() {
    changeInfoText("end");
  }
  onClickBarrier() {
    changeInfoText("barrier");
  }

  findPath() {
    const grid: NodeListOf<HTMLElement> = document.querySelectorAll(".cell");
    // console.log(grid);
    // console.log("grid");
    const startNode: HTMLTableCellElement | null = document.querySelector(
      ".start"
    );
    console.log("Start node: ", startNode);

    const endNode: HTMLTableCellElement | null = document.querySelector(".end");

    console.log("End node: ", endNode);

    const barrierNodes: NodeListOf<HTMLTableCellElement> = document.querySelectorAll(
      ".barrier"
    );
    // console.log("Barrier nodes: ", barrierNodes);

    // we need to make sure that these nodes exist in our grid
    if (startNode && endNode && barrierNodes) {
      const openList: Array<HTMLTableCellElement> = [];
      const closedList: Array<HTMLTableCellElement> = [];

      let winner = 0;
      let current: HTMLTableCellElement;
      openList.push(startNode);

      let currentNeighbours: string;

      let cameFrom: Array<HTMLTableCellElement> = [];
      while (openList.length > 0) {
        // console.log("OpenList content: ", openList);
        // console.log("ClosedList content: ", closedList);

        for (let i = 0; i < openList.length; i++) {
          if (
            parseInt(openList[i].getAttribute("cost") as string) <
            parseInt(openList[winner].getAttribute("cost") as string)
          ) {
            winner = i;
          }
        }
        current = openList[winner];
        console.log("WYGRYWA:", current);

        if (current == endNode) {
          // let cameFromList: Array<HTMLTableCellElement> = [];
          // document.querySelectorAll(".cell").forEach((cell) => {
          //   if (cell.getAttribute("cameFrom") != null) {
          //     cameFromList.push(cell as HTMLTableCellElement);
          //     console.log(cameFromList);
          //   }
          // });

          reconstructPath(cameFrom, current);

          console.log("DONE");

          return;
          break;
        }

        removeFromOpenList(openList, current);
        closedList.push(current);

        currentNeighbours = addNeighbours(current);
        currentNeighbours = JSON.parse(
          current.getAttribute("neighbours") as string
        );
        // console.log("Current neighbours: ", currentNeighbours);

        for (let i = 0; i < Object.keys(currentNeighbours).length; i++) {
          let currentNeighbour: HTMLTableCellElement = document.getElementById(
            Object.values(currentNeighbours)[i]
          ) as HTMLTableCellElement;

          if (!closedList.includes(currentNeighbour)) {
            // console.log(currentNeighbour);

            let tentativeGScore =
              parseInt(current.getAttribute("g") as string) +
              heuristic(current, currentNeighbour);

            let tentativeGIsBetter: boolean = false;

            if (!openList.includes(currentNeighbour)) {
              openList.push(currentNeighbour);
              currentNeighbour.setAttribute(
                "h",
                `${heuristic(currentNeighbour, endNode)}`
              );
              tentativeGIsBetter = true;
            } else if (
              tentativeGScore <
              parseInt(currentNeighbour.getAttribute("g") as string)
            ) {
              tentativeGIsBetter = true;
            }
            if (tentativeGIsBetter) {
              // console.log(currentNeighbour, current);
              cameFrom.push(currentNeighbour);
              currentNeighbour.setAttribute("cameFrom", current.id);
              currentNeighbour.setAttribute("g", `${tentativeGScore}`);
              currentNeighbour.setAttribute(
                "cost",
                `${
                  parseInt(currentNeighbour.getAttribute("g") as string) +
                  parseInt(currentNeighbour.getAttribute("h") as string)
                }`
              );
            }
          }
        }
        // marking open list elements as green cells
        for (let i = 0; i < openList.length; i++) {
          openList[i].classList.add("openList");
        }
        // marking open list elements as green cells
        for (let i = 0; i < closedList.length; i++) {
          closedList[i].classList.add("closedList");
        }
      }
    }
  }
}

const grid = new Grid();
const controlPanel = new ControlPanel();
