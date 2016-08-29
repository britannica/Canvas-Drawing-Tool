const {fabric} = require('fabric');
const MaskedBrushRenderer = require('./masked-brush-renderer');
const MaskedPath = require('./masked-path');

/**
 * A pencil brush that erases from the canvas
 */
const PencilEraserBrush = fabric.util.createClass(fabric.PencilBrush, MaskedBrushRenderer, {
  /**
   * An override of the pencil brush's `createPath` method, to that it uses our
   * custom `MaskedPath`, rather than the default `fabric.Path`. This allows us
   * to customize the behavior of the final rendered path that was drawn. In this
   * case, we'll use compositing to make the path erase, rather than add to the
   * canvas.
   *
   * @param {String} pathData The path data to be rendered
   * @return {MaskedPath} The path that will be rendered
   */
  createPath: function (pathData) {
    return new MaskedPath(pathData, {
      fill: null,
      originX: 'center',
      originY: 'center',
      selectable: false,
      stroke: this.color,
      strokeDashArray: this.strokeDashArray,
      strokeLineCap: this.strokeLineCap,
      strokeLineJoin: this.strokeLineJoin,
      strokeWidth: this.width
    });
  }
});

module.exports = PencilEraserBrush;
