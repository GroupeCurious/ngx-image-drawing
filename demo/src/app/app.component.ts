import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { I18nInterface } from 'ngx-image-drawing';

@Component({
    selector: 'app-root',
    template: `
        <h1><a target="_blank" href="https://github.com/GroupeCurious/ngx-image-drawing">ngx-image-drawing</a> demo app
            !</h1>

        <image-drawing width="800" height="600"
                       borderCss="1px solid black"
                       [showCancelButton]="false"
                       enableLoadAnotherImage="true" enableRemoveImage="true"
                       src="https://images.unsplash.com/photo-1565199953730-2ea3b119ae22?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                       (save)="saveBtn($event)"
                       [i18n]="i18n"
                       locale="en"
                       [drawingSizes]="{ small: 5, medium: 10, large: 25, extra: 50 }"
        >
        </image-drawing>`,
    styles: []
})
export class AppComponent {

    public i18n: I18nInterface = {
        saveBtn: 'Save the image as JPEG !',
        sizes: {
            extra: 'Extra'
        }
    };

    public saveBtn($event) {
        saveAs($event, 'image.jpg');
    }
}
