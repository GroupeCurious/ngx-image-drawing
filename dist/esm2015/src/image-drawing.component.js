import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { fabric } from 'fabric';
let ImageDrawingComponent = class ImageDrawingComponent {
    constructor() {
        this.saveBtnText = 'Save';
        this.cancelBtnText = 'Cancel';
        this.loadingText = 'Loading…';
        this.errorText = 'Error loading %@';
        this.onSave = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.currentTool = 'brush';
        this.currentSize = 'medium';
        this.currentColor = 'black';
        this.canUndo = false;
        this.canRedo = false;
        this.isLoading = true;
        this.hasError = false;
        this.errorMessage = '';
        this.stack = [];
    }
    ngOnInit() {
        const canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            isDrawingMode: true,
        });
        if (this.src !== undefined) {
            const imgEl = new Image();
            // imgEl.setAttribute('crossOrigin', 'anonymous');
            imgEl.src = this.src;
            imgEl.onerror = (event) => {
                console.error(event);
                this.isLoading = false;
                this.hasError = true;
                this.errorMessage = this.errorText.replace('%@', this.src);
            };
            imgEl.onload = () => {
                this.isLoading = false;
                const fabricImg = new fabric.Image(imgEl);
                canvas.setBackgroundImage(fabricImg, ((img) => {
                    if (img !== null) {
                        canvas.setWidth(img.width);
                        canvas.setHeight(img.height);
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
    selectTool(tool) {
        this.currentTool = tool;
    }
    selectDrawingSize(size) {
        this.currentSize = size;
        if (this.canvas !== null && this.canvas !== undefined) {
            if (size === 'small') {
                this.canvas.freeDrawingBrush.width = 5;
            }
            else if (size === 'medium') {
                this.canvas.freeDrawingBrush.width = 10;
            }
            else if (size === 'large') {
                this.canvas.freeDrawingBrush.width = 20;
            }
        }
    }
    selectColor(color) {
        this.currentColor = color;
        if (this.canvas !== null && this.canvas !== undefined) {
            if (color === 'black') {
                this.canvas.freeDrawingBrush.color = '#000';
            }
            else if (color === 'white') {
                this.canvas.freeDrawingBrush.color = '#fff';
            }
            else if (color === 'yellow') {
                this.canvas.freeDrawingBrush.color = '#ffeb3b';
            }
            else if (color === 'red') {
                this.canvas.freeDrawingBrush.color = '#f44336';
            }
            else if (color === 'blue') {
                this.canvas.freeDrawingBrush.color = '#2196f3';
            }
            else if (color === 'green') {
                this.canvas.freeDrawingBrush.color = '#4caf50';
            }
        }
    }
    // Actions
    undo() {
        if (this.canUndo) {
            const lastId = this.canvas.getObjects().length - 1;
            const lastObj = this.canvas.getObjects()[lastId];
            this.stack.push(lastObj);
            this.canvas.remove(lastObj);
            this.setUndoRedo();
        }
    }
    redo() {
        if (this.canRedo) {
            const firstInStack = this.stack.splice(-1, 1)[0];
            if (firstInStack !== null && firstInStack !== undefined) {
                this.canvas.insertAt(firstInStack, this.canvas.getObjects().length - 1);
            }
            this.setUndoRedo();
        }
    }
    clearCanvas() {
        if (this.canvas !== null && this.canvas !== undefined) {
            this.canvas.remove(...this.canvas.getObjects());
            this.setUndoRedo();
        }
    }
    saveImage() {
        this.canvas.getElement().toBlob((data) => {
            this.onSave.emit(data);
        });
    }
    cancel() {
        this.onCancel.emit();
    }
    setUndoRedo() {
        this.canUndo = this.canvas.getObjects().length > 0;
        this.canRedo = this.stack.length > 0;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], ImageDrawingComponent.prototype, "src", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ImageDrawingComponent.prototype, "saveBtnText", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ImageDrawingComponent.prototype, "cancelBtnText", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ImageDrawingComponent.prototype, "loadingText", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ImageDrawingComponent.prototype, "errorText", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", TemplateRef)
], ImageDrawingComponent.prototype, "loadingTemplate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", TemplateRef)
], ImageDrawingComponent.prototype, "errorTemplate", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ImageDrawingComponent.prototype, "onSave", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ImageDrawingComponent.prototype, "onCancel", void 0);
ImageDrawingComponent = tslib_1.__decorate([
    Component({
        selector: 'image-drawing',
        template: "<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n\n<div class=\"loading\" *ngIf=\"isLoading\">\n    <ng-container *ngTemplateOutlet=\"loadingTemplate ? loadingTemplate : defaultLoading\"></ng-container>\n</div>\n<div class=\"error\" *ngIf=\"hasError\">\n    <ng-container *ngTemplateOutlet=\"errorTemplate ? errorTemplate : defaultError\"></ng-container>\n</div>\n\n<ng-template #defaultLoading><p>{{ loadingText }}</p></ng-template>\n<ng-template #defaultError><p>{{ errorMessage }}</p></ng-template>\n\n<canvas id=\"canvas\"></canvas>\n<div class=\"toolbar\" *ngIf=\"!isLoading\">\n    <div class=\"tools\">\n        <div class=\"row\">\n            <i class=\"material-icons btn\" [class.selected]=\"currentTool == 'brush'\" (click)=\"selectTool('brush')\" title=\"Pinceau\">brush</i>\n            <span class=\"size small btn\" [class.selected]=\"currentSize == 'small'\" (click)=\"selectDrawingSize('small')\"\n                title=\"Taille: petit\"></span>\n            <span class=\"size medium btn\" [class.selected]=\"currentSize == 'medium'\" (click)=\"selectDrawingSize('medium')\"\n                title=\"Taille: moyen\"></span>\n            <span class=\"size large btn\" [class.selected]=\"currentSize == 'large'\" (click)=\"selectDrawingSize('large')\"\n                title=\"Taille: grand\"></span>\n            <i class=\"material-icons btn\" [class.disabled]=\"!canUndo\" (click)=\"undo()\" title=\"Annuler\">undo</i>\n            <i class=\"material-icons btn\" [class.disabled]=\"!canRedo\" (click)=\"redo()\" title=\"Refaire\">redo</i>\n            <i class=\"material-icons btn\" (click)=\"clearCanvas()\" title=\"Effacer tout\">delete</i>\n        </div>\n        <div class=\"row\">\n            <div class=\"color black\" [class.selected]=\"currentColor == 'black'\" (click)=\"selectColor('black')\" title=\"Noir\"></div>\n            <div class=\"color white\" [class.selected]=\"currentColor == 'white'\" (click)=\"selectColor('white')\" title=\"Blanc\"></div>\n            <div class=\"color yellow\" [class.selected]=\"currentColor == 'yellow'\" (click)=\"selectColor('yellow')\" title=\"Jaune\"></div>\n            <div class=\"color red\" [class.selected]=\"currentColor == 'red'\" (click)=\"selectColor('red')\" title=\"Rouge\"></div>\n            <div class=\"color green\" [class.selected]=\"currentColor == 'green'\" (click)=\"selectColor('green')\" title=\"Vert\"></div>\n            <div class=\"color blue\" [class.selected]=\"currentColor == 'blue'\" (click)=\"selectColor('blue')\" title=\"Bleu\"></div>\n        </div>\n    </div>\n    <div class=\"buttons\">\n        <a href=\"#\" class=\"button btn-primary\" (click)=\"saveImage(); $event.preventDefault();\">{{ saveBtnText }}</a>\n        <a href=\"#\" class=\"button btn-light\" (click)=\"cancel(); $event.preventDefault();\">{{ cancelBtnText }}</a>\n    </div>\n</div>\n",
        styles: [":host{display:flex;flex-direction:column;align-items:center}:host .toolbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}:host .tools{display:inline-flex;flex-direction:column;padding:20px;margin:10px;background:#fff;border-radius:6px;box-shadow:0 3px 10px rgba(0,0,0,.4)}:host .row{display:flex;width:300px;justify-content:space-around;align-items:center}:host .row:first-child{margin-bottom:10px}:host .btn{cursor:pointer}:host .btn.selected{color:#bdbdbd}:host .btn.disabled{cursor:initial;color:#bdbdbd}:host .size{background-color:#000}:host .size.selected{background-color:#bdbdbd}:host .size.small{height:12px;width:12px;border-radius:6px}:host .size.medium{height:16px;width:16px;border-radius:8px}:host .size.large{height:20px;width:20px;border-radius:10px}:host .color{width:28px;height:28px;border-radius:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}:host .color.selected::after{content:\"\";width:10px;height:10px;background:#000;display:flex;border-radius:5px}:host .color.black{background-color:#000}:host .color.black.selected::after{background:#fff}:host .color.white{border:1px solid #a7a7a7}:host .color.yellow{background-color:#ffeb3b}:host .color.red{background-color:#f44336}:host .color.blue{background-color:#2196f3}:host .color.green{background-color:#4caf50}:host .buttons{margin:10px;display:flex;flex-direction:column}:host .button{cursor:pointer;outline:0;border:none;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;min-width:64px;line-height:36px;padding:3px 16px;border-radius:4px;overflow:visible;transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1);margin:10px}:host .button:hover{text-decoration:none!important}:host .button.btn-primary{background-color:#ef5f27;color:#fff}:host .button.btn-primary:hover{background-color:rgba(239,95,39,.8)}:host .button.btn-light{color:#ef5f27}:host .button.btn-light:hover{background-color:rgba(239,95,39,.1)}"]
    }),
    tslib_1.__metadata("design:paramtypes", [])
], ImageDrawingComponent);
export { ImageDrawingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtZHJhd2luZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtZHJhd2luZy8iLCJzb3VyY2VzIjpbInNyYy9pbWFnZS1kcmF3aW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQU9oQyxJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtJQTJCOUI7UUF4QmdCLGdCQUFXLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLGtCQUFhLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLGdCQUFXLEdBQUcsVUFBVSxDQUFDO1FBQ3pCLGNBQVMsR0FBRyxrQkFBa0IsQ0FBQztRQUk5QixXQUFNLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFDdEQsYUFBUSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBRWxFLGdCQUFXLEdBQVcsT0FBTyxDQUFDO1FBQzlCLGdCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLGlCQUFZLEdBQVcsT0FBTyxDQUFDO1FBRS9CLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV6QixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsaUJBQVksR0FBRyxFQUFFLENBQUM7UUFHakIsVUFBSyxHQUFVLEVBQUUsQ0FBQztJQUcxQixDQUFDO0lBRU0sUUFBUTtRQUNYLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDdkMsV0FBVyxFQUFFLFNBQVM7WUFDdEIsYUFBYSxFQUFFLElBQUk7U0FDdEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsR0FB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VSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBQ0osQ0FBQTtBQXZKWTtJQUFSLEtBQUssRUFBRTs7a0RBQXFCO0FBQ3BCO0lBQVIsS0FBSyxFQUFFOzswREFBNkI7QUFDNUI7SUFBUixLQUFLLEVBQUU7OzREQUFpQztBQUNoQztJQUFSLEtBQUssRUFBRTs7MERBQWlDO0FBQ2hDO0lBQVIsS0FBSyxFQUFFOzt3REFBdUM7QUFDdEM7SUFBUixLQUFLLEVBQUU7c0NBQTBCLFdBQVc7OERBQU07QUFDMUM7SUFBUixLQUFLLEVBQUU7c0NBQXdCLFdBQVc7NERBQU07QUFFdkM7SUFBVCxNQUFNLEVBQUU7c0NBQWdCLFlBQVk7cURBQWtDO0FBQzdEO0lBQVQsTUFBTSxFQUFFO3NDQUFrQixZQUFZO3VEQUFrQztBQVhoRSxxQkFBcUI7SUFMakMsU0FBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGVBQWU7UUFFekIsODJGQUE2Qzs7S0FDaEQsQ0FBQzs7R0FDVyxxQkFBcUIsQ0F5SmpDO1NBekpZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmYWJyaWMgfSBmcm9tICdmYWJyaWMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2ltYWdlLWRyYXdpbmcnLFxuICAgIHN0eWxlVXJsczogWycuL2ltYWdlLWRyYXdpbmcuY29tcG9uZW50LnNjc3MnXSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vaW1hZ2UtZHJhd2luZy5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSW1hZ2VEcmF3aW5nQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIEBJbnB1dCgpIHB1YmxpYyBzcmM/OiBzdHJpbmc7XG4gICAgQElucHV0KCkgcHVibGljIHNhdmVCdG5UZXh0ID0gJ1NhdmUnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBjYW5jZWxCdG5UZXh0ID0gJ0NhbmNlbCc7XG4gICAgQElucHV0KCkgcHVibGljIGxvYWRpbmdUZXh0ID0gJ0xvYWRpbmfigKYnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBlcnJvclRleHQgPSAnRXJyb3IgbG9hZGluZyAlQCc7XG4gICAgQElucHV0KCkgcHVibGljIGxvYWRpbmdUZW1wbGF0ZT86IFRlbXBsYXRlUmVmPGFueT47XG4gICAgQElucHV0KCkgcHVibGljIGVycm9yVGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblNhdmU6IEV2ZW50RW1pdHRlcjxCbG9iPiA9IG5ldyBFdmVudEVtaXR0ZXI8QmxvYj4oKTtcbiAgICBAT3V0cHV0KCkgcHVibGljIG9uQ2FuY2VsOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgICBwdWJsaWMgY3VycmVudFRvb2w6IHN0cmluZyA9ICdicnVzaCc7XG4gICAgcHVibGljIGN1cnJlbnRTaXplOiBzdHJpbmcgPSAnbWVkaXVtJztcbiAgICBwdWJsaWMgY3VycmVudENvbG9yOiBzdHJpbmcgPSAnYmxhY2snO1xuXG4gICAgcHVibGljIGNhblVuZG86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgY2FuUmVkbzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGlzTG9hZGluZyA9IHRydWU7XG4gICAgcHVibGljIGhhc0Vycm9yID0gZmFsc2U7XG4gICAgcHVibGljIGVycm9yTWVzc2FnZSA9ICcnO1xuXG4gICAgcHJpdmF0ZSBjYW52YXM/OiBhbnk7XG4gICAgcHJpdmF0ZSBzdGFjazogYW55W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoJ2NhbnZhcycsIHtcbiAgICAgICAgICAgIGhvdmVyQ3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICBpc0RyYXdpbmdNb2RlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuc3JjICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGltZ0VsID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAvLyBpbWdFbC5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpO1xuICAgICAgICAgICAgaW1nRWwuc3JjID0gdGhpcy5zcmM7XG4gICAgICAgICAgICBpbWdFbC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihldmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IHRoaXMuZXJyb3JUZXh0LnJlcGxhY2UoJyVAJywgdGhpcy5zcmMgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbWdFbC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBmYWJyaWNJbWcgPSBuZXcgZmFicmljLkltYWdlKGltZ0VsKTtcbiAgICAgICAgICAgICAgICBjYW52YXMuc2V0QmFja2dyb3VuZEltYWdlKGZhYnJpY0ltZywgKChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGltZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzLnNldFdpZHRoKGltZy53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMuc2V0SGVpZ2h0KGltZy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiAnYW5vbnltb3VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpblg6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpblk6ICd0b3AnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbnZhcy5vbigncGF0aDpjcmVhdGVkJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuc2V0VW5kb1JlZG8oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuc2VsZWN0VG9vbCh0aGlzLmN1cnJlbnRUb29sKTtcbiAgICAgICAgdGhpcy5zZWxlY3RDb2xvcih0aGlzLmN1cnJlbnRDb2xvcik7XG4gICAgICAgIHRoaXMuc2VsZWN0RHJhd2luZ1NpemUodGhpcy5jdXJyZW50U2l6ZSk7XG4gICAgfVxuXG4gICAgLy8gVG9vbHNcblxuICAgIHB1YmxpYyBzZWxlY3RUb29sKHRvb2w6IHN0cmluZykge1xuICAgICAgICB0aGlzLmN1cnJlbnRUb29sID0gdG9vbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0RHJhd2luZ1NpemUoc2l6ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNpemUgPSBzaXplO1xuICAgICAgICBpZiAodGhpcy5jYW52YXMgIT09IG51bGwgJiYgdGhpcy5jYW52YXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKHNpemUgPT09ICdzbWFsbCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLndpZHRoID0gNTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2l6ZSA9PT0gJ21lZGl1bScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLndpZHRoID0gMTA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNpemUgPT09ICdsYXJnZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLndpZHRoID0gMjA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0Q29sb3IoY29sb3I6IHN0cmluZykge1xuICAgICAgICB0aGlzLmN1cnJlbnRDb2xvciA9IGNvbG9yO1xuICAgICAgICBpZiAodGhpcy5jYW52YXMgIT09IG51bGwgJiYgdGhpcy5jYW52YXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGNvbG9yID09PSAnYmxhY2snKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjMDAwJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgPT09ICd3aGl0ZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLmNvbG9yID0gJyNmZmYnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2xvciA9PT0gJ3llbGxvdycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLmNvbG9yID0gJyNmZmViM2InO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2xvciA9PT0gJ3JlZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLmNvbG9yID0gJyNmNDQzMzYnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2xvciA9PT0gJ2JsdWUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjMjE5NmYzJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgPT09ICdncmVlbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLmNvbG9yID0gJyM0Y2FmNTAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWN0aW9uc1xuXG4gICAgcHVibGljIHVuZG8oKSB7XG4gICAgICAgIGlmICh0aGlzLmNhblVuZG8pIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RJZCA9IHRoaXMuY2FudmFzLmdldE9iamVjdHMoKS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgY29uc3QgbGFzdE9iaiA9IHRoaXMuY2FudmFzLmdldE9iamVjdHMoKVtsYXN0SWRdO1xuICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGxhc3RPYmopO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlKGxhc3RPYmopO1xuICAgICAgICAgICAgdGhpcy5zZXRVbmRvUmVkbygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlZG8oKSB7XG4gICAgICAgIGlmICh0aGlzLmNhblJlZG8pIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0SW5TdGFjayA9IHRoaXMuc3RhY2suc3BsaWNlKC0xLCAxKVswXTtcbiAgICAgICAgICAgIGlmIChmaXJzdEluU3RhY2sgIT09IG51bGwgJiYgZmlyc3RJblN0YWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5pbnNlcnRBdChmaXJzdEluU3RhY2ssIHRoaXMuY2FudmFzLmdldE9iamVjdHMoKS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0VW5kb1JlZG8oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckNhbnZhcygpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzICE9PSBudWxsICYmIHRoaXMuY2FudmFzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZSguLi50aGlzLmNhbnZhcy5nZXRPYmplY3RzKCkpO1xuICAgICAgICAgICAgdGhpcy5zZXRVbmRvUmVkbygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNhdmVJbWFnZSgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMuZ2V0RWxlbWVudCgpLnRvQmxvYigoZGF0YTogQmxvYikgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblNhdmUuZW1pdChkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5vbkNhbmNlbC5lbWl0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRVbmRvUmVkbygpIHtcbiAgICAgICAgdGhpcy5jYW5VbmRvID0gdGhpcy5jYW52YXMuZ2V0T2JqZWN0cygpLmxlbmd0aCA+IDA7XG4gICAgICAgIHRoaXMuY2FuUmVkbyA9IHRoaXMuc3RhY2subGVuZ3RoID4gMDtcbiAgICB9XG59XG4iXX0=