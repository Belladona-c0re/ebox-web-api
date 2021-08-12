import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-password-strength-visualizer',
    templateUrl: './password-strength-visualizer.component.html',
    styleUrls: ['./password-strength-visualizer.component.css']
})
export class PasswordStrengthVisualizerComponent implements AfterViewInit, OnDestroy {

    @Input() data;

    private onWindowResize = () => {

        this.setCanvasSize();
        this.render();
    };
    private passwordInput;
    private canvas;
    private img = new Image();
    private pxFactor = 100;
    private posterImg;
    private ctx;
    private imgRatio;
    private wrapperRatio;
    private newWidth;
    private newHeight;
    private newX;
    private newY;

    ngAfterViewInit() {

        this.passwordInput = document.querySelector('#password-input');
        this.canvas = document.querySelector('#password-canvas');
        this.posterImg = this.canvas.getAttribute('data-img-src');

        // The following code was taken and modified from http://jsfiddle.net/u6apxgfk/390/ and merged with https://codepen.io/bassta/pen/OPVzyB?editors=1010

        this.ctx = this.canvas.getContext('2d');

        window.addEventListener('resize', this.onWindowResize);
        this.passwordInput.addEventListener('input', this.onPasswordInput.bind(this));
        this.img.onload = () => {

            let imgWidth = this.img.width;
            let imgHeight = this.img.height;
            this.imgRatio = imgWidth / imgHeight;
            this.setCanvasSize();
            this.render();
        };

        this.img.src = this.posterImg;
    }

    private onPasswordInput() {

        let val = this.passwordInput.value;
        let result = (<any>window).zxcvbn(val);
        // We want to reveal the image as the password gets stronger. Since the zxcvbn.score has
        // only 5 different values (0-4) we will use the zxcvbn.guesses_log10 output.
        // The guesses_log10 will be >= 11 when the password is considered strong,
        // so we want to map a factor of 3 (pixelated) to 100 (clear image) to 
        // a value of 0 to 11 of guesses_log10.
        // This result will be used in the render function.
        this.pxFactor = -97 / 11 * Math.min(11, Math.round(result.guesses_log10)) + 100;

        // so we see most of the time pixels rather than approaching a clear image sooner..
        if (this.pxFactor != 3 && this.pxFactor != 100) {
            this.pxFactor -= this.pxFactor / 100 * 50;
        }

        this.render();
    }

    private setCanvasSize() {

        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    private render() {

        let w = this.canvas.offsetWidth;
        let h = this.canvas.offsetHeight;

        this.newWidth = w;
        this.newHeight = h;
        this.newX = 0;
        this.newY = 0;
        this.wrapperRatio = this.newWidth / this.newHeight;

        if (this.wrapperRatio > this.imgRatio) {
            this.newHeight = Math.round(w / this.imgRatio);
            this.newY = (h - this.newHeight) / 2;
        }
        else {
            this.newWidth = Math.round(h * this.imgRatio);
            this.newX = (w - this.newWidth) / 2;
        }

        // pxFactor will depend on the current typed password.
        // values will be in the range [1,100].
        let size = this.pxFactor * 0.01;

        // turn off image smoothing - this will give the pixelated effect
        this.ctx.mozImageSmoothingEnabled = size === 1 ? true : false;
        this.ctx.webkitImageSmoothingEnabled = size === 1 ? true : false;
        this.ctx.imageSmoothingEnabled = size === 1 ? true : false;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw original image to the scaled size
        this.ctx.drawImage(this.img, 0, 0, w * size, h * size);
        // then draw that scaled image thumb back to fill canvas
        // As smoothing is off the result will be pixelated
        this.ctx.drawImage(this.canvas, 0, 0, w * size, h * size, this.newX, this.newY, this.newWidth + .05 * w, this.newHeight + .05 * h);
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.onWindowResize);
    }

}
