import { HostListener, Component, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('fileInput') fileInput;
  @ViewChild('fileDownload') fileDownload;

  @HostListener('window:keydown', ['$event']) onkeypress(event: KeyboardEvent) {
    if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4' ||  event.key === '5' || event.key === '6' || event.key === '7' || event.key === '8' || event.key === '9' || event.key === '0') {
      if (parseInt(event.key) < this.buttons.length) {
        this.setActiveColor(event.key);
      }
    }

     else if ((event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') && this.activeRow - 1 > 0) {
      event.preventDefault();
      if (event.shiftKey) {
        this.markValue(null, true);
      }
      this.onUp();
    }

    else if ((event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') && this.activeRow + 1 <= this.values.length) {
      event.preventDefault();
      if (event.shiftKey) {
        this.markValue(null, true);
      }
      this.onDown();
    }
    else if (event.key === 'Enter') {
      event.preventDefault();
      this.markValue(null, true);
    }
    else if ((event.key === '+' || event.key === '=') && this.buttons.length < 10) {
      this.addColor();
    }
    else if ((event.key === '>' || event.key === '.') && this.isThereNextFile()) {
      console.log(this.filesTable.length);
      this.loadFile();
    }
    else if (event.key === ' ') {
      event.preventDefault();
      this.getResult();
    }
  }

  activeFile: number = 0;
  filesTable: File[] = [];
  file: File | null = null;
  values = [];

  activeRow: number  = 1;
  activeColor: number = 1;

  mouseHold: boolean = false;
  lastCheckedId: number = 1;

  resultJSON: number[] = [];

  buttons = [
    {
      number: 0,
      color: ''
    },
    {
      number: 1,
      color: 'grey'
    },
    {
      number: 2,
      color: 'red'
    },
    {
      number: 3,
      color: 'orange'
    },
    
  ]
  colorClasses: string[] = ['', 'grey', 'red', 'orange', 'yellow', 'green', 'blue', 'granat', 'violet', 'pink'];

  constructor() { }

  //#region file select
  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(event): void {
    this.activeFile = 0;
    this.filesTable = event.target.files;
    this.loadFile();
  }

  loadFile() {
    this.values = [];
    this.resultJSON = [];
    this.fileReader();
  }

  private fileReader() {
    const reader = new FileReader;
    this.file = this.filesTable[this.activeFile];
    reader.onload = () => {
      const text = reader.result.toString();
      this.splitText(text);
    }
    reader.readAsText(this.file);
    if (this.activeFile < this.filesTable.length) {
      this.activeFile = this.activeFile + 1;
    }
  }

  //#endregion

  private splitText(text: string) {
    let tempValues = text.split('\n');
    let id = 1;
    tempValues.forEach(value => {
      this.resultJSON.push(0);
      this.values.push({ id, value });
      id = id + 1;
    });
    setTimeout(() => {
      document.getElementById('1').classList.add('selected-row');
    }, 200);
  }

  private onUp() {
    document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
    this.activeRow = this.activeRow - 1;
    document.getElementById(this.activeRow.toString()).classList.add('selected-row');
    window.scrollTo(0, document.getElementById(this.activeRow.toString()).offsetTop - window.innerHeight / 2);
  }

  private onDown() {
    document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
    this.activeRow = this.activeRow + 1;
    document.getElementById(this.activeRow.toString()).classList.add('selected-row');
    window.scrollTo(0, document.getElementById(this.activeRow.toString()).offsetTop - window.innerHeight / 2);
  }

  private markValue(event, isEnterEvent) {
    let id;
    if (isEnterEvent) {
      id = this.activeRow;
    } else {
      document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
      this.activeRow = parseInt(event.toElement.id);
      document.getElementById(this.activeRow.toString()).classList.add('selected-row');
      id = event.toElement.id;
    }
    let colorClass = '';
    for (let i = 0; i < this.buttons.length; i++) {
      if (this.activeColor === i) colorClass = `mat-${this.colorClasses[i]}`;
    }

    this.colorClasses.forEach(color => {
      document.getElementById(id).classList.remove(`mat-${color}`);
    });
    this.resultJSON[id - 1] = this.activeColor;
    document.getElementById(id).classList.add(colorClass);
  }

  //#region GUI

  addColor() {
    this.buttons.push({ number: this.buttons.length, color: this.colorClasses[this.buttons.length] })
  }

  setActiveColor(colorNumber) {
    this.activeColor = parseInt(colorNumber);
  }

  isThereNextFile() {
    return this.filesTable.length !== 0 && this.activeFile !== this.filesTable.length;
  }

  isThereMoreColors() {
    return this.buttons.length < 10;
  }

  getResult() {
    const filename = `${this.filesTable[this.activeFile - 1].name.replace('.txt','')}-${new Date().toLocaleTimeString()}.json`;
    let arrayToString = JSON.stringify(Object.assign({}, this.resultJSON));  // convert array to string
    const blob = new Blob([arrayToString], { type: '.json' });
    saveAs(blob, filename);
  }

  //#region mouse multichecking
  startMouseHold(id) {
    document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
    this.mouseHold = true;
    this.activeRow = id;
    this.lastCheckedId = id;
    document.getElementById(this.activeRow.toString()).classList.add('selected-row');
  }

  endMouseHold(id) {
    document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
    this.onDragMouse(id);
    this.mouseHold = false;
    this.lastCheckedId = id;
    document.getElementById(this.activeRow.toString()).classList.add('selected-row');
  }

  onDragMouse(id) {
    if (this.mouseHold) {
      if (this.lastCheckedId > id) {
        for (let i = this.lastCheckedId; i >= id; i--) {
          document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
          this.activeRow = i;
          this.markValue(null, true);
          document.getElementById(this.activeRow.toString()).classList.add('selected-row');
        }
        this.lastCheckedId = id;
      } else {
        for (let i = this.lastCheckedId; i <= id; i++) {
          document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
          this.activeRow = i;
          this.markValue(null, true);
          document.getElementById(this.activeRow.toString()).classList.add('selected-row');
        }
        this.lastCheckedId = id;
      }
    }
  }
  //#endregion

  //#endregion

}
