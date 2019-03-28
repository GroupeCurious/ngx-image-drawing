import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    @Output() public onSave: EventEmitter<Blob> = new EventEmitter<Blob>();
    @Output() public onCancel: EventEmitter<void> = new EventEmitter<void>();

    public currentTool: string = 'brush';
    public currentSize: string = 'medium';
    public currentColor: string = 'black';

    public canUndo: boolean = false;
    public canRedo: boolean = false;

    private canvas?: any;
    private stack: any[] = [];

    constructor() {
    }

    public ngOnInit(): void {
        const canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            isDrawingMode: true,
        });
        if (this.src) {
            canvas.setBackgroundImage(this.src, ((img: HTMLImageElement) => {
                canvas.setWidth(img.width);
                canvas.setHeight(img.height);
            }), {
                crossOrigin: 'anonymous',
                originX: 'left',
                originY: 'top'
            });
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
            if (size === 'small') {
                this.canvas.freeDrawingBrush.width = 5;
            } else if (size === 'medium') {
                this.canvas.freeDrawingBrush.width = 10;
            } else if (size === 'large') {
                this.canvas.freeDrawingBrush.width = 20;
            }
        }
    }

    public selectColor(color: string) {
        this.currentColor = color;
        if (this.canvas !== null && this.canvas !== undefined) {
            if (color === 'black') {
                this.canvas.freeDrawingBrush.color = '#000';
            } else if (color === 'white') {
                this.canvas.freeDrawingBrush.color = '#fff';
            } else if (color === 'yellow') {
                this.canvas.freeDrawingBrush.color = '#ffeb3b';
            } else if (color === 'red') {
                this.canvas.freeDrawingBrush.color = '#f44336';
            } else if (color === 'blue') {
                this.canvas.freeDrawingBrush.color = '#2196f3';
            } else if (color === 'green') {
                this.canvas.freeDrawingBrush.color = '#4caf50';
            }
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
        this.canvas.getElement().toBlob((data: Blob) => {
            this.onSave.emit(data);
        });
    }

    public cancel() {
        this.onCancel.emit();
    }

    private setUndoRedo() {
        this.canUndo = this.canvas.getObjects().length > 0;
        this.canRedo = this.stack.length > 0;
    }
}
