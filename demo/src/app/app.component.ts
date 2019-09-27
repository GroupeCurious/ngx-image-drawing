import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { I18nInterface } from 'ngx-image-drawing';

@Component({
    selector: 'app-root',
    template: `
        <h1 style="text-align: center">
            <a target="_blank" href="https://github.com/GroupeCurious/ngx-image-drawing">ngx-image-drawing</a> demo app!
        </h1>

        <image-drawing [width]="width" [height]="height"
                       borderCss="1px solid black"
                       [showCancelButton]="false"
                       [enableLoadAnotherImage]="true" [enableRemoveImage]="true"
                       src="https://images.unsplash.com/photo-1565199953730-2ea3b119ae22?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                       (save)="saveBtn($event)"
                       [i18n]="i18n"
                       [locale]="locale"
                       [drawingSizes]="{ small: 5, medium: 10, large: 25, extra: 50 }"
        >
        </image-drawing>
    `,
    styles: []
})
export class AppComponent {

    public locale: string = 'en';
    public width = window.innerWidth - 60;
    public height = window.innerHeight - 250;

    public i18n: I18nInterface = {
        saveBtn: 'Save the image as JPEG !',
        sizes: {
            extra: 'Extra'
        }
    };

    constructor() {
        this.locale = this.getNavigatorLanguage();
    }

    public saveBtn($event) {
        saveAs($event, 'image.jpg');
    }

    private getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : (navigator as any).userLanguage || navigator.language || (navigator as any).browserLanguage || 'en';
}
