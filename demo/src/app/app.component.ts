import { Component } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-root',
    template: `
        <h1><a target="_blank" href="https://github.com/GroupeCurious/ngx-image-drawing">ngx-image-drawing</a> demo app
            !</h1>

        <image-drawing width="800" height="600"
                       borderCss="1px solid black"
                       [showCancelButton]="false"
                       saveBtnText="Save the image as JPEG !"
                       enableLoadAnotherImage="true" enableRemoveImage="true"
                       src="https://images.unsplash.com/photo-1537984827217-96d3397ba7ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80"
                       (save)="saveBtn($event)"
        >
        </image-drawing>`,
    styles: []
})
export class AppComponent {

    public saveBtn($event) {
        saveAs($event, 'image.jpg');
    }
}
