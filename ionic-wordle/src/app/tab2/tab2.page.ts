import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  actualResult='AUDIO';

  keyboad=[
    {key: 'Q', class: ''},
    {key: 'W', class: ''},
    {key: 'E', class: ''},
    {key: 'R', class: ''},
    {key: 'T', class: ''},
    {key: 'Y', class: ''},
    {key: 'U', class: ''},
    {key: 'I', class: ''},
    {key: 'O', class: ''},
    {key: 'P', class: ''},
    {key: 'A', class: ''},
    {key: 'S', class: ''},
    {key: 'D', class: ''},
    {key: 'F', class: ''},
    {key: 'G', class: ''},
    {key: 'H', class: ''},
    {key: 'J', class: ''},
    {key: 'K', class: ''},
    {key: 'L', class: ''},
    {key: 'ENTER', class: ''},
    {key: 'Z', class: ''},
    {key: 'X', class: ''},
    {key: 'C', class: ''},
    {key: 'V', class: ''},
    {key: 'B', class: ''},
    {key: 'N', class: ''},
    {key: 'M', class: ''},
    {key: 'BACKSPACE', class: ''}
  ];


  boxes=[
    [{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''}],
    [{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''}],
    [{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''}],
    [{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''}],
    [{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''}],
    [{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''},{class:'', key: ''}],
  ];

  rowIndex=0;
  columnIndex=0;

  handleChange(pressed: any){
  // backspace
  if (pressed === 'BACKSPACE') {
    if(this.columnIndex > 0) {
      this.clearKeyIndex();
    }
    return;
  }
  // enter
  if (pressed === 'ENTER') {
    this.submitData();
    return;
  }
  // normal
    console.log(pressed);
    if(this.columnIndex < 5 && this.rowIndex < 6) {
      this.boxes[this.rowIndex][this.columnIndex]={class:'', key: pressed};
      console.log({box: this.boxes});
      this.columnIndex++;
    }
  }

  clearKeyIndex() {
    this.boxes[this.rowIndex][this.columnIndex - 1]={class:'', key: ''};
    this.columnIndex--;
    console.log({currentIndex: this.columnIndex, box: this.boxes});
  }

  submitData(){

    let clonedGuess= this.actualResult;

    // CORRECT WORD
    console.log(`data submitted, ENTER pressed`);
    if (this.columnIndex === 5 && this.rowIndex < 6) {
      const guessedLetters = this.boxes[this.rowIndex].map((item) => item.key);
      const guessedWord = guessedLetters.join('');
      console.log({guessedWord});
      if (this.actualResult === guessedWord) {
        alert('Congratulation!');
        return;
      }

      // colors
      this.boxes[this.rowIndex].map((item, index) => {
        if(item.key === this.actualResult[index]) {
          clonedGuess = clonedGuess.replace(item.key, '');
          item.class='green';
        }
      });

      this.boxes[this.rowIndex].map((item) => {
        if(clonedGuess.includes(item.key)) {
          item.class='yellow';
        }
      });

      this.boxes[this.rowIndex].map((item) => {
        if(item.class === '') {
          item.class='grey';
        }
      });

      console.log({boxes: (this.boxes)});

    }
  }
}

