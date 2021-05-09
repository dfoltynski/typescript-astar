import "./style.css";

declare global {
  interface Window {
    mouseX: Number;
    mouseY: Number;
  }
}

let startCoords: string = `${Math.floor(Math.random() * 24) + 1}:${
  Math.floor(Math.random() * 24) + 1
}`;

let endCoords: string = `${Math.floor(Math.random() * 24) + 1}:${
  Math.floor(Math.random() * 24) + 1
}`;

class Graph {
  constructor() {
    const table: HTMLTableElement = document.createElement("table");

    table.classList.add("container");

    console.log(startCoords, endCoords);

    // drawing 25x25 graph
    for (let x = 1; x <= 25; x++) {
      let tr: HTMLTableRowElement = document.createElement("tr");
      tr.id = x.toString();

      for (let y = 1; y <= 25; y++) {
        let cell: HTMLTableDataCellElement = document.createElement("td");
        cell.id = `${x}:${y}`;
        cell.classList.add("cell");
        cell.onclick = this.createNode;
        tr.appendChild(cell);
      }
      table.appendChild(tr);
    }

    // onmousemove = (e: MouseEvent) => {
    //   window.mouseX = e.clientX;
    //   window.mouseY = e.clientY;
    // };

    document.body.appendChild(table);

    this.createStartNode(startCoords);
    this.createEndNode(endCoords);
  }

  // creating start node
  createStartNode(startNodeCoords: string) {
    console.log(startNodeCoords);
    const startNode: HTMLElement | null = document.getElementById(
      startNodeCoords
    );

    if (startNode) {
      startNode.classList.add("start");
    }
  }

  // creating end node
  createEndNode(endNodeCoords: string) {
    console.log(endNodeCoords);
    const endNode: HTMLElement | null = document.getElementById(endNodeCoords);

    if (endNode) {
      endNode.classList.add("end");
    }
  }

  createNode(ev: any) {
    // console.log(ev);
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
      let startNode: HTMLElement | null = document.getElementById(startCoords);

      if (startNode) {
        // if we click on standard cell node then we change it to be start node and we prevent vanishing start node
        if (nodes[0] == "cell" && nodes[1] == undefined) {
          startNode.classList.replace("start", "cell");
          cell.classList.add("start");
          console.log(`${cell.id}`);
          startCoords = cell.id;
        } else if (nodes[1] != undefined) {
          nodeType = nodes[1];
          changeInfoText(nodes[1]);
        }
      }
    } else if (nodeType == "end") {
      let endNode: HTMLElement | null = document.getElementById(endCoords);
      if (endNode) {
        if (nodes[0] == "cell" && nodes[1] == undefined) {
          endNode.classList.replace("end", "cell");
          cell.classList.add("cell", "end");
          endCoords = cell.id;
        } else if (nodes[1] != undefined) {
          nodeType = nodes[1];
          changeInfoText(nodes[1]);
        }
      }
    }
  }
}

let nodeType: string = "barrier";

function changeInfoText(text: string) {
  const panel = document.querySelector(".controlpanel");

  if (panel) {
    panel.childNodes[4].textContent = `${text}`;
  }
  nodeType = `${text}`;
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

    // const asdButton = this.createButton("asd node");
    // asdButton.onclick = this.onClickPrint;
    // controlPanel.appendChild(asdButton);

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

  // onClickPrint() {
  //   let paperCount: number = 0;
  //   let time: number = 0;

  //   setInterval(() => {
  //     if (paperCount < 100) {
  //       paperCount = paperCount + 1;
  //       time = time + 9;
  //       console.log("Papier dodany dla A");
  //     }
  //   }, 9);

  //   setInterval(() => {
  //     if (paperCount < 100) {
  //       paperCount = paperCount + 1;
  //       time = time + 12;
  //       console.log("Papier dodany dla B");
  //     }
  //   }, 12);

  //   setTimeout(() => {
  //     if (paperCount === 100) {
  //       console.log(`${paperCount} sheets of paper in ${time / 60} minutes`);
  //     }
  //   }, 2000);
  // }

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
    console.log(grid);
    console.log("grid");
    const startNodeCoords: string | undefined = document.querySelector(".start")
      ?.id;
    console.log(startNodeCoords);

    const endNodeCoords: string | undefined = document.querySelector(".end")
      ?.id;
    console.log(endNodeCoords);

    const barrierNodesCoords: NodeListOf<HTMLTableCellElement> = document.querySelectorAll(
      ".barrier"
    );
    console.log(barrierNodesCoords);

    const straightNodeCost: number = 10; // 1*10
    const diagonalNodeCost: number = 14; // sqrt(2) * 10
  }
}

const graph = new Graph();
const controlPanel = new ControlPanel();
