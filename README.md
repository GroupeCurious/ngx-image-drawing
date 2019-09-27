# Ngx Image Drawing

![Screenshot](.github/screenshot.jpg)

> Ps. No animals were harmed in taking this picture :P

## Description

This module allow to draw on pictures and export the result. (Uses `canvas` & `fabric.js`)

## Installation

`npm install --save ngx-image-drawing`

## Usage

Add the ImageDrawingModule to the imports of the module which will be using the drawing module.
```ts
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

You can now use in a component like so
```html
<image-drawing
    [src]="imageUrl"
    outputMimeType="'image/jpeg'"
    outputQuality="0.8"
    (save)="save($event)"
    (cancel)="cancel()">
</image-drawing>
```

### Inputs

- `src: string` : Image url
- `i18n: I18nInterface?` : Object with all text used (default value : 'I18nEn' )
- `outputMimeType: string?` : Mime Type of the output image, can be `image/png`, `image/jpeg` or `image/webp`
- `outputQuality: number?`: Number between 0 and 1 to determine the quality of the ouput image (if mimeType is jpeg or webp)
- `loadingTemplate: TemplateRef<any>?` : Image loading template
- `errorTemplate: TemplateRef<any>?` : Image loading error template
- `enableTooltip: boolean?` : Enable / disable tooltip for toolbar buttons/actions (default value: `true`)
- `tooltipLanguage: string?` : Language of tooltip (`en` or `fr`) (default value: `en`)
- `width: number?` : Width of the canvas (needed if no `src` given)
- `height: number?` : Height of the canvas (needed if no `src` given)
- `forceSizeCanvas: boolean` : Force the canvas to width and height of image or with those specified (default `true`)
- `forceSizeExport: boolean` : Force the exported image to width and height with those specified (default `false`)
- `borderCss: string?` : Add a border to the canvas in CSS (default value: `none`, example: `1px solib black`)
- `enableRemoveImage: boolean` : Enable the option to remove the image loaded (default `false`)
- `enableLoadAnotherImage: boolean` : Enable the option to load another image (default `false`)
- `showCancelButton: boolean` : Enable the cancel button (default `true`)
- `colors: { string: string }?` : Colors available for users (default `black, white, yellow, red, blue, green, purple`)
- `drawingSizes: { string: string }?` : Sizes available for users (default `5, 10, 25px`)

### Actions
- `save` - Action on save button click, use `$event` to get the new edited image
- `cancel` - Action on cancel button click

## Maintainers

- [@the0neyouseek](https://github.com/the0neyouseek)

## Contributors

- [@bambidotexe](https://github.com/bambidotexe)
- [@neelavar](https://github.com/neelavar)
- [@valentintintin](https://github.com/valentintintin)
