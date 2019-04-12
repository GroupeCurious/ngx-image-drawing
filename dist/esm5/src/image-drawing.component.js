import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { fabric } from 'fabric';
var ImageDrawingComponent = /** @class */ (function () {
    function ImageDrawingComponent() {
        this.saveBtnText = 'Save';
        this.cancelBtnText = 'Cancel';
        this.loadingText = 'Loading…';
        this.errorText = 'Error loading %@';
        this.outputMimeType = 'image/jpeg';
        this.outputQuality = 0.8;
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
    ImageDrawingComponent.prototype.ngOnInit = function () {
        var _this = this;
        var canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            isDrawingMode: true,
        });
        if (this.src !== undefined) {
            var isFirstTry_1 = true;
            var imgEl_1 = new Image();
            imgEl_1.setAttribute('crossOrigin', 'anonymous');
            imgEl_1.src = this.src;
            imgEl_1.onerror = function () {
                // Retry with cors proxy
                if (isFirstTry_1) {
                    imgEl_1.src = 'http://cors-anywhere.herokuapp.com/' + _this.src;
                    isFirstTry_1 = false;
                }
                else {
                    _this.isLoading = false;
                    _this.hasError = true;
                    _this.errorMessage = _this.errorText.replace('%@', _this.src);
                }
            };
            imgEl_1.onload = function () {
                _this.isLoading = false;
                var fabricImg = new fabric.Image(imgEl_1);
                canvas.setBackgroundImage(fabricImg, (function (img) {
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
        canvas.on('path:created', function (e) {
            _this.stack = [];
            _this.setUndoRedo();
        });
        this.canvas = canvas;
        this.selectTool(this.currentTool);
        this.selectColor(this.currentColor);
        this.selectDrawingSize(this.currentSize);
    };
    // Tools
    ImageDrawingComponent.prototype.selectTool = function (tool) {
        this.currentTool = tool;
    };
    ImageDrawingComponent.prototype.selectDrawingSize = function (size) {
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
    };
    ImageDrawingComponent.prototype.selectColor = function (color) {
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
    };
    // Actions
    ImageDrawingComponent.prototype.undo = function () {
        if (this.canUndo) {
            var lastId = this.canvas.getObjects().length - 1;
            var lastObj = this.canvas.getObjects()[lastId];
            this.stack.push(lastObj);
            this.canvas.remove(lastObj);
            this.setUndoRedo();
        }
    };
    ImageDrawingComponent.prototype.redo = function () {
        if (this.canRedo) {
            var firstInStack = this.stack.splice(-1, 1)[0];
            if (firstInStack !== null && firstInStack !== undefined) {
                this.canvas.insertAt(firstInStack, this.canvas.getObjects().length - 1);
            }
            this.setUndoRedo();
        }
    };
    ImageDrawingComponent.prototype.clearCanvas = function () {
        var _a;
        if (this.canvas !== null && this.canvas !== undefined) {
            (_a = this.canvas).remove.apply(_a, tslib_1.__spread(this.canvas.getObjects()));
            this.setUndoRedo();
        }
    };
    ImageDrawingComponent.prototype.saveImage = function () {
        var _this = this;
        this.canvas.getElement().toBlob(function (data) {
            _this.onSave.emit(data);
        }, this.outputMimeType, this.outputQuality);
    };
    ImageDrawingComponent.prototype.cancel = function () {
        this.onCancel.emit();
    };
    ImageDrawingComponent.prototype.setUndoRedo = function () {
        this.canUndo = this.canvas.getObjects().length > 0;
        this.canRedo = this.stack.length > 0;
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
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ImageDrawingComponent.prototype, "outputMimeType", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ImageDrawingComponent.prototype, "outputQuality", void 0);
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
    return ImageDrawingComponent;
}());
export { ImageDrawingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtZHJhd2luZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtZHJhd2luZy8iLCJzb3VyY2VzIjpbInNyYy9pbWFnZS1kcmF3aW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQU9oQztJQTZCSTtRQTFCZ0IsZ0JBQVcsR0FBRyxNQUFNLENBQUM7UUFDckIsa0JBQWEsR0FBRyxRQUFRLENBQUM7UUFDekIsZ0JBQVcsR0FBRyxVQUFVLENBQUM7UUFDekIsY0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBRy9CLG1CQUFjLEdBQVksWUFBWSxDQUFDO1FBQ3ZDLGtCQUFhLEdBQVksR0FBRyxDQUFDO1FBRTVCLFdBQU0sR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUN0RCxhQUFRLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFFbEUsZ0JBQVcsR0FBVyxPQUFPLENBQUM7UUFDOUIsZ0JBQVcsR0FBVyxRQUFRLENBQUM7UUFDL0IsaUJBQVksR0FBVyxPQUFPLENBQUM7UUFFL0IsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQUdqQixVQUFLLEdBQVUsRUFBRSxDQUFDO0lBRzFCLENBQUM7SUFFTSx3Q0FBUSxHQUFmO1FBQUEsaUJBOENDO1FBN0NHLElBQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDdkMsV0FBVyxFQUFFLFNBQVM7WUFDdEIsYUFBYSxFQUFFLElB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IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZhYnJpYyB9IGZyb20gJ2ZhYnJpYyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaW1hZ2UtZHJhd2luZycsXG4gICAgc3R5bGVVcmxzOiBbJy4vaW1hZ2UtZHJhd2luZy5jb21wb25lbnQuc2NzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9pbWFnZS1kcmF3aW5nLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJbWFnZURyYXdpbmdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgcHVibGljIHNyYz86IHN0cmluZztcbiAgICBASW5wdXQoKSBwdWJsaWMgc2F2ZUJ0blRleHQgPSAnU2F2ZSc7XG4gICAgQElucHV0KCkgcHVibGljIGNhbmNlbEJ0blRleHQgPSAnQ2FuY2VsJztcbiAgICBASW5wdXQoKSBwdWJsaWMgbG9hZGluZ1RleHQgPSAnTG9hZGluZ+KApic7XG4gICAgQElucHV0KCkgcHVibGljIGVycm9yVGV4dCA9ICdFcnJvciBsb2FkaW5nICVAJztcbiAgICBASW5wdXQoKSBwdWJsaWMgbG9hZGluZ1RlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBASW5wdXQoKSBwdWJsaWMgZXJyb3JUZW1wbGF0ZT86IFRlbXBsYXRlUmVmPGFueT47XG4gICAgQElucHV0KCkgcHVibGljIG91dHB1dE1pbWVUeXBlPzogc3RyaW5nID0gJ2ltYWdlL2pwZWcnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBvdXRwdXRRdWFsaXR5PzogbnVtYmVyID0gMC44O1xuXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblNhdmU6IEV2ZW50RW1pdHRlcjxCbG9iPiA9IG5ldyBFdmVudEVtaXR0ZXI8QmxvYj4oKTtcbiAgICBAT3V0cHV0KCkgcHVibGljIG9uQ2FuY2VsOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgICBwdWJsaWMgY3VycmVudFRvb2w6IHN0cmluZyA9ICdicnVzaCc7XG4gICAgcHVibGljIGN1cnJlbnRTaXplOiBzdHJpbmcgPSAnbWVkaXVtJztcbiAgICBwdWJsaWMgY3VycmVudENvbG9yOiBzdHJpbmcgPSAnYmxhY2snO1xuXG4gICAgcHVibGljIGNhblVuZG86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgY2FuUmVkbzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGlzTG9hZGluZyA9IHRydWU7XG4gICAgcHVibGljIGhhc0Vycm9yID0gZmFsc2U7XG4gICAgcHVibGljIGVycm9yTWVzc2FnZSA9ICcnO1xuXG4gICAgcHJpdmF0ZSBjYW52YXM/OiBhbnk7XG4gICAgcHJpdmF0ZSBzdGFjazogYW55W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoJ2NhbnZhcycsIHtcbiAgICAgICAgICAgIGhvdmVyQ3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICBpc0RyYXdpbmdNb2RlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuc3JjICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxldCBpc0ZpcnN0VHJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IGltZ0VsID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWdFbC5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpO1xuICAgICAgICAgICAgaW1nRWwuc3JjID0gdGhpcy5zcmM7XG4gICAgICAgICAgICBpbWdFbC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFJldHJ5IHdpdGggY29ycyBwcm94eVxuICAgICAgICAgICAgICAgIGlmIChpc0ZpcnN0VHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGltZ0VsLnNyYyA9ICdodHRwOi8vY29ycy1hbnl3aGVyZS5oZXJva3VhcHAuY29tLycgKyB0aGlzLnNyYztcbiAgICAgICAgICAgICAgICAgICAgaXNGaXJzdFRyeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IHRoaXMuZXJyb3JUZXh0LnJlcGxhY2UoJyVAJywgdGhpcy5zcmMgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1nRWwub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgZmFicmljSW1nID0gbmV3IGZhYnJpYy5JbWFnZShpbWdFbCk7XG4gICAgICAgICAgICAgICAgY2FudmFzLnNldEJhY2tncm91bmRJbWFnZShmYWJyaWNJbWcsICgoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhcy5zZXRXaWR0aChpbWcud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzLnNldEhlaWdodChpbWcuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9zc09yaWdpbjogJ2Fub255bW91cycsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5YOiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5ZOiAndG9wJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMub24oJ3BhdGg6Y3JlYXRlZCcsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgICAgICAgICB0aGlzLnNldFVuZG9SZWRvKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLnNlbGVjdFRvb2wodGhpcy5jdXJyZW50VG9vbCk7XG4gICAgICAgIHRoaXMuc2VsZWN0Q29sb3IodGhpcy5jdXJyZW50Q29sb3IpO1xuICAgICAgICB0aGlzLnNlbGVjdERyYXdpbmdTaXplKHRoaXMuY3VycmVudFNpemUpO1xuICAgIH1cblxuICAgIC8vIFRvb2xzXG5cbiAgICBwdWJsaWMgc2VsZWN0VG9vbCh0b29sOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VG9vbCA9IHRvb2w7XG4gICAgfVxuXG4gICAgcHVibGljIHNlbGVjdERyYXdpbmdTaXplKHNpemU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmN1cnJlbnRTaXplID0gc2l6ZTtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzICE9PSBudWxsICYmIHRoaXMuY2FudmFzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChzaXplID09PSAnc21hbGwnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC53aWR0aCA9IDU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC53aWR0aCA9IDEwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaXplID09PSAnbGFyZ2UnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC53aWR0aCA9IDIwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNlbGVjdENvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSBjb2xvcjtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzICE9PSBudWxsICYmIHRoaXMuY2FudmFzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ2JsYWNrJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2guY29sb3IgPSAnIzAwMCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yID09PSAnd2hpdGUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjZmZmJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgPT09ICd5ZWxsb3cnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjZmZlYjNiJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgPT09ICdyZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjZjQ0MzM2JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgPT09ICdibHVlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2guY29sb3IgPSAnIzIxOTZmMyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yID09PSAnZ3JlZW4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjNGNhZjUwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFjdGlvbnNcblxuICAgIHB1YmxpYyB1bmRvKCkge1xuICAgICAgICBpZiAodGhpcy5jYW5VbmRvKSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0SWQgPSB0aGlzLmNhbnZhcy5nZXRPYmplY3RzKCkubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RPYmogPSB0aGlzLmNhbnZhcy5nZXRPYmplY3RzKClbbGFzdElkXTtcbiAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaChsYXN0T2JqKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZShsYXN0T2JqKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VW5kb1JlZG8oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZWRvKCkge1xuICAgICAgICBpZiAodGhpcy5jYW5SZWRvKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdEluU3RhY2sgPSB0aGlzLnN0YWNrLnNwbGljZSgtMSwgMSlbMF07XG4gICAgICAgICAgICBpZiAoZmlyc3RJblN0YWNrICE9PSBudWxsICYmIGZpcnN0SW5TdGFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuaW5zZXJ0QXQoZmlyc3RJblN0YWNrLCB0aGlzLmNhbnZhcy5nZXRPYmplY3RzKCkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldFVuZG9SZWRvKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJDYW52YXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmNhbnZhcyAhPT0gbnVsbCAmJiB0aGlzLmNhbnZhcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmUoLi4udGhpcy5jYW52YXMuZ2V0T2JqZWN0cygpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VW5kb1JlZG8oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlSW1hZ2UoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzLmdldEVsZW1lbnQoKS50b0Jsb2IoXG4gICAgICAgICAgICAoZGF0YTogQmxvYikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25TYXZlLmVtaXQoZGF0YSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpcy5vdXRwdXRNaW1lVHlwZSxcbiAgICAgICAgICAgIHRoaXMub3V0cHV0UXVhbGl0eVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMub25DYW5jZWwuZW1pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0VW5kb1JlZG8oKSB7XG4gICAgICAgIHRoaXMuY2FuVW5kbyA9IHRoaXMuY2FudmFzLmdldE9iamVjdHMoKS5sZW5ndGggPiAwO1xuICAgICAgICB0aGlzLmNhblJlZG8gPSB0aGlzLnN0YWNrLmxlbmd0aCA+IDA7XG4gICAgfVxufVxuIl19