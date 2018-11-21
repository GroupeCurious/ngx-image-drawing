# Angular module to draw on images

## Installation

`npm install --save ngx-image-drawing`

## Usage

Add the ImageDrawingModule to the imports of the module which will be using the drawing module.
```
import { NgModule } from '@angular/core';
import { ImageDrawingModule } from 'ngx-image-drawing';

@NgModule({
    imports: [
        ...
        ImageDrawingModule
    ],
    declarations: [
        ...
    ],
    exports: [
        ...
    ],
    providers: [
        ...
    ]
})
export class YourModule {
}
```