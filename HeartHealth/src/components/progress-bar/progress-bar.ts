import { Component, Input } from '@angular/core';

/**
 * A dynamic component that shows progress.
 */
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress;
  color = "red"

  constructor() {
    console.log('Hello ProgressBarComponent Component');
  }

}
