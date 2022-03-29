/** @author: Davide Risaliti davdag24@gmail.com */

export class DataHandler {

  constructor() {
    this.debugView = document.getElementById("debugView");
    this.debugView.setAttribute("hidden", true);

    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));

    const values = [
      // LIGHT
      "lightColor",
      "useBlinn",
      "lightForce",
      "ambientFactor",
      "diffuseFactor",
      "specularFactor",
      // MATERIAL
      "shininess",
      // EFFECTS
      "exposure",
      "bloomForce",
      "framebufferOutput",
    ];

    values.forEach((name) => {
      // Find <label> and <input>
      const labelRef = document.getElementById(name + "Label");
      const valueRef = document.getElementById(name + "Value");
      // Check for errors
      if (labelRef == null || valueRef == null) {
        console.error("Unable to find attribute (lbl + input) for: " + name);
      } else {
        // Take starting value
        let value = valueRef.value;
        if (value === 'checked') value = valueRef.checked;
        this[name] = value;
        labelRef.innerText = name + ": " + value;
        // Register event listener
        valueRef.addEventListener("input", (event) => {
          // Value changes
          let value = event.target.value;
          if (value === 'checked') value = event.target.checked;
          this[name] = value;
          labelRef.innerText = name + ": " + value;
        });
      }
    });
  }

  onKeyDown(event) {
  }

  onKeyUp(event) {
    if (event.code === 'KeyD') {
      this.debugView.toggleAttribute("hidden");
    }
  }
}
