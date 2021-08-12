import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingIndicatorService {

    counter = 0;
    isLoading$ = new BehaviorSubject(false);

    constructor() { }

    on() {
        // Turning it on as long as it's untouched
        if (this.counter < 1) {
            this.isLoading$.next(true);
        }
        this.counter++;
    }

    off() {
        if (this.counter > 0) {
            this.counter--;
        }
        // Turning it off as soon as all offs as been called
        if (this.counter < 1) {
            this.isLoading$.next(false);
        }
    }
}
