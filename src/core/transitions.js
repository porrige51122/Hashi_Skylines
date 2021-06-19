module.exports = class Transitions {
  constructor(gc) {
    this.resize(gc);
    this.fadein = false;
    this.fadeout = false;
    function Loop(a) {
      a.fadeLoop();
      requestAnimationFrame(() => {
        Loop(a);
      })
    }

    Loop(this);
  }

  resize(gc) {
    this.width = gc.width;
    this.height = gc.height;
  }

  fadeLoop() {
    if (this.fadeout) {
      this.a.alpha -= 0.02;
      if (!this.fadein && this.a.alpha < 0.25) {
        this.fadein = true;
      }
      if (this.a.alpha < 0) {
        this.a.visible = false;
        this.a.alpha = 1;
        this.fadeout = false;
      }
    }
    if (this.fadein) {
      this.b.alpha += 0.02;
      if (this.b.alpha > 1) {
        this.finishFade();
      }
    }
  }

  finishFade() {
    if (this.a !== undefined) {
      this.a.visible = false;
      this.a.alpha = 1;
      this.fadeout = false;

      this.b.alpha = 1;
      this.fadein = false;
    }
  }

  transitionFade(a, b) {
    if (this.a !== undefined) {
      this.finishFade();
      this.a.visible = false;
      this.b.visible = false;
      a.visible = true;
    }

    a.vy = 0;
    a.y = 0;
    a.alpha = 1;
    b.vy = 0;
    b.y = 0
    b.alpha = 0;
    b.visible = true;
    this.a = a;
    this.b = b;
    this.fadeout = true;
  }
}
