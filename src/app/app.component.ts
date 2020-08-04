import { HostListener, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('fileInput') fileInput;

  @HostListener('window:keydown', ['$event']) onkeypress(event: KeyboardEvent) {
    event.preventDefault();
    console.log(event.key);
    if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4') {
      this.setActiveColor(event.key);
    }

    if ((event.key === 'ArrowUp' || event.key === 'w') && this.activeRow - 1 > 0) {
      this.onUp();
    }

    if ((event.key === 'ArrowDown' || event.key === 's') && this.activeRow + 1 <= this.values.length) {
      this.onDown();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      this.markValue(null, true);
    }
  }

  file: File | null = null;
  values = [];

  activeRow = 1;
  activeColor: number = 0;

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
      this.values.push({ id, value });
      id = id + 1;
    });
    setTimeout(() => {
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
    let colorClasses = ['mat-red', 'mat-yellow', 'mat-green', 'mat-blue'];
    if (this.activeColor === 0) colorClass = colorClasses[0];
    if (this.activeColor === 1) colorClass = colorClasses[1];
    if (this.activeColor === 2) colorClass = colorClasses[2];
    if (this.activeColor === 3) colorClass = colorClasses[3];

    if (document.getElementById(id).classList.contains(colorClass)) {
      document.getElementById(id).classList.remove(colorClass);
    } else {
      colorClasses.forEach(color => {
        document.getElementById(id).classList.remove(color);
      });
      document.getElementById(id).classList.add(colorClass);
    }
  }

}
