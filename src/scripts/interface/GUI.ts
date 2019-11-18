import * as dat from "dat.gui";

// Utils
import * as PubSub from "../utils/pubSub";

const defaults = {
  showTargetVector: true,
  showNormalizedTargetVector: true,
  showAwarenessArea: true,
};

class GUI {
  public init() {
    this.setupGUI();
  }

  // TODO: Split these later into setup UI and controllers
  private setupGUI() {
    const gui = new dat.GUI();

    const targetVectorController = gui.add(defaults, "showTargetVector");
    const normalizedVectorController = gui.add(
      defaults,
      "showNormalizedTargetVector"
    );
    const awarenessAreaController = gui.add(defaults, "showAwarenessArea");

    targetVectorController.onChange((value: boolean) => {
      PubSub.publish("gui:showTargetVector", value);
    });

    normalizedVectorController.onChange((value: boolean) => {
      PubSub.publish("gui:showNormalizedTargetVector", value);
    });

    awarenessAreaController.onChange((value: boolean) => {
      PubSub.publish("gui:showAwarenessArea", value);
    });
  }
}

export default GUI;
