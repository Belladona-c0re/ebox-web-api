import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastData } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {

    toastMessage$ = new Subject<ToastData>();

    constructor() { }
}
