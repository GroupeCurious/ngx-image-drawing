import { EventEmitter, OnInit } from '@angular/core';
export declare class ImageDrawingComponent implements OnInit {
    src?: string;
    onSave: EventEmitter<Blob>;
    onCancel: EventEmitter<void>;
    currentTool: string;
    currentSize: string;
    currentColor: string;
    canUndo: boolean;
    canRedo: boolean;
    private canvas?;
    private stack;
    constructor();
    ngOnInit(): void;
    selectTool(tool: string): void;
    selectDrawingSize(size: string): void;
    selectColor(color: string): void;
    undo(): void;
    redo(): void;
    clearCanvas(): void;
    saveImage(): void;
    cancel(): void;
    private setUndoRedo;
}
