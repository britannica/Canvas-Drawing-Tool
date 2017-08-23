const BitmapBrush = fabric.util.createClass(fabric.BaseBrush, {
  initialize: function (canvas, imageUrl) {
    this.canvas = canvas;
    this.imageUrl = imageUrl;

    this.loadImage();
  },

  loadImage: function () {
    var image = new Image();
    image.onload = this.createBitmap.bind(this, image);
    image.src = this.imageUrl;
  },

  createBitmap: function (image) {
    // draw the image to a canvas
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    var context = tempCanvas.getContext('2d');
    context.drawImage(image, 0, 0);

    var currentRgbaColor = this.getRgbColor(this.color);

    // Now, update the raw image data to be the current color
    var rawImageData = context.getImageData(0, 0, image.width, image.height);
    for(var i = 0; i < image.width; i++) {
      for(var j = 0; j < image.height; j++) {
        var pixel = 4 * (image.height * i + j);

        rawImageData.data[pixel][0] = currentRgbaColor[0];
        rawImageData.data[pixel + 1] = currentRgbaColor[1];
        rawImageData.data[pixel + 2] = currentRgbaColor[2];
      }
    }
    context.clearRect(0, 0, image.width, image.height);
    context.putImageData(rawImageData, 0, 0);

    this.bitmap = tempCanvas;
  },

  getRgbColor: function (color) {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    var context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1).data;
  },

  stampImage: function (pointer) {
    if(!this.bitmap) {
      return;
    }

    var drawSize = this.width * 2;
    var x = pointer.x - drawSize / 2;
    var y = pointer.y - drawSize / 2;

    this.canvas.contextTop.drawImage(this.bitmap, x, y, drawSize, drawSize);
  },

  onMouseDown: function (pointer) {
    this.canvas.contextTop.fillStyle = this.color;
    this.stampImage(pointer);
  },

  onMouseMove: function (pointer) {
    this.stampImage(pointer);
  },

  onMouseUp: function () {
    var dataUrl = this.canvas.contextTop.canvas.toDataURL();
    fabric.Image.fromURL(dataUrl, function (image) {
      image.set({ selectable: false });
      this.canvas.add(image);
      this.canvas.clearContext(this.canvas.contextTop);
      this.canvas.renderAll();
    }.bind(this));
  }
});

module.exports = BitmapBrush;
