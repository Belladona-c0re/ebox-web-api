import { Injectable } from '@angular/core';
import { ConfirmOptions } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {

    transitionDelay = 250;

    constructor() { }

    spawn({ dialogName, message, confirmButtonName, cancelButtonName }: ConfirmOptions) {

        if (!message) {
            throw new Error('Message is required.');
        }

        // Some defaults
        dialogName = dialogName || 'Are you sure?';
        confirmButtonName = confirmButtonName || 'Proceed';
        cancelButtonName = cancelButtonName || 'Cancel';

        // The id is used to generate a unique dialog and to retrieve it during the removal
        let randomId = Math.random().toString(36).substring(2);

        // Making the dialog
        let newEl = document.createElement('div');
        newEl.innerHTML = this.getTemplate(randomId, dialogName, message, confirmButtonName, cancelButtonName);
        let dialogWrapper: any = newEl.firstElementChild;
        let dialog = dialogWrapper.firstElementChild;

        // This is so I can code the click-outside-to-close feature
        dialog.addEventListener('click', evt => evt.stopPropagation());

        // Appending the dialog
        document.body.appendChild(dialogWrapper);
        setTimeout(() => {
            dialogWrapper.style.opacity = '1';
            dialog.style.opacity = '1';
            document.body.style.overflow = 'hidden';
        }, 25);


        // Making a promise that will resolve on button clicked
        let resolve;
        let closePromise = new Promise(_resolve => {
            // Saving the reference so it can be used outside
            resolve = _resolve;
        });

        // Attaching to the window the callback for the buttons
        window[`onConfirm${randomId}`] = isConfirmed => {
            resolve(isConfirmed);
            // Deleting the resolve function from the window
            delete window[`onConfirm${randomId}`];
            // Removing the dialog
            let dialogWrapper: any = document.querySelector(`#confirm_${randomId}`);
            let dialog = dialogWrapper.firstElementChild;
            dialogWrapper.style.opacity = '0';
            dialog.style.opacity = '0';
            setTimeout(() => {
                dialogWrapper.remove();
                document.body.style.overflow = 'visible';
            }, this.transitionDelay);
        };

        return closePromise;
    }

    private getTemplate(id, dialogName, message, confirmButtonName, cancelButtonName) {
        return `
        <div id="confirm_${id}" class="d-flex align-items-center justify-content-center position-fixed p-3" style="opacity: 0; top: 0; left: 0; bottom: 0; right: 0; background-color: rgba(0, 0, 0, .5); z-index: 1669; transition: all ${this.transitionDelay}ms ease-out" onclick="onConfirm${id}(false)">
            <div class="bg-white container-small rounded-alot" style="opacity: 0; z-index: 1670; transition: all ${this.transitionDelay}ms ease-out">
                <header class="d-flex align-items-center p-3 border-bottom">
                    <div class="fs-5 me-auto">${dialogName}</div>
                    <button onclick="onConfirm${id}(false)" class="btn-close"></button>
                </header>
                <div class="p-3 pb-0">
                    <p>${message}</p>
                </div>
                <footer class="p-3 border-top text-end">
                    <button onclick="onConfirm${id}(false)" class="btn btn-outline-eboxprimary rounded-alot me-2">${cancelButtonName}</button>
                    <button onclick="onConfirm${id}(true)" class="btn btn-eboxprimary rounded-alot">${confirmButtonName}</button>
                </footer>
            </div>
        </div>`;
    }
}
