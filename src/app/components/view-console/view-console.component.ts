import { Component, OnInit } from '@angular/core';
import { ViewConsoleService } from 'src/app/services/view-console.service';

@Component({
    selector: 'app-view-console',
    templateUrl: './view-console.component.html',
    styleUrls: ['./view-console.component.css']
})
export class ViewConsoleComponent implements OnInit {

    messages;

    constructor(private viewConsoleServ: ViewConsoleService) { }

    ngOnInit(): void {
        this.messages = this.viewConsoleServ.messages;
        // setInterval(() => this.viewConsoleServ.log("I like ice cream"), 1000);

        var viewConsole: any = document.querySelector("#view-console");
        var handle: any = document.querySelector("#view-console-handle");

        // (1) When mouse is down on "handle" start the drag-and-drop
        handle.addEventListener("mousedown", () => {

            let onMouseMove = ev => viewConsole.style.height = window.innerHeight - ev.pageY + 'px'

            // (2) Track the mouse movements on the entire document
            document.addEventListener('mousemove', onMouseMove);

            // (3) When mouse is up anywhere in the document remove "onMouseMove" from the listeners
            document.addEventListener("mouseup", () => 
                document.removeEventListener('mousemove', onMouseMove)
            );
        });
    }

}
