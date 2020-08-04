import { HostListener, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    event.preventDefault();
    console.log(event.key);
    if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4' ||  event.key === '5' || event.key === '6' || event.key === '7' || event.key === '8' || event.key === '9') {
      if (parseInt(event.key) <= this.buttons.length) {
        this.setActiveColor(event.key);
      }
    }

    if ((event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') && this.activeRow - 1 > 0) {
      if (event.shiftKey) {
        this.markValue(null, true);
      }
      this.onUp();
    }

    if ((event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') && this.activeRow + 1 <= this.values.length) {
      console.log(event.shiftKey);
      if (event.shiftKey) {
        this.markValue(null, true);
      }
      this.onDown();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      this.markValue(null, true);
    }
    if ((event.key === '+' || event.key === '=') && this.buttons.length < 9) {
      this.addColor();
    }
  }

  file: File | null = null;
  values = [];

  activeRow = 1;
  activeColor: number = 0;

  resultJSON = [];

  buttons = [
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
  colorClasses = ['grey', 'red', 'orange', 'yellow', 'green', 'blue', 'granat', 'violet', 'pink'];

  constructor(
    private _httpClient: HttpClient
  ) { }
  
  addColor() {
    this.buttons.push({ number: this.buttons.length + 1, color: this.colorClasses[this.buttons.length] })
    console.log(this.buttons);
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(event): void {
    try {
      this.values = [];
      this.file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = reader.result.toString().trim();
        this.splitText(text);
      }
      reader.readAsText(this.file);
    } catch{}

  }

  splitText(text: string) {
    let tempValues = text.split('\n');
    let id = 1;
    tempValues.forEach(value => {
      this.resultJSON.push(0);
      this.values.push({ id, value });
      id = id + 1;
    });
    setTimeout(() => {
      console.log(this.resultJSON);
      document.getElementById('1').classList.add('selected-row');
    }, 200);
  }

  setActiveColor(colorNumber) {
    this.activeColor = parseInt(colorNumber) - 1;
  }

  onUp() {
    document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
    this.activeRow = this.activeRow - 1;
    document.getElementById(this.activeRow.toString()).classList.add('selected-row');
    window.scrollTo(0, document.getElementById(this.activeRow.toString()).offsetTop - window.innerHeight / 2);
  }

  onDown() {
    document.getElementById(this.activeRow.toString()).classList.remove('selected-row');
    this.activeRow = this.activeRow + 1;
    document.getElementById(this.activeRow.toString()).classList.add('selected-row');
    window.scrollTo(0, document.getElementById(this.activeRow.toString()).offsetTop - window.innerHeight / 2);
  }

  markValue(event, isEnterEvent) {
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

    if (document.getElementById(id).classList.contains(colorClass)) {
      this.resultJSON[id - 1] = 0;
      document.getElementById(id).classList.remove(colorClass);
    } else {
      this.colorClasses.forEach(color => {
        document.getElementById(id).classList.remove(`mat-${color}`);
      });
      this.resultJSON[id - 1] = this.activeColor + 1;
      document.getElementById(id).classList.add(colorClass);
    }
  }

  getResult() {
    const filename = `file-${new Date().toLocaleTimeString()}.json`;
    let arrayToString = JSON.stringify(Object.assign({}, this.resultJSON));  // convert array to string
    console.log(arrayToString);
    arrayToString.replace('/"/g', '');
    const blob = new Blob([arrayToString], { type: '.json' });
    saveAs(blob, filename);
  }

  download(url: string): Observable<Blob> {
    return this._httpClient.get(url, {
      responseType: 'blob'
    })
  }

  onDrag(event) {
    console.log(event);
  }

}
