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
        cell.onclick = this.createBarrier;
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

  createBarrier(ev: any) {
    // console.log(ev);
    const cell: HTMLTableDataCellElement = ev.path[0];
    if (nodeType == "barrier") {
      if (cell.className == "cell") {
        cell.classList.add("barrier");
        console.log(`${cell.id}`);
      } else {
        cell.classList.replace("barrier", "cell");
      }
    }
    if (nodeType == "start") {
      let startNode: HTMLElement | null = document.getElementById(startCoords);
      if (startNode) {
        startNode.classList.replace("start", "cell");
        if (cell.className == "cell") {
          cell.classList.add("cell", "start");
          console.log(`${cell.id}`);
          startCoords = cell.id;
        } else {
          cell.classList.replace("start", "cell");
        }
      }
    }
    if (nodeType == "end") {
      let endNode: HTMLElement | null = document.getElementById(endCoords);
      if (endNode) {
        endNode.classList.replace("end", "cell");
        if (cell.className == "cell") {
          cell.classList.add("cell", "end");
          console.log(`${cell.id}`);
          endCoords = cell.id;
        } else {
          cell.classList.replace("end", "cell");
        }
      }
    }
  }
}

let nodeType: string = "barrier";

function changeInfoText(text: string) {
  const panel = document.querySelector(".controlpanel");

  if (panel) {
    panel.childNodes[3].textContent = `${text}`;
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
}

const graph = new Graph();
const controlPanel = new ControlPanel();
