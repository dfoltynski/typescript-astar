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
        cell.onclick = this.cellClick;
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

  //
  cellClick(ev: any) {
    console.log(ev);
    const cell: HTMLTableDataCellElement = ev.path[0];
    if (cell.className == "cell") {
      cell.classList.replace("cell", "barrier");
      console.log(`${cell.id}`);
    } else {
      cell.classList.replace("barrier", "cell");
    }
  }
}

const graph = new Graph();
