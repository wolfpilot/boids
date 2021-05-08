import * as dat from "dat.gui";

// Utils
import * as PubSub from "../services/pubSub";

const defaults = {
  showTargetVector: true,
  showNormalizedTargetVector: true,
  showAwarenessArea: true,
  showSeparationArea: true,
};

class GUI {
  public init(): void {
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
    const separationAreaController = gui.add(defaults, "showSeparationArea");

    targetVectorController.onChange((value: boolean) => {
      PubSub.publish("gui:showTargetVector", value);
    });

    normalizedVectorController.onChange((value: boolean) => {
      PubSub.publish("gui:showNormalizedTargetVector", value);
    });

    awarenessAreaController.onChange((value: boolean) => {
      PubSub.publish("gui:showAwarenessArea", value);
    });

    separationAreaController.onChange((value: boolean) => {
      PubSub.publish("gui:showSeparationArea", value);
    });
  }
}

export default GUI;
