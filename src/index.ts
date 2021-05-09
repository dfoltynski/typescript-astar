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
      console.log(`${cell.id}`);
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
    console.log(`tworzymy sasiadow dla `);
    console.log(currentNode);

    console.log(currentNode.id);
    console.log(
      currentNode.setAttribute(
        "neighbours",
        JSON.stringify({
          left: `${x - 1}:${y}`,
          right: `${x + 1}:${y}`,
          top: `${x}:${y - 1}`,
          bottom: `${x}:${y + 1}`,
        })
      )
    );
  }
  return JSON.stringify({
    left: `${x - 1}:${y}`,
    right: `${x + 1}:${y}`,
    top: `${x}:${y - 1}`,
    bottom: `${x}:${y + 1}`,
  });
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

    cell.setAttribute("cost", Number.POSITIVE_INFINITY.toString());
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
        console.log(`${cell.id}`);
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

  onClickStart(ev: any) {
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
    console.log(grid);
    console.log("grid");
    const startNode: HTMLTableCellElement | null = document.querySelector(
      ".start"
    );
    console.log(startNode);

    const endNode: HTMLTableCellElement | null = document.querySelector(".end");

    console.log(endNode);

    const barrierNodes: NodeListOf<HTMLTableCellElement> = document.querySelectorAll(
      ".barrier"
    );
    console.log(barrierNodes);

    // we need to make sure that these nodes exist in our grid
    if (startNode && endNode && barrierNodes) {
      const straightNodeCost: number = 10; // 1*10
      const diagonalNodeCost: number = 14; // sqrt(2) * 10
      const openList: Array<HTMLTableCellElement> = [];
      const closedList: Array<HTMLTableCellElement> = [];

      let winner = 0;
      let current: HTMLTableCellElement;
      openList.push(startNode);

      let currentNeighbours: string;

      while (openList.length > 0) {
        for (let i = 0; i < openList.length; i++) {
          if (
            parseInt(openList[i].getAttribute("cost") as string) <
            parseInt(openList[winner].getAttribute("cost") as string)
          ) {
            winner = i;
          }
        }

        current = openList[winner];

        if (openList[winner] == endNode) {
          console.log("DONE");
        }

        removeFromOpenList(openList, current);
        closedList.push(current);

        currentNeighbours = addNeighbours(current);

        currentNeighbours = JSON.parse(
          current.getAttribute("neighbours") as string
        );

        console.log(currentNeighbours);

        for (let i = 0; i < Object.keys(currentNeighbours).length; i++) {
          let neighbour = Object.values(currentNeighbours)[i];
          console.log(neighbour);
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
      // while (openList.length > 0) {
      // let currentNode: HTMLTableCellElement = openList[0];
      // for (let i = 1; i < openList.length; i++) {}
      // }
    }
  }
}

const grid = new Grid();
const controlPanel = new ControlPanel();
