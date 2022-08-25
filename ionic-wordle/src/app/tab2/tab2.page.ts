import {Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {WORDS} from './words';
import {Essai, Letter, LetterState}  from './type';
import { Router } from '@angular/router';
import { WordService } from '../services/word.service';
import { WordFound } from '../models/user';
import { AuthService } from '../services/auth.service';

const WORD_LENGTH = 5;
const NUM_TRIES = 6;

// Letter map
const LETTERS = (() => {
  // letter -> true
  const ret: {[key: string]: boolean} = {};
  for (let charCode = 97; charCode < 97 + 26; charCode++) {
    ret[String.fromCharCode(charCode)] = true;
  }
  return ret;
})();

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})


export class Tab2Page {
  @ViewChildren('tryContainer') tryContainers!: QueryList<ElementRef>;

  readonly wordsFound: WordFound[];

  readonly tries: Essai[] = [];  // stores tous les essais (1 essai = 1 row)

  readonly letterState = LetterState; // letterState enum

  readonly currentLetterStates: {[key: string]: LetterState} = {};  // stores le state for the keyboard key

  readonly keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
  ];

  infoMsg = '';   // Message shown in the message board
  fadeOutInfoMessage = false;     // Controls info message's fading-out animation
  showPopUpContainer = false;     // Pop Up message
  showPopUp = false;
  private currentLetterIndex = 0;    // Tracks the current letter index
  private numberOfSubmittedTries = 0;
  private targetWord = '';     // Store the target word
  private won = false;        // Outcome

  // Stores the count for each letter from the target word
  // 'happy' -> { 'h':1, 'a': 1, 'p': 2, 'y': 1 }
  private targetWordLetterCounts: {[letter: string]: number} = {};

  constructor(private router: Router, private authService: AuthService) {
    // Populate initial state of "tries".
    for (let i = 0; i < NUM_TRIES; i++) {
      const letters: Letter[] = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        letters.push({text: '', state: this.letterState.pendingState});
      }
      this.tries.push({letters});
    }
    // Get target word from the word list
    const numberOfWords = WORDS.length;
    while (true) {
      // Randomly select a word and check if its length is WORD_LENGTH.
      const index = Math.floor(Math.random() * numberOfWords);
      const word = WORDS[index];
      if (word.length === WORD_LENGTH) {
        this.targetWord = word.toLowerCase();
        break;
      }
    }
    // Print it out so we can cheat!:)
    console.log('target word: ', this.targetWord);

    // Generate letter counts for target word.
    for (const letter of this.targetWord) {
      const count = this.targetWordLetterCounts[letter];
      if (count == null) {
        this.targetWordLetterCounts[letter] = 0;
      }
      this.targetWordLetterCounts[letter]++;
    }
    console.log(this.targetWordLetterCounts);
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleClickKey(event.key);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/tabs/tab1']);
    // window.location.reload();
  };

  // Returns the classes for the given keyboard key based on its state.
  getKeyClass(key: string): string {
    const state = this.currentLetterStates[key.toLowerCase()];
    switch (state) {
      case this.letterState.fullMatchState:
        return 'match key';
      case this.letterState.partialMatchState:
        return 'partial key';
      case this.letterState.wrongMatchState:
        return 'wrong key';
      default:
        return 'key';
    }
  }

  handleClickKey(key: string) {
    // Don't process key down when user has won the game.
    if (this.won) {
      return;
    }

    // If key is a letter, update the text in the corresponding letter object.
    if (LETTERS[key.toLowerCase()]) {
      // Only allow typing letters in the current try. Don't go over if the
      // current try has not been submitted.
      if (this.currentLetterIndex < (this.numberOfSubmittedTries + 1) * WORD_LENGTH) {
        this.setLetter(key);
        this.currentLetterIndex++;
      }
    }
    // Handle delete.
    else if (key === 'Backspace') {
      // Don't delete previous try.
      if (this.currentLetterIndex > this.numberOfSubmittedTries * WORD_LENGTH) {
        this.currentLetterIndex--;
        this.setLetter('');
      }
    }
    // Submit the current try and check.
    else if (key === 'Enter') {
      this.checkCurrentTry();
    }
  }

  handleNewGame() {
    // 🟩🟨⬜ Copy results into clipboard.
    let clipboardContent = '';
    for (let i = 0; i < this.numberOfSubmittedTries; i++) {
      for (let j = 0; j < WORD_LENGTH; j++) {
        const letter = this.tries[i].letters[j];
        switch (letter.state) {
          case this.letterState.fullMatchState:
            clipboardContent += '🟩';
            break;
          case this.letterState.partialMatchState:
            clipboardContent += '🟨';
            break;
          case this.letterState.wrongMatchState:
            clipboardContent += '⬜';
            break;
          default:
            break;
        }
      }
      clipboardContent += '\n';
    }
    console.log(clipboardContent);
    navigator.clipboard.writeText(clipboardContent);
    this.showPopUpContainer = false;
    this.showPopUp = false;
    this.showInfoMessage('Copied results to clipboard');
    window.location.reload();
  }

  private setLetter(letter: string) {
    const tryIndex = Math.floor(this.currentLetterIndex / WORD_LENGTH);
    const letterIndex = this.currentLetterIndex - tryIndex * WORD_LENGTH;
    this.tries[tryIndex].letters[letterIndex].text = letter;
  }

  // Check if user has typed all the letters.
  private async checkCurrentTry() {
    const curTry = this.tries[this.numberOfSubmittedTries];
    if (curTry.letters.some(letter => letter.text === '')) {
      this.showInfoMessage('Not enough letters');
      return;
    }

     // Check if the current try is a word in the list.
    //  const wordFromCurTry =
    //  curTry.letters.map(letter => letter.text).join('').toUpperCase();
    //   if (!WORDS.includes(wordFromCurTry)) {
    //     this.showInfoMessage('Not in word list');
    //     // Shake the current row.
    //     const tryContainer =
    //         this.tryContainers.get(this.numSubmittedTries)?.nativeElement as
    //         HTMLElement;
    //     tryContainer.classList.add('shake');
    //     setTimeout(() => {
    //       tryContainer.classList.remove('shake');
    //     }, 500);
    //     return;
    //   }


    // Check if the current try matches the target word.

    // Stores the check results.

    // Clone the counts map. Need to use it in every check with the initial
    // values.
    const targetWordLetterCounts = {...this.targetWordLetterCounts};
    const states: LetterState[] = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
      const expected = this.targetWord[i];
      const curLetter = curTry.letters[i];
      const got = curLetter.text.toLowerCase();
      let state = this.letterState.wrongMatchState;
      // Need to make sure only performs the check when the letter has not been
      // checked before.
      //
      // For example, if the target word is "happy", then the first "a" user
      // types should be checked, but the second "a" should not, because there
      // is no more "a" left in the target word that has not been checked.
      if (expected === got && targetWordLetterCounts[got] > 0) {
        targetWordLetterCounts[expected]--;
        state = this.letterState.fullMatchState;
      } else if (
          this.targetWord.includes(got) && targetWordLetterCounts[got] > 0) {
        targetWordLetterCounts[got]--;
        state = this.letterState.partialMatchState;
      }
      states.push(state);
    }
    console.log(states);

    // Animate.
    // Again, there must be a more angular way to do this, but...

    // Get the current try.
    const tryContainer =
        this.tryContainers.get(this.numberOfSubmittedTries)?.nativeElement as
        HTMLElement;
    // Get the letter elements.
    const letterEles = tryContainer.querySelectorAll('.letter-container');
    for (let i = 0; i < letterEles.length; i++) {
      // "Fold" the letter, apply the result (and update the style), then unfold
      // it.
      const curLetterEle = letterEles[i];
      curLetterEle.classList.add('fold');
      // Wait for the fold animation to finish.
      await this.wait(180);
      // Update state. This will also update styles.
      curTry.letters[i].state = states[i];
      // Unfold.
      curLetterEle.classList.remove('fold');
      await this.wait(180);
    }

    // Save to keyboard key states
    // Do this after the current try has been submitted and the animation above is done.
    for (let i = 0; i < WORD_LENGTH; i++) {
      const curLetter = curTry.letters[i];
      const got = curLetter.text.toLowerCase();
      const curStoredState = this.currentLetterStates[got];
      const targetState = states[i];
      // This allows override state with better result.
      //
      // For example, if "A" was partial match in previous try, and becomes full
      // match in the current try, we update the key state to the full match
      // (because its enum value is larger).
      if (curStoredState == null || targetState > curStoredState) {
        this.currentLetterStates[got] = targetState;
      }
    }

    this.numberOfSubmittedTries++;

    // Check if all letters in the current try are correct.
    if (states.every(state => state === this.letterState.fullMatchState)) {
      this.showInfoMessage('NICE!');
      this.won = true;
       // Bounce animation.
      //  for (let i = 0; i < letterEles.length; i++) {
      //   const curLetterEle = letterEles[i];
      //   curLetterEle.classList.add('bounce');
      //   await this.wait(160);
      // }
      this.showAgain();
      return;
    }

    // Running out of tries. Show correct answer.
    //
    // If you can hear, my heater is on.. sorry about that!
    if (this.numberOfSubmittedTries === NUM_TRIES) {
      // Don't hide it.
      this.showInfoMessage(this.targetWord.toUpperCase(), false);
      this.showAgain();
    }
  }

  private showInfoMessage(msg: string, hide = true) {
    this.infoMsg = msg;
    if (hide) { // Hide after 2s
      setTimeout(() => {
        this.fadeOutInfoMessage = true; // Resets when anination is finished
        setTimeout(() => {
          this.infoMsg = '';
          this.fadeOutInfoMessage = false;
        }, 500);
      }, 2000);
    }
  }

  private async wait(ms: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  private showAgain() {
    setTimeout(() => {
      this.showPopUpContainer = true;
      setTimeout(() => {
        this.showPopUp = true;
      });
    }, 1500);
    // if(this.won === true) {
    //   this.wordService.wordFound().subscribe(
    //     (res: any) => {
    //       this.wordsFound = res;
    //       console.log(this.wordsFound);
    //     }
    //   );
    // }
  }
}
