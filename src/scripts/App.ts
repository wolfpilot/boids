interface IState {
  isRunning: boolean;
}

interface IApp {
  state: IState;
}

// Setup
let startTimestamp: number;

const initialState = {
  isRunning: false,
};

// Setup
class App implements IApp {
  public state = {
    ...initialState,
  };

  public init() {
    requestAnimationFrame(this.tick);
  }

  private tick = (timestamp: number) => {
    if (!this.state.isRunning) {
      return;
    }

    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    // The elapsed time since starting a new animation cycle
    const elapsed = timestamp - startTimestamp;

    console.log(elapsed);

    requestAnimationFrame(newTimestamp => this.tick(newTimestamp));
  };
}

export default App;
