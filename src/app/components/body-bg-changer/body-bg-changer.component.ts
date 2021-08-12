import { Component, Input, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-body-bg-changer',
    templateUrl: './body-bg-changer.component.html',
    styleUrls: ['./body-bg-changer.component.css']
})
export class BodyBgChangerComponent implements AfterViewInit, OnDestroy {

    @Input() imgSrc;

    classesForBg = ['bg-cover', 'parallax'];

    constructor() { }

    ngAfterViewInit() {

        this.classesForBg.forEach(c => document.body.classList.add(c));
        document.body.style.backgroundImage = "url('" + this.imgSrc + "')";
    }

    ngOnDestroy() {

        this.classesForBg.forEach(c => document.body.classList.remove(c));
        document.body.style.backgroundImage = "";
    }

}
