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

function removeFromList(
  openList: Array<HTMLTableCellElement>,
  current: HTMLTableCellElement
) {
  for (let i = openList.length; i >= 0; i--) {
    if (openList[i] == current) {
      openList.splice(i, 1);
    }
  }
}

function addNeighbours(currentNode: HTMLTableCellElement): any {
  // const currentNode = document.getElementById(startCoords);
  let x: number = parseInt(currentNode.id.split(":")[0]);
  let y: number = parseInt(currentNode.id.split(":")[1]);

  if (currentNode) {
    currentNode.setAttribute(
      "neighbours",
      JSON.stringify({
        left: x - 1 < 1 ? undefined : `${x - 1}:${y}`,
        right: x + 1 > 25 ? undefined : `${x + 1}:${y}`,
        top: y - 1 < 1 ? undefined : `${x}:${y - 1}`,
        bottom: y + 1 > 25 ? undefined : `${x}:${y + 1}`,
      })
    );

    return JSON.stringify({
      left: x - 1 < 1 ? undefined : `${x - 1}:${y}`,
      right: x + 1 > 25 ? undefined : `${x + 1}:${y}`,
      top: y - 1 < 1 ? undefined : `${x}:${y - 1}`,
      bottom: y + 1 > 25 ? undefined : `${x}:${y + 1}`,
    });
  }
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

    return cell;
  }

  // creating start node
  createStartNode(startNodeCoords: string) {
    const startNode: HTMLElement | null = document.getElementById(
      startNodeCoords
    );

    if (startNode) {
      startNode.innerText = "S";
      startNode.classList.add("start");
      startNode.setAttribute("cost", "0");
    }
  }

  // creating end node
  createEndNode(endNodeCoords: string) {
    const endNode: HTMLElement | null = document.getElementById(endNodeCoords);

    if (endNode) {
      endNode.innerText = "E";
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

      let current: HTMLTableCellElement;
      openList.push(startNode);

      let currentNeighbour: HTMLTableCellElement;
      let listOfAllNeighboursIDs: string;

      while (openList.length > 0) {
        current = openList[0];
        for (let i = 0; i < openList.length; i++) {
          if (
            parseInt(openList[i].getAttribute("cost") as string) <
            parseInt(current.getAttribute("cost") as string)
          ) {
            current = openList[i];
          }
        }

        console.log(current);

        removeFromList(openList, current);
        closedList.push(current);

        if (current == endNode) {
          console.log("DONE");
          return;
        }

        listOfAllNeighboursIDs = addNeighbours(current);
        listOfAllNeighboursIDs = JSON.parse(
          current.getAttribute("neighbours") as string
        );

        for (let i = 0; i < Object.keys(listOfAllNeighboursIDs).length; i++) {
          currentNeighbour = document.getElementById(
            Object.values(listOfAllNeighboursIDs)[i]
          ) as HTMLTableCellElement;

          if (
            currentNeighbour.classList.contains("barrier") ||
            closedList.includes(currentNeighbour)
          ) {
            continue;
          }

          let tentativeGScore =
            parseInt(current.getAttribute("g") as string) +
            heuristic(current, currentNeighbour);

          if (
            tentativeGScore <
              parseInt(currentNeighbour.getAttribute("g") as string) ||
            !openList.includes(currentNeighbour)
          ) {
            currentNeighbour.setAttribute(
              "h",
              `${heuristic(currentNeighbour, endNode)}`
            );
            currentNeighbour.setAttribute("g", `${tentativeGScore}`);

            currentNeighbour.setAttribute(
              "cost",
              `${
                parseInt(currentNeighbour.getAttribute("g") as string) +
                parseInt(currentNeighbour.getAttribute("h") as string)
              }`
            );

            currentNeighbour.setAttribute("parent", `${current.id}`);

            if (!openList.includes(currentNeighbour)) {
              openList.push(currentNeighbour);
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
