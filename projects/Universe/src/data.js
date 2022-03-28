/** @author: Davide Risaliti davdag24@gmail.com */

export class DataHandler {

  constructor() {
    this.debugView = document.getElementById("debugView");
    this.debugView.setAttribute("hidden", true);

    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));

    ["exposure", "bloomForce"]
      .forEach((name) => {
        // Find <label> and <input>
        const labelRef = document.getElementById(name + "Label");
        const valueRef = document.getElementById(name + "Value");
        // Check for errors
        if (labelRef == null || valueRef == null) {
          console.error("Unable to find attribute (lbl + input) for: " + name);
        } else {
          // Take starting value
          this[name] = valueRef.value;
          // Update label
          labelRef.innerText = name + ": " + valueRef.value;
          // Register event listener
          valueRef.addEventListener("input", (event) => {
            // Value changes
            const value = event.target.value;
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
