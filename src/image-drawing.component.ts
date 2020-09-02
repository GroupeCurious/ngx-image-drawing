import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { fabric } from 'fabric';
import { I18nEn, I18nInterface, i18nLanguages } from './i18n';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'image-drawing',
    styleUrls: ['./image-drawing.component.scss'],
    templateUrl: './image-drawing.component.html'
})
export class ImageDrawingComponent implements OnInit, OnChanges {

    @Input() public src?: string;
    @Input() public width?: number;
    @Input() public height?: number;

    @Input() public forceSizeCanvas = true;
    @Input() public forceSizeExport = false;
    @Input() public enableRemoveImage = false;
    @Input() public enableLoadAnotherImage = false;
    @Input() public enableTooltip = true;
    @Input() public showCancelButton = true;

    // @ts-ignore
    @Input('i18n') public i18nUser: I18nInterface;
    @Input() public locale: string = 'en';
    /* @deprecated Use i18n.saveBtn */
    @Input() public saveBtnText = 'Save';
    /* @deprecated Use i18n.cancelBtn */
    @Input() public cancelBtnText = 'Cancel';
    /* @deprecated Use i18n.loading */
    @Input() public loadingText = 'Loading…';
    /* @deprecated Use i18n.loadError */
    @Input() public errorText = 'Error loading %@';

    @Input() public loadingTemplate?: TemplateRef<any>;
    @Input() public errorTemplate?: TemplateRef<any>;

    @Input() public outputMimeType = 'image/jpeg';
    @Input() public outputQuality = 0.8;

    @Input() public borderCss: string = 'none';

    @Input() public drawingSizes: { [name: string]: number } = {
        small: 5,
        medium: 10,
        large: 25,
    };

    @Input() public colors: { [name: string]: string } = {
        black: '#000',
        white: '#fff',
        yellow: '#ffeb3b',
        red: '#f44336',
        blue: '#2196f3',
        green: '#4caf50',
        purple: '#7a08af',
    };

    @Output() public save: EventEmitter<Blob> = new EventEmitter<Blob>();
    @Output() public cancel: EventEmitter<void> = new EventEmitter<void>();

    public currentTool = 'brush';
    public currentSize = 'medium';
    public currentColor = 'black';
    public i18n: I18nInterface = I18nEn;

    public canUndo = false;
    public canRedo = false;

    public isLoading = false;
    public hasError = false;
    public errorMessage = '';

    private canvas: fabric.Canvas;
    private stack: fabric.Object[] = [];

    public colorsName: string[] = [];
    public drawingSizesName: string[] = [];

    private imageUsed?: fabric.Image;

    constructor() {
    }

    public ngOnInit(): void {
        this.colorsName = Object.keys(this.colors);
        this.drawingSizesName = Object.keys(this.drawingSizes);

        this.canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            isDrawingMode: true,
        });
        this.canvas.backgroundColor = 'white';

        if (this.src) {
            this.importPhotoFromSrc(this.src);
        } else {
            if (!this.width || !this.height) {
                throw new Error('No width or hight given !');
            }

            this.canvas.setWidth(this.width);
            this.canvas.setHeight(this.height);
        }

        this.canvas.on('path:created', () => {
            this.stack = [];
            this.setUndoRedo();
        });

        this.selectTool(this.currentTool);
        this.selectColor(this.currentColor);
        this.selectDrawingSize(this.currentSize);

        if (this.locale && i18nLanguages[this.locale.toLowerCase()]) {
            this.i18n = i18nLanguages[this.locale.toLowerCase()];
        }

        // FIXME remove after a while because properties are now deprecated
        if (this.saveBtnText) {
            this.i18n.saveBtn = this.saveBtnText;
        }
        if (this.cancelBtnText) {
            this.i18n.cancelBtn = this.cancelBtnText;
        }
        if (this.loadingText) {
            this.i18n.loading = this.loadingText;
        }
        if (this.errorText) {
            this.i18n.loadError = this.errorText;
        }
    }

    // Tools
    public selectTool(tool: string) {
        this.currentTool = tool;
    }

    public selectDrawingSize(size: string) {
        this.currentSize = size;
        if (this.canvas) {
            this.canvas.freeDrawingBrush.width = this.drawingSizes[size];
        }
    }

    public selectColor(color: string) {
        this.currentColor = color;
        if (this.canvas) {
            this.canvas.freeDrawingBrush.color = this.colors[color];
        }
    }

    // Actions

    public undo() {
        if (this.canUndo) {
            const lastId = this.canvas.getObjects().length - 1;
            const lastObj = this.canvas.getObjects()[lastId];
            this.stack.push(lastObj);
            this.canvas.remove(lastObj);
            this.setUndoRedo();
        }
    }

    public redo() {
        if (this.canRedo) {
            const firstInStack = this.stack.splice(-1, 1)[0];
            if (firstInStack) {
                this.canvas.insertAt(firstInStack, this.canvas.getObjects().length - 1, false);
            }
            this.setUndoRedo();
        }
    }

    public clearCanvas() {
        if (this.canvas) {
            this.canvas.remove(...this.canvas.getObjects());
            this.setUndoRedo();
        }
    }

    public saveImage() {
        if (!this.forceSizeExport || (this.forceSizeExport && this.width && this.height)) {
            const canvasScaledElement: HTMLCanvasElement = document.createElement('canvas');
            const canvasScaled = new fabric.Canvas(canvasScaledElement);
            canvasScaled.backgroundColor = 'white';

            new Observable<fabric.Canvas>(observer => {
                if (this.imageUsed) {
                    if (this.forceSizeExport) {
                        canvasScaled.setWidth(this.width);
                        canvasScaled.setHeight(this.height);

                        this.imageUsed.cloneAsImage(imageCloned => {
                            imageCloned.scaleToWidth(this.width, false);
                            imageCloned.scaleToHeight(this.height, false);

                            canvasScaled.setBackgroundImage(imageCloned, (img: HTMLImageElement) => {
                                if (!img) {
                                    observer.error(new Error('Impossible to draw the image on the temporary canvas'));
                                }

                                observer.next(canvasScaled);
                                observer.complete();
                            }, {
                                crossOrigin: 'anonymous',
                                originX: 'left',
                                originY: 'top'
                            });
                        });
                    } else {
                        canvasScaled.setBackgroundImage(this.imageUsed, (img: HTMLImageElement) => {
                            if (!img) {
                                observer.error(new Error('Impossible to draw the image on the temporary canvas'));
                            }

                            canvasScaled.setWidth(img.width);
                            canvasScaled.setHeight(img.height);

                            observer.next(canvasScaled);
                            observer.complete();
                        }, {
                            crossOrigin: 'anonymous',
                            originX: 'left',
                            originY: 'top'
                        });
                    }
                } else {
                    canvasScaled.setWidth(this.width);
                    canvasScaled.setHeight(this.height);
                }
            }).pipe(
                switchMap(() => {
                    let process = of(canvasScaled);

                    if (this.canvas.getObjects().length > 0) {
                        const ratioX = canvasScaled.getWidth() / this.canvas.getWidth();
                        const ratioY = canvasScaled.getHeight() / this.canvas.getHeight();

                        this.canvas.getObjects().forEach((originalObject: fabric.Object, i: number) => {
                            process = process.pipe(switchMap(() => {
                                return new Observable<fabric.Canvas>(observerObject => {
                                    originalObject.clone((clonedObject: fabric.Object) => {
                                        clonedObject.set('left', originalObject.left * ratioX);
                                        clonedObject.set('top', originalObject.top * ratioY);
                                        clonedObject.scaleToWidth(originalObject.width * ratioX);
                                        clonedObject.scaleToHeight(originalObject.height * ratioY);

                                        canvasScaled.insertAt(clonedObject, i, false);
                                        canvasScaled.renderAll();

                                        observerObject.next(canvasScaled);
                                        observerObject.complete();
                                    });
                                });
                            }));
                        });
                    }
                    return process;
                }),
            ).subscribe(() => {
                canvasScaled.renderAll();
                canvasScaled.getElement().toBlob(
                    (data: Blob) => {
                        this.save.emit(data);
                    },
                    this.outputMimeType,
                    this.outputQuality
                );
            });
        } else {
            this.canvas.getElement().toBlob(
                (data: Blob) => {
                    this.save.emit(data);
                },
                this.outputMimeType,
                this.outputQuality
            );
        }
    }

    public cancelAction() {
        this.cancel.emit();
    }

    public getTextTranslated(name: string): string {
        let strOk = name.split('.').reduce((o, i) => o[i], this.i18n as any);

        if (this.i18nUser) {
            try {
                const str = name.split('.').reduce((o, i) => o[i], this.i18nUser as any);
                if (str) {
                    strOk = str;
                }
            } catch (e) {
                // if we pass here, ignored
            }
        }

        if (!strOk) {
            console.error(name + ' translation not found !');
        }

        return strOk;
    }

    public getTooltipTranslated(name: string): string {
        if (this.enableTooltip) {
            return this.getTextTranslated(name)
        } else {
            return '';
        }
    }

    private setUndoRedo() {
        this.canUndo = this.canvas.getObjects().length > 0;
        this.canRedo = this.stack.length > 0;
        // this.canvas.renderAll();
    }

    public importPhotoFromFile(event: Event | any) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file.type.match('image.*')) {
                this.importPhotoFromBlob(file);
            } else {
                throw new Error('Not an image !');
            }
        }
    }

    public removeImage() {
        if (this.imageUsed) {
            this.imageUsed.dispose();
            this.imageUsed = null;
        }
        this.canvas.backgroundImage = null;

        if (this.width && this.height) {
            this.canvas.setWidth(this.width);
            this.canvas.setHeight(this.height);
        }

        this.canvas.renderAll();
    }

    public get hasImage(): boolean {
        return !!this.canvas.backgroundImage;
    }

    private importPhotoFromSrc(src: string) {
        this.isLoading = true;
        let isFirstTry = true;
        const imgEl = new Image();
        imgEl.setAttribute('crossOrigin', 'anonymous');
        imgEl.src = src;
        imgEl.onerror = () => {
            // Retry with cors proxy
            if (isFirstTry) {
                imgEl.src = 'https://cors-anywhere.herokuapp.com/' + this.src;
                isFirstTry = false;
            } else {
                this.isLoading = false;
                this.hasError = true;
                this.errorMessage = this.getTextTranslated('loadError').replace('%@', this.src as string);
            }
        };
        imgEl.onload = () => {
            this.isLoading = false;
            this.imageUsed = new fabric.Image(imgEl);

            this.imageUsed.cloneAsImage(image => {
                let width = imgEl.width;
                let height = imgEl.height;

                if (this.width) {
                    width = this.width;
                }
                if (this.height) {
                    height = this.height;
                }

                image.scaleToWidth(width, false);
                image.scaleToHeight(height, false);

                this.canvas.setBackgroundImage(image, ((img: HTMLImageElement) => {
                    if (img) {
                        if (this.forceSizeCanvas) {
                            this.canvas.setWidth(width);
                            this.canvas.setHeight(height);
                        } else {
                            this.canvas.setWidth(image.getScaledWidth());
                            this.canvas.setHeight(image.getScaledHeight());
                        }
                    }
                }), {
                    crossOrigin: 'anonymous',
                    originX: 'left',
                    originY: 'top'
                });
            });
        };
    }

    private importPhotoFromBlob(file: Blob | File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (evtReader: any) => {
            if (evtReader.target.readyState == FileReader.DONE) {
                this.importPhotoFromSrc(evtReader.target.result);
            }
        };
    }

    public importPhotoFromUrl() {
        const url = prompt(this.getTooltipTranslated('loadImageUrl'));
        if (url) {
            this.importPhotoFromSrc(url);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.src && !changes.src.firstChange && changes.src.currentValue) {
            if (typeof changes.src.currentValue === 'string') {
                this.importPhotoFromSrc(changes.src.currentValue);
            } else if (changes.src.currentValue instanceof Blob) {
                this.importPhotoFromBlob(changes.src.currentValue);
            }
        }
    }
}
