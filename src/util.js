/**
 * Utility function to determine if a 'touch:drag' event is the last in a series,
 * corresponding to 'mouse:up'.
 * @param {Object} evt - touch event from fabric.Canvas
 *
 * @returns {Boolean} true if it is the last in a series, false otherwise
 */
const isLastInDragSeries = (evt) => {
  // a bit hacky and ad-hoc, there may be a better way to do this.
  return evt.e.cancelable === undefined;
};


/**
 * Utility function to determine if a Fabric path:created event corresponds
 * to a path we already have recorded
 * @param {Object} evt - 'path:created' event from fabric.Canvas
 * @param {Object[]} canvasHistory - internal history array from Stickerbook
 *
 * @returns {Boolean} true if we have recorded this path, false otherwise
 */
const isAlreadyRecordedPath = (evt, canvasHistory) => {
  if (canvasHistory.length === 0) {
    return false;
  }
  const endOfHistory = JSON.parse(canvasHistory[(canvasHistory.length - 1)]);
  const serializedPaths = endOfHistory.objects.map((obj) => {
    return JSON.stringify(obj);
  });
  const serializedNewPath = JSON.stringify(evt);

  for(var i = 0; i < serializedPaths.length; i++) {
    if(serializedPaths[i] === serializedNewPath) {
      return true;
    }
  }

  return false;
};

/**
 * Calculates the width of an element, excluding margin, border, and padding
 *
 * @param {Node} element A node to calculate for
 * @returns {Object} and object with a width and height properties
 */
const calculateInnerDimensions = (element) => {
  // build an object with values for each padding value (trimming the 'px')
  var computedStyle = window.getComputedStyle(element, null);
  var padding = {};
  ['left', 'right', 'top', 'bottom'].forEach((direction) => {
    var rawValue = computedStyle.getPropertyValue(`padding-${direction}`);
    padding[direction] = Number(rawValue.replace('px', ''));
  });

  return {
    width: element.clientWidth - padding.left - padding.right,
    height: element.clientHeight - padding.top - padding.bottom
  };
};

module.exports = {
  isAlreadyRecordedPath: isAlreadyRecordedPath,
  isLastInDragSeries: isLastInDragSeries,
  calculateInnerDimensions: calculateInnerDimensions
};
