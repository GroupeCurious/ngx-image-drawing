import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { fabric } from 'fabric';
var ImageDrawingComponent = /** @class */ (function () {
    function ImageDrawingComponent() {
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
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtZHJhd2luZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtZHJhd2luZy8iLCJzb3VyY2VzIjpbInNyYy9pbWFnZS1kcmF3aW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQU9oQztJQTJCSTtRQXhCZ0IsZ0JBQVcsR0FBRyxNQUFNLENBQUM7UUFDckIsa0JBQWEsR0FBRyxRQUFRLENBQUM7UUFDekIsZ0JBQVcsR0FBRyxVQUFVLENBQUM7UUFDekIsY0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBSTlCLFdBQU0sR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUN0RCxhQUFRLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFFbEUsZ0JBQVcsR0FBVyxPQUFPLENBQUM7UUFDOUIsZ0JBQVcsR0FBVyxRQUFRLENBQUM7UUFDL0IsaUJBQVksR0FBVyxPQUFPLENBQUM7UUFFL0IsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQUdqQixVQUFLLEdBQVUsRUFBRSxDQUFDO0lBRzFCLENBQUM7SUFFTSx3Q0FBUSxHQUFmO1FBQUEsaUJBOENDO1FBN0NHLElBQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDdkMsV0FBVyxFQUFFLFNBQVM7WUFDdEIsYUFBYSxFQUFFLElBQUk7U0FDdEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLFNBQVMs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QUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sc0NBQU0sR0FBYjtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVPLDJDQUFXLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQTVKUTtRQUFSLEtBQUssRUFBRTs7c0RBQXFCO0lBQ3BCO1FBQVIsS0FBSyxFQUFFOzs4REFBNkI7SUFDNUI7UUFBUixLQUFLLEVBQUU7O2dFQUFpQztJQUNoQztRQUFSLEtBQUssRUFBRTs7OERBQWlDO0lBQ2hDO1FBQVIsS0FBSyxFQUFFOzs0REFBdUM7SUFDdEM7UUFBUixLQUFLLEVBQUU7MENBQTBCLFdBQVc7a0VBQU07SUFDMUM7UUFBUixLQUFLLEVBQUU7MENBQXdCLFdBQVc7Z0VBQU07SUFFdkM7UUFBVCxNQUFNLEVBQUU7MENBQWdCLFlBQVk7eURBQWtDO0lBQzdEO1FBQVQsTUFBTSxFQUFFOzBDQUFrQixZQUFZOzJEQUFrQztJQVhoRSxxQkFBcUI7UUFMakMsU0FBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLGVBQWU7WUFFekIsODJGQUE2Qzs7U0FDaEQsQ0FBQzs7T0FDVyxxQkFBcUIsQ0ErSmpDO0lBQUQsNEJBQUM7Q0FBQSxBQS9KRCxJQStKQztTQS9KWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZmFicmljIH0gZnJvbSAnZmFicmljJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpbWFnZS1kcmF3aW5nJyxcbiAgICBzdHlsZVVybHM6IFsnLi9pbWFnZS1kcmF3aW5nLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgdGVtcGxhdGVVcmw6ICcuL2ltYWdlLWRyYXdpbmcuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIEltYWdlRHJhd2luZ0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSBwdWJsaWMgc3JjPzogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBzYXZlQnRuVGV4dCA9ICdTYXZlJztcbiAgICBASW5wdXQoKSBwdWJsaWMgY2FuY2VsQnRuVGV4dCA9ICdDYW5jZWwnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBsb2FkaW5nVGV4dCA9ICdMb2FkaW5n4oCmJztcbiAgICBASW5wdXQoKSBwdWJsaWMgZXJyb3JUZXh0ID0gJ0Vycm9yIGxvYWRpbmcgJUAnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBsb2FkaW5nVGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIEBJbnB1dCgpIHB1YmxpYyBlcnJvclRlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25TYXZlOiBFdmVudEVtaXR0ZXI8QmxvYj4gPSBuZXcgRXZlbnRFbWl0dGVyPEJsb2I+KCk7XG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbkNhbmNlbDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gICAgcHVibGljIGN1cnJlbnRUb29sOiBzdHJpbmcgPSAnYnJ1c2gnO1xuICAgIHB1YmxpYyBjdXJyZW50U2l6ZTogc3RyaW5nID0gJ21lZGl1bSc7XG4gICAgcHVibGljIGN1cnJlbnRDb2xvcjogc3RyaW5nID0gJ2JsYWNrJztcblxuICAgIHB1YmxpYyBjYW5VbmRvOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGNhblJlZG86IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBpc0xvYWRpbmcgPSB0cnVlO1xuICAgIHB1YmxpYyBoYXNFcnJvciA9IGZhbHNlO1xuICAgIHB1YmxpYyBlcnJvck1lc3NhZ2UgPSAnJztcblxuICAgIHByaXZhdGUgY2FudmFzPzogYW55O1xuICAgIHByaXZhdGUgc3RhY2s6IGFueVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IG5ldyBmYWJyaWMuQ2FudmFzKCdjYW52YXMnLCB7XG4gICAgICAgICAgICBob3ZlckN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgaXNEcmF3aW5nTW9kZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLnNyYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsZXQgaXNGaXJzdFRyeSA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBpbWdFbCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1nRWwuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKTtcbiAgICAgICAgICAgIGltZ0VsLnNyYyA9IHRoaXMuc3JjO1xuICAgICAgICAgICAgaW1nRWwub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBSZXRyeSB3aXRoIGNvcnMgcHJveHlcbiAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdFRyeSkge1xuICAgICAgICAgICAgICAgICAgICBpbWdFbC5zcmMgPSAnaHR0cDovL2NvcnMtYW55d2hlcmUuaGVyb2t1YXBwLmNvbS8nICsgdGhpcy5zcmM7XG4gICAgICAgICAgICAgICAgICAgIGlzRmlyc3RUcnkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSB0aGlzLmVycm9yVGV4dC5yZXBsYWNlKCclQCcsIHRoaXMuc3JjIGFzIHN0cmluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltZ0VsLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZhYnJpY0ltZyA9IG5ldyBmYWJyaWMuSW1hZ2UoaW1nRWwpO1xuICAgICAgICAgICAgICAgIGNhbnZhcy5zZXRCYWNrZ3JvdW5kSW1hZ2UoZmFicmljSW1nLCAoKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW1nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMuc2V0V2lkdGgoaW1nLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhcy5zZXRIZWlnaHQoaW1nLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46ICdhbm9ueW1vdXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luWDogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luWTogJ3RvcCdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FudmFzLm9uKCdwYXRoOmNyZWF0ZWQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGFjayA9IFtdO1xuICAgICAgICAgICAgdGhpcy5zZXRVbmRvUmVkbygpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5zZWxlY3RUb29sKHRoaXMuY3VycmVudFRvb2wpO1xuICAgICAgICB0aGlzLnNlbGVjdENvbG9yKHRoaXMuY3VycmVudENvbG9yKTtcbiAgICAgICAgdGhpcy5zZWxlY3REcmF3aW5nU2l6ZSh0aGlzLmN1cnJlbnRTaXplKTtcbiAgICB9XG5cbiAgICAvLyBUb29sc1xuXG4gICAgcHVibGljIHNlbGVjdFRvb2wodG9vbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRvb2wgPSB0b29sO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWxlY3REcmF3aW5nU2l6ZShzaXplOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U2l6ZSA9IHNpemU7XG4gICAgICAgIGlmICh0aGlzLmNhbnZhcyAhPT0gbnVsbCAmJiB0aGlzLmNhbnZhcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoc2l6ZSA9PT0gJ3NtYWxsJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2gud2lkdGggPSA1O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaXplID09PSAnbWVkaXVtJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2gud2lkdGggPSAxMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2l6ZSA9PT0gJ2xhcmdlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2gud2lkdGggPSAyMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZWxlY3RDb2xvcihjb2xvcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY3VycmVudENvbG9yID0gY29sb3I7XG4gICAgICAgIGlmICh0aGlzLmNhbnZhcyAhPT0gbnVsbCAmJiB0aGlzLmNhbnZhcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoY29sb3IgPT09ICdibGFjaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLmNvbG9yID0gJyMwMDAnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2xvciA9PT0gJ3doaXRlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2guY29sb3IgPSAnI2ZmZic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yID09PSAneWVsbG93Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2guY29sb3IgPSAnI2ZmZWIzYic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yID09PSAncmVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2guY29sb3IgPSAnI2Y0NDMzNic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yID09PSAnYmx1ZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5mcmVlRHJhd2luZ0JydXNoLmNvbG9yID0gJyMyMTk2ZjMnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2xvciA9PT0gJ2dyZWVuJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2guY29sb3IgPSAnIzRjYWY1MCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBY3Rpb25zXG5cbiAgICBwdWJsaWMgdW5kbygpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuVW5kbykge1xuICAgICAgICAgICAgY29uc3QgbGFzdElkID0gdGhpcy5jYW52YXMuZ2V0T2JqZWN0cygpLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBjb25zdCBsYXN0T2JqID0gdGhpcy5jYW52YXMuZ2V0T2JqZWN0cygpW2xhc3RJZF07XG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2gobGFzdE9iaik7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmUobGFzdE9iaik7XG4gICAgICAgICAgICB0aGlzLnNldFVuZG9SZWRvKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVkbygpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuUmVkbykge1xuICAgICAgICAgICAgY29uc3QgZmlyc3RJblN0YWNrID0gdGhpcy5zdGFjay5zcGxpY2UoLTEsIDEpWzBdO1xuICAgICAgICAgICAgaWYgKGZpcnN0SW5TdGFjayAhPT0gbnVsbCAmJiBmaXJzdEluU3RhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmluc2VydEF0KGZpcnN0SW5TdGFjaywgdGhpcy5jYW52YXMuZ2V0T2JqZWN0cygpLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRVbmRvUmVkbygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyQ2FudmFzKCkge1xuICAgICAgICBpZiAodGhpcy5jYW52YXMgIT09IG51bGwgJiYgdGhpcy5jYW52YXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlKC4uLnRoaXMuY2FudmFzLmdldE9iamVjdHMoKSk7XG4gICAgICAgICAgICB0aGlzLnNldFVuZG9SZWRvKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2F2ZUltYWdlKCkge1xuICAgICAgICB0aGlzLmNhbnZhcy5nZXRFbGVtZW50KCkudG9CbG9iKChkYXRhOiBCbG9iKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uU2F2ZS5lbWl0KGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2FuY2VsKCkge1xuICAgICAgICB0aGlzLm9uQ2FuY2VsLmVtaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFVuZG9SZWRvKCkge1xuICAgICAgICB0aGlzLmNhblVuZG8gPSB0aGlzLmNhbnZhcy5nZXRPYmplY3RzKCkubGVuZ3RoID4gMDtcbiAgICAgICAgdGhpcy5jYW5SZWRvID0gdGhpcy5zdGFjay5sZW5ndGggPiAwO1xuICAgIH1cbn1cbiJdfQ==