/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fabric } from 'fabric';
var ImageDrawingComponent = /** @class */ (function () {
    function ImageDrawingComponent() {
        this.onSave = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.currentTool = 'brush';
        this.currentSize = 'medium';
        this.currentColor = 'black';
        this.canUndo = false;
        this.canRedo = false;
        this.stack = [];
    }
    /**
     * @return {?}
     */
    ImageDrawingComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var canvas = new fabric.Canvas('canvas', {
            hoverCursor: 'pointer',
            isDrawingMode: true,
        });
        if (this.src) {
            canvas.setBackgroundImage(this.src, (function (img) {
                canvas.setWidth(img.width);
                canvas.setHeight(img.height);
            }), {
                crossOrigin: 'anonymous',
                originX: 'left',
                originY: 'top'
            });
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
    // Tools
    /**
     * @param {?} tool
     * @return {?}
     */
    ImageDrawingComponent.prototype.selectTool = 
    // Tools
    /**
     * @param {?} tool
     * @return {?}
     */
    function (tool) {
        this.currentTool = tool;
    };
    /**
     * @param {?} size
     * @return {?}
     */
    ImageDrawingComponent.prototype.selectDrawingSize = /**
     * @param {?} size
     * @return {?}
     */
    function (size) {
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
    /**
     * @param {?} color
     * @return {?}
     */
    ImageDrawingComponent.prototype.selectColor = /**
     * @param {?} color
     * @return {?}
     */
    function (color) {
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
    // Actions
    /**
     * @return {?}
     */
    ImageDrawingComponent.prototype.undo = 
    // Actions
    /**
     * @return {?}
     */
    function () {
        if (this.canUndo) {
            /** @type {?} */
            var lastId = this.canvas.getObjects().length - 1;
            /** @type {?} */
            var lastObj = this.canvas.getObjects()[lastId];
            this.stack.push(lastObj);
            this.canvas.remove(lastObj);
            this.setUndoRedo();
        }
    };
    /**
     * @return {?}
     */
    ImageDrawingComponent.prototype.redo = /**
     * @return {?}
     */
    function () {
        if (this.canRedo) {
            /** @type {?} */
            var firstInStack = this.stack.splice(-1, 1)[0];
            if (firstInStack !== null && firstInStack !== undefined) {
                this.canvas.insertAt(firstInStack, this.canvas.getObjects().length - 1);
            }
            this.setUndoRedo();
        }
    };
    /**
     * @return {?}
     */
    ImageDrawingComponent.prototype.clearCanvas = /**
     * @return {?}
     */
    function () {
        var _a;
        if (this.canvas !== null && this.canvas !== undefined) {
            (_a = this.canvas).remove.apply(_a, tslib_1.__spread(this.canvas.getObjects()));
            this.setUndoRedo();
        }
    };
    /**
     * @return {?}
     */
    ImageDrawingComponent.prototype.saveImage = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.canvas.getElement().toBlob(function (data) {
            _this.onSave.emit(data);
        });
    };
    /**
     * @return {?}
     */
    ImageDrawingComponent.prototype.cancel = /**
     * @return {?}
     */
    function () {
        this.onCancel.emit();
    };
    /**
     * @private
     * @return {?}
     */
    ImageDrawingComponent.prototype.setUndoRedo = /**
     * @private
     * @return {?}
     */
    function () {
        this.canUndo = this.canvas.getObjects().length > 0;
        this.canRedo = this.stack.length > 0;
    };
    ImageDrawingComponent.decorators = [
        { type: Component, args: [{
                    selector: 'image-drawing',
                    template: "<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n<canvas id=\"canvas\"></canvas>\n<div class=\"toolbar\">\n    <div class=\"tools\">\n        <div class=\"row\">\n            <i class=\"material-icons btn\" [class.selected]=\"currentTool == 'brush'\" (click)=\"selectTool('brush')\" title=\"Pinceau\">brush</i>\n            <span class=\"size small btn\" [class.selected]=\"currentSize == 'small'\" (click)=\"selectDrawingSize('small')\"\n                title=\"Taille: petit\"></span>\n            <span class=\"size medium btn\" [class.selected]=\"currentSize == 'medium'\" (click)=\"selectDrawingSize('medium')\"\n                title=\"Taille: moyen\"></span>\n            <span class=\"size large btn\" [class.selected]=\"currentSize == 'large'\" (click)=\"selectDrawingSize('large')\"\n                title=\"Taille: grand\"></span>\n            <i class=\"material-icons btn\" [class.disabled]=\"!canUndo\" (click)=\"undo()\" title=\"Annuler\">undo</i>\n            <i class=\"material-icons btn\" [class.disabled]=\"!canRedo\" (click)=\"redo()\" title=\"Refaire\">redo</i>\n            <i class=\"material-icons btn\" (click)=\"clearCanvas()\" title=\"Effacer tout\">delete</i>\n        </div>\n        <div class=\"row\">\n            <div class=\"color black\" [class.selected]=\"currentColor == 'black'\" (click)=\"selectColor('black')\" title=\"Noir\"></div>\n            <div class=\"color white\" [class.selected]=\"currentColor == 'white'\" (click)=\"selectColor('white')\" title=\"Blanc\"></div>\n            <div class=\"color yellow\" [class.selected]=\"currentColor == 'yellow'\" (click)=\"selectColor('yellow')\" title=\"Jaune\"></div>\n            <div class=\"color red\" [class.selected]=\"currentColor == 'red'\" (click)=\"selectColor('red')\" title=\"Rouge\"></div>\n            <div class=\"color green\" [class.selected]=\"currentColor == 'green'\" (click)=\"selectColor('green')\" title=\"Vert\"></div>\n            <div class=\"color blue\" [class.selected]=\"currentColor == 'blue'\" (click)=\"selectColor('blue')\" title=\"Bleu\"></div>\n        </div>\n    </div>\n    <div class=\"buttons\">\n        <a href=\"#\" class=\"button btn-primary\" (click)=\"saveImage(); $event.preventDefault();\">Enregistrer</a>\n        <a href=\"#\" class=\"button btn-light\" (click)=\"cancel(); $event.preventDefault();\">Annuler</a>\n    </div>\n</div>\n",
                    styles: [":host{display:flex;flex-direction:column;align-items:center}:host .toolbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}:host .tools{display:inline-flex;flex-direction:column;padding:20px;margin:10px;background:#fff;border-radius:6px;box-shadow:0 3px 10px rgba(0,0,0,.4)}:host .row{display:flex;width:300px;justify-content:space-around;align-items:center}:host .row:first-child{margin-bottom:10px}:host .btn{cursor:pointer}:host .btn.selected{color:#bdbdbd}:host .btn.disabled{cursor:initial;color:#bdbdbd}:host .size{background-color:#000}:host .size.selected{background-color:#bdbdbd}:host .size.small{height:12px;width:12px;border-radius:6px}:host .size.medium{height:16px;width:16px;border-radius:8px}:host .size.large{height:20px;width:20px;border-radius:10px}:host .color{width:28px;height:28px;border-radius:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}:host .color.selected::after{content:\"\";width:10px;height:10px;background:#000;display:flex;border-radius:5px}:host .color.black{background-color:#000}:host .color.black.selected::after{background:#fff}:host .color.white{border:1px solid #a7a7a7}:host .color.yellow{background-color:#ffeb3b}:host .color.red{background-color:#f44336}:host .color.blue{background-color:#2196f3}:host .color.green{background-color:#4caf50}:host .buttons{margin:10px;display:flex;flex-direction:column}:host .button{cursor:pointer;outline:0;border:none;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;min-width:64px;line-height:36px;padding:3px 16px;border-radius:4px;overflow:visible;transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1);margin:10px}:host .button.btn-primary{background-color:#ef5f27;color:#fff}:host .button.btn-primary:hover{background-color:rgba(239,95,39,.8)}:host .button.btn-light{color:#ef5f27}:host .button.btn-light:hover{background-color:rgba(239,95,39,.1)}"]
                }] }
    ];
    /** @nocollapse */
    ImageDrawingComponent.ctorParameters = function () { return []; };
    ImageDrawingComponent.propDecorators = {
        src: [{ type: Input }],
        onSave: [{ type: Output }],
        onCancel: [{ type: Output }]
    };
    return ImageDrawingComponent;
}());
export { ImageDrawingComponent };
if (false) {
    /** @type {?} */
    ImageDrawingComponent.prototype.src;
    /** @type {?} */
    ImageDrawingComponent.prototype.onSave;
    /** @type {?} */
    ImageDrawingComponent.prototype.onCancel;
    /** @type {?} */
    ImageDrawingComponent.prototype.currentTool;
    /** @type {?} */
    ImageDrawingComponent.prototype.currentSize;
    /** @type {?} */
    ImageDrawingComponent.prototype.currentColor;
    /** @type {?} */
    ImageDrawingComponent.prototype.canUndo;
    /** @type {?} */
    ImageDrawingComponent.prototype.canRedo;
    /**
     * @type {?}
     * @private
     */
    ImageDrawingComponent.prototype.canvas;
    /**
     * @type {?}
     * @private
     */
    ImageDrawingComponent.prototype.stack;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtZHJhd2luZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtZHJhd2luZy8iLCJzb3VyY2VzIjpbInNyYy9pbWFnZS1kcmF3aW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVoQztJQXFCSTtRQWJpQixXQUFNLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFDdEQsYUFBUSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBRWxFLGdCQUFXLEdBQVcsT0FBTyxDQUFDO1FBQzlCLGdCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLGlCQUFZLEdBQVcsT0FBTyxDQUFDO1FBRS9CLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUd4QixVQUFLLEdBQVUsRUFBRSxDQUFDO0lBRzFCLENBQUM7Ozs7SUFFTSx3Q0FBUTs7O0lBQWY7UUFBQSxpQkF5QkM7O1lBeEJTLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLGFBQWEsRUFBRSxJQUFJO1NBQ3RCLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVixNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQUMsR0FBRztnQkFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxFQUFFO2dCQUNBLFdBQVcsRUFBRSxX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QUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Ozs7SUFFTSxzQ0FBTTs7O0lBQWI7UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7Ozs7O0lBRU8sMkNBQVc7Ozs7SUFBbkI7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDOztnQkFuSUosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxlQUFlO29CQUV6QiwrM0VBQTZDOztpQkFDaEQ7Ozs7O3NCQUdJLEtBQUs7eUJBQ0wsTUFBTTsyQkFDTixNQUFNOztJQTJIWCw0QkFBQztDQUFBLEFBcElELElBb0lDO1NBL0hZLHFCQUFxQjs7O0lBRTlCLG9DQUE2Qjs7SUFDN0IsdUNBQXVFOztJQUN2RSx5Q0FBeUU7O0lBRXpFLDRDQUFxQzs7SUFDckMsNENBQXNDOztJQUN0Qyw2Q0FBc0M7O0lBRXRDLHdDQUFnQzs7SUFDaEMsd0NBQWdDOzs7OztJQUVoQyx1Q0FBcUI7Ozs7O0lBQ3JCLHNDQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZhYnJpYyB9IGZyb20gJ2ZhYnJpYyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaW1hZ2UtZHJhd2luZycsXG4gICAgc3R5bGVVcmxzOiBbJy4vaW1hZ2UtZHJhd2luZy5jb21wb25lbnQuc2NzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9pbWFnZS1kcmF3aW5nLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJbWFnZURyYXdpbmdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgcHVibGljIHNyYz86IHN0cmluZztcbiAgICBAT3V0cHV0KCkgcHVibGljIG9uU2F2ZTogRXZlbnRFbWl0dGVyPEJsb2I+ID0gbmV3IEV2ZW50RW1pdHRlcjxCbG9iPigpO1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25DYW5jZWw6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAgIHB1YmxpYyBjdXJyZW50VG9vbDogc3RyaW5nID0gJ2JydXNoJztcbiAgICBwdWJsaWMgY3VycmVudFNpemU6IHN0cmluZyA9ICdtZWRpdW0nO1xuICAgIHB1YmxpYyBjdXJyZW50Q29sb3I6IHN0cmluZyA9ICdibGFjayc7XG5cbiAgICBwdWJsaWMgY2FuVW5kbzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBjYW5SZWRvOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGNhbnZhcz86IGFueTtcbiAgICBwcml2YXRlIHN0YWNrOiBhbnlbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBuZXcgZmFicmljLkNhbnZhcygnY2FudmFzJywge1xuICAgICAgICAgICAgaG92ZXJDdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIGlzRHJhd2luZ01vZGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5zcmMpIHtcbiAgICAgICAgICAgIGNhbnZhcy5zZXRCYWNrZ3JvdW5kSW1hZ2UodGhpcy5zcmMsICgoaW1nKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FudmFzLnNldFdpZHRoKGltZy53aWR0aCk7XG4gICAgICAgICAgICAgICAgY2FudmFzLnNldEhlaWdodChpbWcuaGVpZ2h0KTtcbiAgICAgICAgICAgIH0pLCB7XG4gICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46ICdhbm9ueW1vdXMnLFxuICAgICAgICAgICAgICAgIG9yaWdpblg6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICBvcmlnaW5ZOiAndG9wJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMub24oJ3BhdGg6Y3JlYXRlZCcsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgICAgICAgICB0aGlzLnNldFVuZG9SZWRvKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLnNlbGVjdFRvb2wodGhpcy5jdXJyZW50VG9vbCk7XG4gICAgICAgIHRoaXMuc2VsZWN0Q29sb3IodGhpcy5jdXJyZW50Q29sb3IpO1xuICAgICAgICB0aGlzLnNlbGVjdERyYXdpbmdTaXplKHRoaXMuY3VycmVudFNpemUpO1xuICAgIH1cblxuICAgIC8vIFRvb2xzXG5cbiAgICBwdWJsaWMgc2VsZWN0VG9vbCh0b29sOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VG9vbCA9IHRvb2w7XG4gICAgfVxuXG4gICAgcHVibGljIHNlbGVjdERyYXdpbmdTaXplKHNpemU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmN1cnJlbnRTaXplID0gc2l6ZTtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzICE9PSBudWxsICYmIHRoaXMuY2FudmFzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChzaXplID09PSAnc21hbGwnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC53aWR0aCA9IDU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNpemUgPT09ICdtZWRpdW0nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC53aWR0aCA9IDEwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaXplID09PSAnbGFyZ2UnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC53aWR0aCA9IDIwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNlbGVjdENvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSBjb2xvcjtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzICE9PSBudWxsICYmIHRoaXMuY2FudmFzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ2JsYWNrJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2guY29sb3IgPSAnIzAwMCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yID09PSAnd2hpdGUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjZmZmJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgPT09ICd5ZWxsb3cnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjZmZlYjNiJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgPT09ICdyZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjZjQ0MzM2JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sb3IgPT09ICdibHVlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmZyZWVEcmF3aW5nQnJ1c2guY29sb3IgPSAnIzIxOTZmMyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yID09PSAnZ3JlZW4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZnJlZURyYXdpbmdCcnVzaC5jb2xvciA9ICcjNGNhZjUwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFjdGlvbnNcblxuICAgIHB1YmxpYyB1bmRvKCkge1xuICAgICAgICBpZiAodGhpcy5jYW5VbmRvKSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0SWQgPSB0aGlzLmNhbnZhcy5nZXRPYmplY3RzKCkubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RPYmogPSB0aGlzLmNhbnZhcy5nZXRPYmplY3RzKClbbGFzdElkXTtcbiAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaChsYXN0T2JqKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZShsYXN0T2JqKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VW5kb1JlZG8oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZWRvKCkge1xuICAgICAgICBpZiAodGhpcy5jYW5SZWRvKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdEluU3RhY2sgPSB0aGlzLnN0YWNrLnNwbGljZSgtMSwgMSlbMF07XG4gICAgICAgICAgICBpZiAoZmlyc3RJblN0YWNrICE9PSBudWxsICYmIGZpcnN0SW5TdGFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuaW5zZXJ0QXQoZmlyc3RJblN0YWNrLCB0aGlzLmNhbnZhcy5nZXRPYmplY3RzKCkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldFVuZG9SZWRvKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJDYW52YXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmNhbnZhcyAhPT0gbnVsbCAmJiB0aGlzLmNhbnZhcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmUoLi4udGhpcy5jYW52YXMuZ2V0T2JqZWN0cygpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VW5kb1JlZG8oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlSW1hZ2UoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzLmdldEVsZW1lbnQoKS50b0Jsb2IoKGRhdGE6IEJsb2IpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25TYXZlLmVtaXQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMub25DYW5jZWwuZW1pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0VW5kb1JlZG8oKSB7XG4gICAgICAgIHRoaXMuY2FuVW5kbyA9IHRoaXMuY2FudmFzLmdldE9iamVjdHMoKS5sZW5ndGggPiAwO1xuICAgICAgICB0aGlzLmNhblJlZG8gPSB0aGlzLnN0YWNrLmxlbmd0aCA+IDA7XG4gICAgfVxufVxuIl19