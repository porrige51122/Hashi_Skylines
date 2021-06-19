/**
 * Class full of repeated functions to reduce code length within the game
 * @type {module.Helpers}
 */
module.exports = class Helpers {
  /**
   * Initialises size variables to easily call back to them in the future.
   * @param gc
   */
  constructor(gc) {
    this.gc = gc;
    this.w = gc.width;
    this.h = gc.height;
  }

  /**
   * For the button which makes the background turn on and off on hover.
   * @return void
   */
  onHover() {
    this.children[0].visible = true;
  }

  /**
   * For the button which makes the background turn on and off on hover.
   * @return void
   */
  offHover() {
    this.children[0].visible = false;
  }

  /**
   * Adds a customisable button with interactive hover values
   * @param posX x position of the button
   * @param posY y position of the button
   * @param label what is displayed on the button
   * @param textSize the size of the text in the button
   * @param rectX the x width of the surrounding box
   * @param rectY the y depth of the surrounding box
   * @param edge True/false if you want the button's box all the way to the left edge
   * @return a A PIXI Container containing the button.
   */
  addButton(posX, posY, label, textSize, rectX, rectY, edge) {
    let a = new PIXI.Container();
    let rect = new PIXI.Graphics();
    rect.beginFill(0x555555);
    if (edge)
      rect.drawRect(0, posY, rectX, rectY);
    else
      rect.drawRect(posX - 3, posY, rectX, rectY);
    let text = new PIXI.Text(label);
    text.style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize: textSize,
      fill: 0xFFFFFF
    })
    text.position.set(posX,posY);
    rect.visible = false;
    a.addChild(rect, text);
    a.buttonMode = a.interactive = true;
    a.on('pointerover', this.onHover)
     .on('pointerout', this.offHover);
    return a;
  }

  /**
   * Creates an incrementer button with given parameters
   * @param font Size of the font for the main number
   * @param label What the words are above the button
   * @param start Starting value
   * @param min Minimum Value
   * @param max Maximum Value
   * @returns {PIXI.Container}
   */
  incrementer(font, label, start, min, max) {
    let a = new PIXI.Container();
    let val = new PIXI.Text(start);

    val.style = new PIXI.TextStyle({
     fontFamily: 'Chakra Petch',
     fontSize: font,
     fill: 0xFFFFFF
    })
    val.position.set(font,0);
    val.anchor.set(0.5,0);

    let sub = this.addButton(0         , 0, "-", font, font / 1.5, font, false),
        add = this.addButton(1.5 * font, 0, "+", font, font / 1.5, font, false);

    sub.on('pointertap', () => {
       if (val.text > min + 1) {
         val.text--;
         sub.children[1].style.fill = 0xFFFFFF;
         add.children[1].style.fill = 0xFFFFFF;
       } else if (parseInt(val.text) === min + 1) {
         val.text--;
         sub.children[1].style.fill = 0x660000;
       }
     })

    add.on('pointertap', () => {
      if (val.text < max - 1) {
        val.text++;
        sub.children[1].style.fill = 0xFFFFFF;
        add.children[1].style.fill = 0xFFFFFF;
      } else if (parseInt(val.text) === max - 1) {
        val.text++;
        add.children[1].style.fill = 0x660000;
      }
    })

    let title = new PIXI.Text(label);
    title.style = new PIXI.TextStyle({
    fontFamily: 'Chakra Petch',
    fontSize:  font/2,
    fill: 0xFFFFFF
    })
    title.position.set(font,-font/2);
    title.anchor.set(0.5,0);

    a.addChild(sub, add, val, title);
    return a
  }

  incrementer2(font, label, start, min, max) {
    let a = new PIXI.Container();
    let val = new PIXI.Text(start + "x" + start);

    val.style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize: font,
      fill: 0xFFFFFF
    })
    val.val = start;
    val.position.set(font,0);
    val.anchor.set(0.5,0);

    let sub = this.addButton(-1 * font, 0, "-", font, font / 1.5, font, false),
        add = this.addButton(2.5 * font , 0, "+", font, font / 1.5, font, false);

    sub.on('pointertap', () => {
      if (val.val > min + 1) {
        val.val--;
        val.text = val.val + "x" + val.val;
        sub.children[1].style.fill = 0xFFFFFF;
        add.children[1].style.fill = 0xFFFFFF;
      } else if (parseInt(val.text) === min + 1) {
        val.val--;
        val.text = val.val + "x" + val.val;
        sub.children[1].style.fill = 0x660000;
      }
    })

    add.on('pointertap', () => {
      if (val.val < max - 1) {
        val.val++;
        val.text = val.val + "x" + val.val;
        sub.children[1].style.fill = 0xFFFFFF;
        add.children[1].style.fill = 0xFFFFFF;
      } else if (parseInt(val.val) === max - 1) {
        val.val++;
        val.text = val.val + "x" + val.val;
        add.children[1].style.fill = 0x660000;
      }
    })

    let title = new PIXI.Text(label);
    title.style = new PIXI.TextStyle({
      fontFamily: 'Chakra Petch',
      fontSize:  font/2,
      fill: 0xFFFFFF
    })
    title.position.set(font,-font/2);
    title.anchor.set(0.5,0);

    a.addChild(sub, add, val, title);
    return a
  }
}
