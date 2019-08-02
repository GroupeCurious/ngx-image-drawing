import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageDrawingComponent } from './image-drawing.component';

@NgModule({
    declarations: [
        ImageDrawingComponent
    ],
    exports: [
        ImageDrawingComponent,
    ],
    imports: [
        CommonModule
    ]
})
export class ImageDrawingModule {}
