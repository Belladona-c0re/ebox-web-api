import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/services/toaster.service';
import { ContractService } from '../../services/contract.service';

@Component({
    selector: 'app-toaster-notifier',
    templateUrl: './toaster-notifier.component.html',
    styleUrls: ['./toaster-notifier.component.css']
})
export class ToasterNotifierComponent implements OnInit {

    toasterId = `toaster_${Math.random().toString(36).substring(2)}`

    private defaultType = 'primary';
    private typeList = ['primary', 'secondary', 'danger', 'warning', 'success', 'info'];
    private colorMap = {
        primary: 'white',
        secondary: 'white',
        danger: 'white',
        warning: 'dark',
        info: 'dark'
    };
    private defaultDuration = 'short';
    private durationMap = {
        short: 5e3,
        medium: 8e3,
        long: 14e3
    };

    constructor(
        public contractServ: ContractService,
        private toasterServ: ToasterService) { }

    ngOnInit() {

        this.toasterServ.toastMessage$
            .subscribe(({ type, message, duration }) => {

                if (!this.typeList.includes(type)) {
                    type = this.defaultType;
                }
                if (!this.durationMap[duration]) {
                    duration = 'short';
                }

                let toastId = this.addToast(type, message);
                setTimeout(
                    () => this.removeToast(toastId),
                    this.durationMap[this.defaultDuration]);
            });
    }

    private addToast(type, message) {

        let toastId = `toast_${Math.random().toString(36).substring(2)}`;

        let html = `
        <div id="${toastId}" class="toast show align-items-center text-${this.colorMap[type]} bg-${type} border-0" style="opacity: 0; transition: all 1s ease-out">
            <div class="d-flex">
                <div class="toast-body lead text-break">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" onclick="this.parentElement.parentElement.classList.remove('show'); this.parentElement.parentElement.classList.add('hide')"></button>
            </div>
        </div>`;

        let newEl = document.createElement('div');
        newEl.innerHTML = html;

        let toastEl: any = newEl.firstElementChild;
        let toasterEl = document.getElementById(this.toasterId);
        toasterEl.prepend(toastEl);
        setTimeout(() => toastEl.style.opacity = '1', 25);

        return toastId;
    }

    private removeToast(id) {

        let toastEl = document.getElementById(id);
        toastEl.style.opacity = '0';
        setTimeout(() => toastEl.remove(), 900);
    }

}
