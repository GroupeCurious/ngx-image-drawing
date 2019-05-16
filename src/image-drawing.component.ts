import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { fabric } from 'fabric';

@Component({
    selector: 'image-drawing',
    styleUrls: ['./image-drawing.component.scss'],
    templateUrl: './image-drawing.component.html'
})
export class ImageDrawingComponent implements OnInit {

    @Input() public src?: string;
    @Input() public saveBtnText = 'Save';
    @Input() public cancelBtnText = 'Cancel';
    @Input() public loadingText = 'Loading…';
    @Input() public errorText = 'Error loading %@';
    @Input() public loadingTemplate?: TemplateRef<any>;
    @Input() public errorTemplate?: TemplateRef<any>;
    @Input() public outputMimeType = 'image/jpeg';
    @Input() public outputQuality = 0.8;
    @Input() public imageScale = 1.0;
    @Input() public enableTooltip = true;
    // TODO: Implement i18n
    @Input() public tooltipLanguage: 'en' | 'fr' = 'en';

    @Output() public save: EventEmitter<Blob> = new EventEmitter<Blob>();
    @Output() public cancel: EventEmitter<void> = new EventEmitter<void>();

    public currentTool = 'brush';
    public currentSize = 'medium';
    public currentColor = 'black';

    public canUndo = false;
    public canRedo = false;

    public isLoading = true;
    public hasError = false;
    public errorMessage = '';

    private canvas?: any;
    private stack: any[] = [];

    drawingSizes = ['small', 'medium', 'large'];
    private drawingSize: { [name: string]: number } = {
        small: 5,
        medium: 10,
        large: 20
    };
    private tooltip: { [name: string]: { en: string, fr: string } } = {
        small: { en: 'Small', fr: 'Taille: petit' },
        medium: { en: 'Medium', fr: 'Taille: moyen' },
        large: { en: 'Large', fr: 'Taille: grand' },
        undo: { en: 'Undo', fr: 'Annuler' },
        redo: { en: 'Redo', fr: 'Refaire' },
        clear: { en: 'Clear', fr: 'Effacer tout' },
        black: { en: 'Black', fr: 'Noir' },
        white: { en: 'White', fr: 'Blanc' },
        yellow: { en: 'Yellow', fr: 'Jaune' },
        red: { en: 'Red', fr: 'Rouge' },
        green: { en: 'Green', fr: 'Vert' },
        blue: { en: 'Blue', fr: 'Bleu' },
        brush: { en: 'Brush', fr: 'Pinceau'}
    };

    public ink: { [name: string]: string } = {
        black: '#000',
        white: '#fff',
        yellow: '#ffeb3b',
        red: '#f44336',
        blue: '#2196f3',
        green: '#4caf50'
    };

    public colors = Object.keys(this.ink);

    constructor() {
    }

    public ngOnInit(): void {
        const canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            isDrawingMode: true,
        });
        if (this.src !== undefined) {
            let isFirstTry = true;
            const imgEl = new Image();
            imgEl.setAttribute('crossOrigin', 'anonymous');
            imgEl.src = this.src;
            imgEl.onerror = () => {
                // Retry with cors proxy
                if (isFirstTry) {
                    imgEl.src = 'http://cors-anywhere.herokuapp.com/' + this.src;
                    isFirstTry = false;
                } else {
                    this.isLoading = false;
                    this.hasError = true;
                    this.errorMessage = this.errorText.replace('%@', this.src as string);
                }
            };
            imgEl.onload = () => {
                this.isLoading = false;
                const fabricImg = new fabric.Image(imgEl);
                fabricImg.scaleToWidth(imgEl.width * this.imageScale, false);
                canvas.setBackgroundImage(fabricImg, ((img: HTMLImageElement) => {
                    if (img !== null) {
                        canvas.setWidth(img.width * this.imageScale);
                        canvas.setHeight(img.height * this.imageScale);
                    }
                }), {
                        crossOrigin: 'anonymous',
                        originX: 'left',
                        originY: 'top'
                    });
            };
        }

        canvas.on('path:created', (e) => {
            this.stack = [];
            this.setUndoRedo();
        });

        this.canvas = canvas;
        this.selectTool(this.currentTool);
        this.selectColor(this.currentColor);
        this.selectDrawingSize(this.currentSize);
    }

    // Tools

    public selectTool(tool: string) {
        this.currentTool = tool;
    }

    public selectDrawingSize(size: string) {
        this.currentSize = size;
        if (this.canvas !== null && this.canvas !== undefined) {
            this.canvas.freeDrawingBrush.width = this.drawingSize[size];
        }
    }

    public selectColor(color: string) {
        this.currentColor = color;
        if (this.canvas !== null && this.canvas !== undefined) {
            this.canvas.freeDrawingBrush.color = this.ink[color];
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
            if (firstInStack !== null && firstInStack !== undefined) {
                this.canvas.insertAt(firstInStack, this.canvas.getObjects().length - 1);
            }
            this.setUndoRedo();
        }
    }

    public clearCanvas() {
        if (this.canvas !== null && this.canvas !== undefined) {
            this.canvas.remove(...this.canvas.getObjects());
            this.setUndoRedo();
        }
    }

    public saveImage() {
        this.canvas.getElement().toBlob(
            (data: Blob) => {
                this.save.emit(data);
            },
            this.outputMimeType,
            this.outputQuality
        );
    }

    public cancelAction() {
        this.cancel.emit();
    }

    public getTooltip(name: string): string {
        return this.enableTooltip ? this.tooltip[name][this.tooltipLanguage] : '';
    }

    private setUndoRedo() {
        this.canUndo = this.canvas.getObjects().length > 0;
        this.canRedo = this.stack.length > 0;
    }
}
